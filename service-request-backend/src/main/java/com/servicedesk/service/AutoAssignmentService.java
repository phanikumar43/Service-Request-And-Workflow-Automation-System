package com.servicedesk.service;

import com.servicedesk.entity.*;
import com.servicedesk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Auto-Assignment Service
 * Automatically assigns service requests to departments based on category
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AutoAssignmentService {

    private final CategoryDepartmentMappingRepository mappingRepository;
    private final ServiceRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    /**
     * Auto-assign request to department based on category
     * 
     * @param request The service request to assign
     */
    @Transactional
    public void autoAssignRequest(ServiceRequest request) {
        try {
            log.info("Starting auto-assignment for request #{}", request.getId());

            // Find department mapping for the request's category
            CategoryDepartmentMapping mapping = mappingRepository
                    .findByCategoryId(request.getCategory().getId())
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "No department mapping found for category: " +
                                    request.getCategory().getName()));

            // Assign to department
            request.setDepartment(mapping.getDepartment());

            // Assign to 'phani' (try exact match first, then fuzzy match)
            userRepository.findByUsername("phani")
                    .or(() -> userRepository.findAll().stream()
                            .filter(u -> u.getUsername().toLowerCase().contains("phani"))
                            .findFirst())
                    .ifPresentOrElse(
                            user -> {
                                request.setAssignedTo(user);
                                request.setStatus(ServiceRequest.RequestStatus.ASSIGNED);
                                log.info("Request #{} auto-assigned to user: phani", request.getId());
                            },
                            () -> {
                                request.setStatus(ServiceRequest.RequestStatus.ASSIGNED);
                                log.warn("User 'phani' not found for auto-assignment");
                            });

            requestRepository.save(request);

            log.info("Request #{} auto-assigned to department: {}",
                    request.getId(),
                    mapping.getDepartment().getName());

            // Create notification for department
            try {
                notificationService.notifyDepartment(
                        mapping.getDepartment(),
                        "New Request Assigned",
                        String.format("Request #%d (%s) has been assigned to your department.",
                                request.getId(),
                                request.getTitle()));
            } catch (Exception e) {
                log.warn("Failed to send notification for request #{}", request.getId(), e);
            }

        } catch (Exception e) {
            log.error("Auto-assignment failed for request #{}", request.getId(), e);
            // Don't fail the request creation, just log the error
            // Request will remain in NEW status for manual assignment
            request.setStatus(ServiceRequest.RequestStatus.NEW);
            requestRepository.save(request);
        }
    }

    /**
     * Check if auto-assignment is available for a category
     * 
     * @param categoryId The category ID
     * @return true if mapping exists
     */
    public boolean isAutoAssignmentAvailable(Long categoryId) {
        return !mappingRepository.findByCategoryId(categoryId).isEmpty();
    }
}
