package com.servicedesk.service;

import com.servicedesk.dto.AdminRequestDTO;
import com.servicedesk.dto.ApproveRequestDTO;
import com.servicedesk.dto.RejectRequestDTO;
import com.servicedesk.dto.ResolveRequestDTO;
import com.servicedesk.dto.UpdateStatusDTO;
import com.servicedesk.entity.RequestStatusHistory;
import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.entity.User;
import com.servicedesk.repository.RequestStatusHistoryRepository;
import com.servicedesk.repository.ServiceRequestRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentRequestService {

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private EmailService emailService;

    public Page<AdminRequestDTO> getDepartmentRequests(String status, Pageable pageable) {
        User currentUser = getCurrentUser();
        if (currentUser.getDepartment() == null) {
            return Page.empty();
        }

        System.out.println("DEBUG: Fetching requests for user: " + currentUser.getUsername() + ", Department: "
                + currentUser.getDepartment());

        Specification<ServiceRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Safe check for null department in request
            if (currentUser.getDepartment() != null) {
                // Case insensitive match
                predicates.add(cb.equal(cb.lower(root.get("department").get("name")),
                        currentUser.getDepartment().toLowerCase()));
            }

            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), ServiceRequest.RequestStatus.valueOf(status)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ServiceRequest> requests = requestRepository.findAll(spec, pageable);
        List<AdminRequestDTO> dtos = requests.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, requests.getTotalElements());
    }

    public Page<AdminRequestDTO> getAssignedRequests(String username, String status, Pageable pageable) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Specification<ServiceRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by assigned user
            predicates.add(cb.equal(root.get("assignedTo").get("id"), user.getId()));

            // Filter by status if provided
            if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(root.get("status"), ServiceRequest.RequestStatus.valueOf(status)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ServiceRequest> requests = requestRepository.findAll(spec, pageable);
        List<AdminRequestDTO> dtos = requests.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, requests.getTotalElements());
    }

    public AdminRequestDTO updateStatus(Long requestId, UpdateStatusDTO dto) {
        ServiceRequest request = getRequestForDepartment(requestId);

        ServiceRequest.RequestStatus oldStatus = request.getStatus();
        ServiceRequest.RequestStatus newStatus = ServiceRequest.RequestStatus.valueOf(dto.getStatus());

        request.setStatus(newStatus);
        request.setLastUpdatedBy(getCurrentUser());
        ServiceRequest savedRequest = requestRepository.save(request);

        logStatusChange(savedRequest, "Status changed from " + oldStatus + " to " + newStatus +
                (dto.getNotes() != null ? ". Notes: " + dto.getNotes() : ""));

        return convertToDTO(savedRequest);
    }

    public AdminRequestDTO resolveRequest(Long requestId, ResolveRequestDTO dto) {
        ServiceRequest request = getRequestForDepartment(requestId);

        request.setStatus(ServiceRequest.RequestStatus.RESOLVED);
        request.setResolutionNotes(dto.getResolutionNotes());
        request.setResolvedAt(LocalDateTime.now());
        request.setLastUpdatedBy(getCurrentUser());

        ServiceRequest savedRequest = requestRepository.save(request);

        logStatusChange(savedRequest, "Request Resolved. Notes: " + dto.getResolutionNotes());

        // Trigger Email
        try {
            emailService.sendRequestStatusUpdateEmail(savedRequest);
        } catch (Exception e) {
            System.err.println("Failed to send resolution email: " + e.getMessage());
            e.printStackTrace();
        }

        return convertToDTO(savedRequest);
    }

    public AdminRequestDTO approveRequest(Long requestId, ApproveRequestDTO dto) {
        ServiceRequest request = getRequestForDepartment(requestId);

        if (request.getStatus() != ServiceRequest.RequestStatus.PENDING_APPROVAL) {
            throw new IllegalArgumentException("Only requests with PENDING_APPROVAL status can be approved");
        }

        request.setStatus(ServiceRequest.RequestStatus.APPROVED);
        request.setLastUpdatedBy(getCurrentUser());
        ServiceRequest savedRequest = requestRepository.save(request);

        String notes = dto.getNotes() != null ? dto.getNotes() : "Request approved";
        logStatusChange(savedRequest, "Request Approved. " + notes);

        return convertToDTO(savedRequest);
    }

    public AdminRequestDTO rejectRequest(Long requestId, RejectRequestDTO dto) {
        ServiceRequest request = getRequestForDepartment(requestId);

        if (request.getStatus() != ServiceRequest.RequestStatus.PENDING_APPROVAL) {
            throw new IllegalArgumentException("Only requests with PENDING_APPROVAL status can be rejected");
        }

        request.setStatus(ServiceRequest.RequestStatus.REJECTED);
        request.setRejectionReason(dto.getRejectionReason());
        request.setLastUpdatedBy(getCurrentUser());
        ServiceRequest savedRequest = requestRepository.save(request);

        logStatusChange(savedRequest, "Request Rejected. Reason: " + dto.getRejectionReason());

        return convertToDTO(savedRequest);
    }

    private ServiceRequest getRequestForDepartment(Long requestId) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        User currentUser = getCurrentUser();

        // Allow if request is assigned to the current user
        if (request.getAssignedTo() != null && request.getAssignedTo().getId().equals(currentUser.getId())) {
            return request;
        }

        // Otherwise check department match
        if (request.getDepartment() == null || currentUser.getDepartment() == null ||
                !request.getDepartment().getName().equalsIgnoreCase(currentUser.getDepartment())) {
            throw new IllegalArgumentException("Access denied: Request does not belong to your department");
        }
        return request;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void logStatusChange(ServiceRequest request, String notes) {
        RequestStatusHistory history = new RequestStatusHistory();
        history.setRequest(request);
        history.setFromStatus(request.getStatus().toString()); // Simplified for now
        history.setToStatus(request.getStatus().toString());
        history.setChangedBy(getCurrentUser());
        history.setRemarks(notes);
        statusHistoryRepository.save(history);
    }

    private AdminRequestDTO convertToDTO(ServiceRequest request) {
        AdminRequestDTO dto = new AdminRequestDTO();
        dto.setId(request.getId());
        dto.setTicketId(request.getTicketId());
        dto.setUserName(request.getRequester().getUsername());
        dto.setUserEmail(request.getRequester().getEmail());
        dto.setCategoryName(request.getCategoryName());
        dto.setTypeName(request.getRequestType() != null ? request.getRequestType().getName() : "N/A");
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setPriority(request.getPriority().toString());
        dto.setStatus(request.getStatus().toString());
        dto.setDepartmentId(request.getDepartment() != null ? request.getDepartment().getId() : null);
        dto.setDepartmentName(request.getDepartment() != null ? request.getDepartment().getName() : "Unassigned");
        dto.setAssignedAgentName(
                request.getAssignedAgent() != null ? request.getAssignedAgent().getUsername() : "Unassigned");
        dto.setRejectionReason(request.getRejectionReason());
        dto.setLastUpdatedBy(request.getLastUpdatedBy() != null ? request.getLastUpdatedBy().getUsername() : null);
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
}
