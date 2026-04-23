package com.servicedesk.controller;

import com.servicedesk.dto.*;
import com.servicedesk.dto.UserProfileDTO;
import com.servicedesk.entity.RequestStatusHistory;
import com.servicedesk.service.AdminRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Request Management Controller
 * Handles admin operations for managing service requests
 */
@RestController
@RequestMapping("/admin/requests")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    @Autowired
    private AdminRequestService adminRequestService;

    /**
     * Get all requests with filtering and pagination
     * GET /api/admin/requests?category=IT&department=IT
     * Support&priority=HIGH&status=NEW&page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRequests(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        System.out.println("=== ADMIN: Fetching requests ===");
        System.out.println("Filters - Category: " + category + ", Department: " + department +
                ", Priority: " + priority + ", Status: " + status);

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AdminRequestDTO> requests = adminRequestService.getAllRequests(
                category, department, priority, status, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("requests", requests.getContent());
        response.put("currentPage", requests.getNumber());
        response.put("totalItems", requests.getTotalElements());
        response.put("totalPages", requests.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * Assign request to department
     * POST /api/admin/requests/{id}/assign-department
     */
    @PostMapping("/{id}/assign-department")
    public ResponseEntity<?> assignDepartment(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid AssignDepartmentDTO dto) {
        System.out.println("=== ADMIN: Assigning department to request " + id + " ===");
        System.out.println("Department ID: " + dto.getDepartmentId());
        System.out.println("Notes: " + dto.getNotes());

        try {
            AdminRequestDTO updatedRequest = adminRequestService.assignDepartment(id, dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Department assigned successfully",
                    "request", updatedRequest));
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error assigning department: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Assign request to agent
     * POST /api/admin/requests/{id}/assign-agent
     */
    @PostMapping("/{id}/assign-agent")
    public ResponseEntity<?> assignAgent(
            @PathVariable Long id,
            @RequestBody AssignRequestDTO dto) {
        System.out.println("=== ADMIN: Assigning agent to request " + id + " ===");

        try {
            adminRequestService.assignAgent(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "message", "Agent assigned successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Update request status
     * PUT /api/admin/requests/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusDTO dto) {
        System.out.println("=== ADMIN: Updating status for request " + id + " ===");

        try {
            adminRequestService.updateStatus(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get request timeline (status history)
     * GET /api/admin/requests/{id}/timeline
     */
    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<RequestStatusHistory>> getTimeline(@PathVariable Long id) {
        System.out.println("=== ADMIN: Fetching timeline for request " + id + " ===");

        List<RequestStatusHistory> timeline = adminRequestService.getRequestTimeline(id);
        return ResponseEntity.ok(timeline);
    }

    /**
     * Update request priority
     * PATCH /api/admin/requests/{id}/priority
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<?> updatePriority(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid UpdatePriorityDTO dto) {
        System.out.println("=== ADMIN: Updating priority for request " + id + " ===");
        System.out.println("New Priority: " + dto.getPriority());

        try {
            AdminRequestDTO updatedRequest = adminRequestService.updatePriority(id, dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Priority updated successfully",
                    "request", updatedRequest));
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error updating priority: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Escalate request
     * POST /api/admin/requests/{id}/escalate
     */
    @PostMapping("/{id}/escalate")
    public ResponseEntity<?> escalateRequest(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid EscalateRequestDTO dto) {
        System.out.println("=== ADMIN: Escalating request " + id + " ===");
        System.out.println("Reason: " + dto.getReason());

        try {
            AdminRequestDTO updatedRequest = adminRequestService.escalateRequest(id, dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request escalated successfully",
                    "request", updatedRequest));
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error escalating request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Get comprehensive request details
     * GET /api/admin/requests/{id}/details
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getRequestDetails(@PathVariable Long id) {
        System.out.println("=== ADMIN: Fetching details for request " + id + " ===");

        try {
            RequestDetailsDTO details = adminRequestService.getRequestDetails(id);
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error fetching request details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Delete request (Admin only)
     * DELETE /api/admin/requests/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        System.out.println("=== ADMIN: Deleting request " + id + " ===");

        try {
            adminRequestService.deleteRequest(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Request deleted successfully"));
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error deleting request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Bulk assign requests to department or agent
     * POST /api/admin/requests/bulk-assign
     */
    @PostMapping("/bulk-assign")
    public ResponseEntity<?> bulkAssignRequests(@RequestBody BulkAssignmentDTO bulkAssignment) {
        System.out.println("=== ADMIN: Bulk assigning " + bulkAssignment.getRequestIds().size() + " requests ===");
        try {
            int assignedCount = adminRequestService.bulkAssignRequests(bulkAssignment);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", assignedCount + " requests assigned successfully",
                    "assignedCount", assignedCount));
        } catch (Exception e) {
            System.err.println("Error in bulk assignment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Failed to assign requests: " + e.getMessage()));
        }
    }

    /**
     * Get agent workload statistics
     * GET /api/admin/requests/agent-workload
     */
    @GetMapping("/agent-workload")
    public ResponseEntity<?> getAgentWorkload() {
        System.out.println("=== ADMIN: Fetching agent workload ===");
        try {
            Map<String, Object> workload = adminRequestService.getAgentWorkload();
            return ResponseEntity.ok(workload);
        } catch (Exception e) {
            System.err.println("Error fetching agent workload: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch agent workload"));
        }
    }

    /**
     * Get agents by department
     * GET /api/admin/requests/agents?departmentId={id}
     */
    @GetMapping("/agents")
    public ResponseEntity<?> getAgentsByDepartment(@RequestParam Long departmentId) {
        System.out.println("=== ADMIN: Fetching agents for department " + departmentId + " ===");
        try {
            List<UserProfileDTO> agents = adminRequestService.getAgentsByDepartment(departmentId);
            return ResponseEntity.ok(agents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error fetching agents: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }
}
