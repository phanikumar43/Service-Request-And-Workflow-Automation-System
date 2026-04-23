package com.servicedesk.repository;

import com.servicedesk.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Approval entity
 */
@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    List<Approval> findByRequestId(Long requestId);

    List<Approval> findByApproverId(Long approverId);

    List<Approval> findByApproverIdAndStatus(Long approverId, Approval.ApprovalStatus status);

    List<Approval> findByStatus(Approval.ApprovalStatus status);

    @Query("SELECT a FROM Approval a WHERE a.status = 'PENDING' AND a.createdAt < :timeoutDate")
    List<Approval> findPendingApprovalsForEscalation(@Param("timeoutDate") LocalDateTime timeoutDate);
}
