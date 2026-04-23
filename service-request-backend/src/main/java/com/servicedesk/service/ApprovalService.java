package com.servicedesk.service;

import com.servicedesk.entity.*;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Approval Service
 * Business logic for approval management
 */
@Service
@Transactional
public class ApprovalService {

    @Autowired
    private ApprovalRepository approvalRepository;

    @Autowired
    private ApprovalHistoryRepository approvalHistoryRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Create approval request
     */
    public Approval createApproval(ServiceRequest request, User approver, WorkflowStep workflowStep) {
        Approval approval = new Approval();
        approval.setRequest(request);
        approval.setApprover(approver);
        approval.setWorkflowStep(workflowStep);
        approval.setStatus(Approval.ApprovalStatus.PENDING);

        Approval savedApproval = approvalRepository.save(approval);

        // Create history entry
        createApprovalHistory(savedApproval, ApprovalHistory.ApprovalAction.SUBMITTED, approver, null);

        // Send notification to approver
        notificationService.createNotification(
                approver,
                "New Approval Request",
                String.format("Service request %s requires your approval.", request.getTicketId()),
                Notification.NotificationType.INFO,
                request);

        return savedApproval;
    }

    /**
     * Get pending approvals for approver
     */
    public List<Approval> getPendingApprovals(Long approverId) {
        return approvalRepository.findByApproverIdAndStatus(approverId, Approval.ApprovalStatus.PENDING);
    }

    /**
     * Get approval by ID
     */
    public Approval getApprovalById(Long id) {
        return approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval", "id", id));
    }

    /**
     * Get approvals for request
     */
    public List<Approval> getApprovalsByRequest(Long requestId) {
        return approvalRepository.findByRequestId(requestId);
    }

    /**
     * Approve request
     */
    public Approval approveRequest(Long approvalId, String comments, String username) {
        Approval approval = getApprovalById(approvalId);
        User approver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        approval.setStatus(Approval.ApprovalStatus.APPROVED);
        approval.setComments(comments);
        approval.setApprovedAt(LocalDateTime.now());

        Approval savedApproval = approvalRepository.save(approval);

        // Create history entry
        createApprovalHistory(savedApproval, ApprovalHistory.ApprovalAction.APPROVED, approver, comments);

        // Update service request status
        ServiceRequest request = approval.getRequest();
        request.setStatus(ServiceRequest.RequestStatus.APPROVED);
        serviceRequestRepository.save(request);

        // Send notification to requester
        notificationService.createNotification(
                request.getRequester(),
                "Request Approved",
                String.format("Your service request %s has been approved.", request.getTicketId()),
                Notification.NotificationType.SUCCESS,
                request);

        return savedApproval;
    }

    /**
     * Reject request
     */
    public Approval rejectRequest(Long approvalId, String comments, String username) {
        Approval approval = getApprovalById(approvalId);
        User approver = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        approval.setStatus(Approval.ApprovalStatus.REJECTED);
        approval.setComments(comments);
        approval.setApprovedAt(LocalDateTime.now());

        Approval savedApproval = approvalRepository.save(approval);

        // Create history entry
        createApprovalHistory(savedApproval, ApprovalHistory.ApprovalAction.REJECTED, approver, comments);

        // Update service request status
        ServiceRequest request = approval.getRequest();
        request.setStatus(ServiceRequest.RequestStatus.REJECTED);
        request.setClosedAt(LocalDateTime.now());
        serviceRequestRepository.save(request);

        // Send notification to requester
        notificationService.createNotification(
                request.getRequester(),
                "Request Rejected",
                String.format("Your service request %s has been rejected. Reason: %s",
                        request.getTicketId(), comments),
                Notification.NotificationType.WARNING,
                request);

        return savedApproval;
    }

    /**
     * Escalate approval
     */
    public Approval escalateApproval(Long approvalId, Long escalateToUserId) {
        Approval approval = getApprovalById(approvalId);
        User escalateTo = userRepository.findById(escalateToUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", escalateToUserId));

        approval.setStatus(Approval.ApprovalStatus.ESCALATED);
        approval.setEscalatedTo(escalateTo);
        approval.setEscalatedAt(LocalDateTime.now());

        Approval savedApproval = approvalRepository.save(approval);

        // Create history entry
        createApprovalHistory(savedApproval, ApprovalHistory.ApprovalAction.ESCALATED, escalateTo,
                "Escalated due to timeout");

        // Send notification to escalated user
        notificationService.createNotification(
                escalateTo,
                "Escalated Approval",
                String.format("Service request %s has been escalated to you for approval.",
                        approval.getRequest().getTicketId()),
                Notification.NotificationType.WARNING,
                approval.getRequest());

        return savedApproval;
    }

    /**
     * Get approval history
     */
    public List<ApprovalHistory> getApprovalHistory(Long approvalId) {
        return approvalHistoryRepository.findByApprovalIdOrderByCreatedAtDesc(approvalId);
    }

    /**
     * Create approval history entry
     */
    private void createApprovalHistory(Approval approval, ApprovalHistory.ApprovalAction action,
            User performedBy, String comments) {
        ApprovalHistory history = new ApprovalHistory();
        history.setApproval(approval);
        history.setAction(action);
        history.setPerformedBy(performedBy);
        history.setComments(comments);
        approvalHistoryRepository.save(history);
    }
}
