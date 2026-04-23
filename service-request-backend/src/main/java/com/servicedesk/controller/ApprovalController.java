package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.entity.Approval;
import com.servicedesk.entity.ApprovalHistory;
import com.servicedesk.service.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Approval Controller
 * REST APIs for approval management
 */
@RestController
@RequestMapping("/approvals")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApprovalController {

    @Autowired
    private ApprovalService approvalService;

    /**
     * Get pending approvals for current user
     * GET /api/approvals/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingApprovals(Authentication authentication) {
        try {
            // In real implementation, get user ID from authentication
            // For now, returning empty list
            List<Approval> approvals = approvalService.getPendingApprovals(1L);
            return ResponseEntity.ok(approvals);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching approvals: " + e.getMessage()));
        }
    }

    /**
     * Get approval by ID
     * GET /api/approvals/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getApprovalById(@PathVariable Long id) {
        try {
            Approval approval = approvalService.getApprovalById(id);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching approval: " + e.getMessage()));
        }
    }

    /**
     * Get approvals for request
     * GET /api/approvals/request/{requestId}
     */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getApprovalsByRequest(@PathVariable Long requestId) {
        try {
            List<Approval> approvals = approvalService.getApprovalsByRequest(requestId);
            return ResponseEntity.ok(approvals);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching approvals: " + e.getMessage()));
        }
    }

    /**
     * Approve request
     * POST /api/approvals/{id}/approve
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String comments,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Approval approval = approvalService.approveRequest(id, comments, username);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error approving request: " + e.getMessage()));
        }
    }

    /**
     * Reject request
     * POST /api/approvals/{id}/reject
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestParam String comments,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Approval approval = approvalService.rejectRequest(id, comments, username);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error rejecting request: " + e.getMessage()));
        }
    }

    /**
     * Get approval history
     * GET /api/approvals/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getApprovalHistory(@PathVariable Long id) {
        try {
            List<ApprovalHistory> history = approvalService.getApprovalHistory(id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching history: " + e.getMessage()));
        }
    }
}
