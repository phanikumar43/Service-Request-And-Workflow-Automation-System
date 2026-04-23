package com.servicedesk.service;

import com.servicedesk.dto.ServiceRequestDTO;
import com.servicedesk.entity.*;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.*;
import com.servicedesk.util.TicketIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service Request Service
 * Business logic for service request management
 */
@Service
@Transactional
public class ServiceRequestService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ServiceRequestService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    /**
     * Get my service requests
     */
    public Page<ServiceRequest> getMyServiceRequests(String username, Pageable pageable) {
        logger.info("=== GET MY REQUESTS DEBUG ===");
        logger.info("Requested username: '{}'", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        logger.info("Found user - ID: {}, Username: '{}', Email: '{}'",
                user.getId(), user.getUsername(), user.getEmail());

        Page<ServiceRequest> requests = serviceRequestRepository.findByRequesterId(user.getId(), pageable);

        logger.info("Found {} total requests for user ID: {}",
                requests.getTotalElements(), user.getId());
        logger.info("=============================");

        return requests;
    }

    /**
     * Get dashboard counts for user
     */
    public com.servicedesk.dto.DashboardCountDTO getDashboardCounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        long total = serviceRequestRepository.countByRequesterId(user.getId());
        long pending = serviceRequestRepository.countByRequesterIdAndStatus(user.getId(),
                ServiceRequest.RequestStatus.NEW);
        long completed = serviceRequestRepository.countByRequesterIdAndStatus(user.getId(),
                ServiceRequest.RequestStatus.RESOLVED)
                + serviceRequestRepository.countByRequesterIdAndStatus(user.getId(),
                        ServiceRequest.RequestStatus.CLOSED);
        long cancelled = serviceRequestRepository.countByRequesterIdAndStatus(user.getId(),
                ServiceRequest.RequestStatus.CANCELLED);

        return new com.servicedesk.dto.DashboardCountDTO(total, pending, completed, cancelled);
    }

    @Autowired
    private ServiceCatalogRepository serviceCatalogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private SLATrackingRepository slaTrackingRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private WorkflowInstanceRepository workflowInstanceRepository;

    /**
     * Create new service request
     * Supports both service-based and category/request-type-based flows
     */
    public ServiceRequest createServiceRequest(ServiceRequestDTO requestDTO, String username) {
        logger.info("=== CREATING SERVICE REQUEST ===");
        logger.info("Username: {}", username);
        logger.info("Request DTO: requestTypeId={}, categoryId={}, serviceId={}, title={}, priority={}",
                requestDTO.getRequestTypeId(), requestDTO.getCategoryId(),
                requestDTO.getServiceId(), requestDTO.getTitle(), requestDTO.getPriority());

        // Get requester
        User requester = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Create service request
        ServiceRequest request = new ServiceRequest();
        request.setTicketId(TicketIdGenerator.generateTicketId());
        request.setRequester(requester);
        request.setTitle(requestDTO.getTitle());
        request.setDescription(requestDTO.getDescription());
        request.setPriority(requestDTO.getPriority());

        // Handle category-based flow (new)
        if (requestDTO.getCategoryId() != null) {
            logger.info("Category-based request flow");
            ServiceCategory category = serviceCategoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", requestDTO.getCategoryId()));
            request.setCategory(category);
            logger.info("Category set: {}", category.getName());
        }

        // Handle request type (support both requestTypeId and legacy typeId)
        Long typeId = requestDTO.getRequestTypeId() != null ? requestDTO.getRequestTypeId() : requestDTO.getTypeId();
        // Only set request type if serviceId is NOT provided (legacy flow)
        if (typeId != null && requestDTO.getServiceId() == null) {
            logger.info("Setting request type: {}", typeId);
            RequestType requestType = requestTypeRepository.findById(typeId)
                    .orElseThrow(() -> new ResourceNotFoundException("RequestType", "id", typeId));
            request.setRequestType(requestType);
            logger.info("Request type set: {}", requestType.getName());
        }

        // Handle service (optional for category-based flow)
        ServiceCatalog service = null;
        if (requestDTO.getServiceId() != null) {
            logger.info("Service-based request flow");
            service = serviceCatalogRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service", "id", requestDTO.getServiceId()));
            request.setService(service);
            logger.info("Service set: {}", service.getName());

            // Auto-assign Department from Service Catalog
            if (service.getDepartment() != null && !service.getDepartment().isEmpty()) {
                String deptName = service.getDepartment().trim();
                logger.debug("Looking up department: '{}' (case-insensitive)", deptName);

                Department dept = departmentRepository.findByNameIgnoreCase(deptName)
                        .orElse(null);

                if (dept != null) {
                    request.setDepartment(dept);
                    request.setStatus(ServiceRequest.RequestStatus.ASSIGNED); // Auto-assign to Department Queue
                    logger.info("Auto-assigned department: {} (ID: {})", dept.getName(), dept.getId());
                } else {
                    logger.warn(
                            "Department '{}' defined in Service Catalog NOT FOUND in Department table. Request will be unassigned.",
                            deptName);
                }
            }
        } else {
            logger.info("No service specified - category/request-type-based request");
        }

        // Set initial status
        if (service != null && service.getRequiresApproval()) {
            request.setStatus(ServiceRequest.RequestStatus.PENDING_APPROVAL);
            logger.info("Status set to PENDING_APPROVAL (service requires approval)");
        } else {
            if (request.getStatus() == null) { // Might have been set to ASSIGNED above
                request.setStatus(ServiceRequest.RequestStatus.NEW);
            }
            logger.info("Status set to {}", request.getStatus());
        }

        ServiceRequest savedRequest = serviceRequestRepository.save(request);
        logger.info("Request saved with ID: {} and Ticket ID: {}", savedRequest.getId(), savedRequest.getTicketId());

        // Create SLA tracking if service has SLA defined
        if (service != null && service.getSla() != null) {
            createSLATracking(savedRequest, service.getSla());
            logger.info("SLA tracking created");
        }

        // Trigger workflow if exists
        triggerWorkflow(savedRequest);

        // Send Email Notification
        try {
            emailService.sendRequestCreatedEmail(savedRequest);
        } catch (Exception e) {
            logger.error("Failed to send created email for request " + savedRequest.getTicketId(), e);
        }

        logger.info("=== SERVICE REQUEST CREATED SUCCESSFULLY ===");
        return savedRequest;
    }

    /**
     * Get service request by ID
     */
    public ServiceRequest getServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", id));
    }

    /**
     * Get service request by ticket ID
     */
    public ServiceRequest getServiceRequestByTicketId(String ticketId) {
        return serviceRequestRepository.findByTicketId(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "ticketId", ticketId));
    }

    /**
     * Get all service requests with pagination
     */
    public Page<ServiceRequest> getAllServiceRequests(Pageable pageable) {
        return serviceRequestRepository.findAll(pageable);
    }

    /**
     * Get service requests by requester
     */
    public Page<ServiceRequest> getServiceRequestsByRequester(Long requesterId, Pageable pageable) {
        return serviceRequestRepository.findByRequesterId(requesterId, pageable);
    }

    /**
     * Get service requests by assigned agent
     */
    public Page<ServiceRequest> getServiceRequestsByAssignedTo(Long agentId, Pageable pageable) {
        return serviceRequestRepository.findByAssignedToId(agentId, pageable);
    }

    /**
     * Get service requests by status
     */
    public Page<ServiceRequest> getServiceRequestsByStatus(ServiceRequest.RequestStatus status, Pageable pageable) {
        return serviceRequestRepository.findByStatus(status, pageable);
    }

    /**
     * Update service request status
     */
    public ServiceRequest updateServiceRequestStatus(Long id, ServiceRequest.RequestStatus newStatus) {
        ServiceRequest request = getServiceRequestById(id);

        // Store old status for event
        ServiceRequest.RequestStatus oldStatus = request.getStatus();

        request.setStatus(newStatus);

        if (newStatus == ServiceRequest.RequestStatus.CLOSED) {
            request.setClosedAt(LocalDateTime.now());

            // Update SLA tracking - mark as resolution met
            SLATracking slaTracking = slaTrackingRepository.findByRequestId(id).orElse(null);
            if (slaTracking != null && !slaTracking.isResolutionMet()) {
                slaTracking.setResolutionMet(true);
                slaTrackingRepository.save(slaTracking);
            }
        }

        if (newStatus == ServiceRequest.RequestStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        }

        ServiceRequest saved = serviceRequestRepository.save(request);

        // Publish event for automation
        try {
            eventPublisher.publishEvent(
                    new com.servicedesk.event.RequestStatusChangeEvent(this, saved, oldStatus, newStatus));
            logger.info("Published status change event for request #{}: {} -> {}", id, oldStatus, newStatus);
        } catch (Exception e) {
            logger.error("Failed to publish status change event for request #{}", id, e);
        }

        // Send Email Notification
        try {
            emailService.sendRequestStatusUpdateEmail(saved);
        } catch (Exception e) {
            logger.error("Failed to send status update email for request " + saved.getTicketId(), e);
        }

        return saved;
    }

    /**
     * Assign service request to agent
     */
    public ServiceRequest assignServiceRequest(Long requestId, Long agentId) {
        ServiceRequest request = getServiceRequestById(requestId);
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", agentId));

        request.setAssignedTo(agent);
        request.setStatus(ServiceRequest.RequestStatus.ASSIGNED);

        ServiceRequest saved = serviceRequestRepository.save(request);

        // Send Email Notification
        try {
            emailService.sendRequestAssignedEmail(saved);
        } catch (Exception e) {
            logger.error("Failed to send assignment email for request " + saved.getTicketId(), e);
        }

        return saved;
    }

    /**
     * Cancel service request
     */
    public ServiceRequest cancelServiceRequest(Long id) {
        ServiceRequest request = getServiceRequestById(id);
        request.setStatus(ServiceRequest.RequestStatus.CANCELLED);
        request.setClosedAt(LocalDateTime.now());
        return serviceRequestRepository.save(request);
    }

    /**
     * Add resolution notes
     */
    public ServiceRequest addResolutionNotes(Long id, String notes) {
        ServiceRequest request = getServiceRequestById(id);
        request.setResolutionNotes(notes);
        request.setStatus(ServiceRequest.RequestStatus.RESOLVED);
        return serviceRequestRepository.save(request);
    }

    /**
     * Close a resolved request
     */
    public ServiceRequest closeRequest(Long id) {
        ServiceRequest request = getServiceRequestById(id);
        if (request.getStatus() != ServiceRequest.RequestStatus.RESOLVED) {
            throw new IllegalArgumentException("Only resolved requests can be closed");
        }
        request.setStatus(ServiceRequest.RequestStatus.CLOSED);
        request.setClosedAt(LocalDateTime.now());
        return serviceRequestRepository.save(request);
    }

    /**
     * Create SLA tracking for request
     */
    private void createSLATracking(ServiceRequest request, SLA sla) {
        SLATracking tracking = new SLATracking();
        tracking.setRequest(request);
        tracking.setSla(sla);

        LocalDateTime now = LocalDateTime.now();
        tracking.setResponseDueAt(now.plusHours(sla.getResponseTimeHours()));
        tracking.setResolutionDueAt(now.plusHours(sla.getResolutionTimeHours()));

        slaTrackingRepository.save(tracking);
    }

    /**
     * Trigger workflow for request
     */
    private void triggerWorkflow(ServiceRequest request) {
        // Only trigger workflow if service is specified
        if (request.getService() == null) {
            logger.info("No service specified - skipping workflow trigger");
            return;
        }

        workflowRepository.findByServiceIdAndIsActive(request.getService().getId(), true)
                .ifPresent(workflow -> {
                    WorkflowInstance instance = new WorkflowInstance();
                    instance.setRequest(request);
                    instance.setWorkflow(workflow);
                    instance.setStatus(WorkflowInstance.InstanceStatus.PENDING);
                    workflowInstanceRepository.save(instance);
                });
    }
}
