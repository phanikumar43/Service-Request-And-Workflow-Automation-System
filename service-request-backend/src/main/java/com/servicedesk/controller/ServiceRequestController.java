package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.dto.ServiceRequestDTO;
import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.service.ServiceRequestService;
import com.servicedesk.service.AutoAssignmentService;
import com.servicedesk.service.SLAService;
import com.servicedesk.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Service Request Controller
 * REST APIs for service request management
 */
@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServiceRequestController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ServiceRequestController.class);

    @Autowired
    private ServiceRequestService serviceRequestService;

    // Automation Services
    @Autowired
    private AutoAssignmentService autoAssignmentService;

    @Autowired
    private SLAService slaService;

    @Autowired
    private EmailService emailService;

    /**
     * Create new service request
     * POST /api/requests
     */
    @PostMapping
    public ResponseEntity<?> createServiceRequest(
            @Valid @RequestBody ServiceRequestDTO requestDTO,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ServiceRequest request = serviceRequestService.createServiceRequest(requestDTO, username);

            // AUTOMATION: Auto-assign to department
            try {
                autoAssignmentService.autoAssignRequest(request);
                logger.info("Auto-assignment triggered for request #{}", request.getId());
            } catch (Exception e) {
                logger.error("Auto-assignment failed for request #{}", request.getId(), e);
            }

            // AUTOMATION: Start SLA tracking
            try {
                slaService.startSLATracking(request);
                logger.info("SLA tracking started for request #{}", request.getId());
            } catch (Exception e) {
                logger.error("SLA tracking failed for request #{}", request.getId(), e);
            }

            // AUTOMATION: Send creation email
            try {
                emailService.sendRequestCreatedEmail(request);
                logger.info("Creation email sent for request #{}", request.getId());
            } catch (Exception e) {
                logger.error("Email sending failed for request #{}", request.getId(), e);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error creating service request: " + e.getMessage()));
        }
    }

    /**
     * Get service request by ID
     * GET /api/requests/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequest> getServiceRequestById(@PathVariable Long id) {
        ServiceRequest request = serviceRequestService.getServiceRequestById(id);
        return ResponseEntity.ok(request);
    }

    /**
     * Get service request by ticket ID
     * GET /api/requests/ticket/{ticketId}
     */
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ServiceRequest> getServiceRequestByTicketId(@PathVariable String ticketId) {
        ServiceRequest request = serviceRequestService.getServiceRequestByTicketId(ticketId);
        return ResponseEntity.ok(request);
    }

    /**
     * Get all service requests with pagination
     * GET /api/requests?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<ServiceRequest>> getAllServiceRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ServiceRequest> requests = serviceRequestService.getAllServiceRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get my service requests
     * GET /api/requests/my-requests
     */
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyServiceRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Get username from authentication or SecurityContext
            String username;
            if (authentication != null && authentication.getName() != null) {
                username = authentication.getName();
            } else {
                // Fallback to SecurityContextHolder
                authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || authentication.getName() == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ApiResponse(false, "User not authenticated"));
                }
                username = authentication.getName();
            }

            logger.debug("Fetching requests for user: {}", username);

            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<ServiceRequest> requests = serviceRequestService.getMyServiceRequests(username, pageable);

            logger.debug("Found {} requests for user {}", requests.getTotalElements(), username);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error fetching user requests", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching requests: " + e.getMessage()));
        }
    }

    /**
     * Get dashboard counts for current user
     * GET /api/requests/dashboard/counts
     */
    @GetMapping("/dashboard/counts")
    public ResponseEntity<?> getDashboardCounts(Authentication authentication) {
        try {
            // Get username from authentication or SecurityContext
            String username;
            if (authentication != null && authentication.getName() != null) {
                username = authentication.getName();
            } else {
                authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || authentication.getName() == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ApiResponse(false, "User not authenticated"));
                }
                username = authentication.getName();
            }

            logger.debug("Fetching dashboard counts for user: {}", username);
            com.servicedesk.dto.DashboardCountDTO counts = serviceRequestService.getDashboardCounts(username);
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            logger.error("Error fetching dashboard counts", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching dashboard counts: " + e.getMessage()));
        }
    }

    /**
     * Get service requests by status
     * GET /api/requests/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ServiceRequest>> getServiceRequestsByStatus(
            @PathVariable ServiceRequest.RequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ServiceRequest> requests = serviceRequestService.getServiceRequestsByStatus(status, pageable);
        return ResponseEntity.ok(requests);
    }

    /**
     * Update service request status
     * PATCH /api/requests/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateServiceRequestStatus(
            @PathVariable Long id,
            @RequestParam ServiceRequest.RequestStatus status) {
        try {
            ServiceRequest request = serviceRequestService.updateServiceRequestStatus(id, status);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error updating status: " + e.getMessage()));
        }
    }

    /**
     * Assign service request to agent
     * POST /api/requests/{id}/assign
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignServiceRequest(
            @PathVariable Long id,
            @RequestParam Long agentId) {
        try {
            ServiceRequest request = serviceRequestService.assignServiceRequest(id, agentId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error assigning request: " + e.getMessage()));
        }
    }

    /**
     * Cancel service request
     * DELETE /api/requests/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelServiceRequest(@PathVariable Long id) {
        try {
            ServiceRequest request = serviceRequestService.cancelServiceRequest(id);
            return ResponseEntity.ok(new ApiResponse(true, "Service request cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error cancelling request: " + e.getMessage()));
        }
    }

    /**
     * Add resolution notes
     * POST /api/requests/{id}/resolve
     */
    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> addResolutionNotes(
            @PathVariable Long id,
            @RequestBody String notes) {
        try {
            ServiceRequest request = serviceRequestService.addResolutionNotes(id, notes);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error adding resolution: " + e.getMessage()));
        }
    }

    /**
     * Close a resolved request
     * PUT /api/requests/{id}/close
     */
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeRequest(@PathVariable Long id) {
        try {
            ServiceRequest request = serviceRequestService.closeRequest(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error closing request: " + e.getMessage()));
        }
    }
}
