package com.servicedesk.repository;

import com.servicedesk.entity.ApprovalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ApprovalHistory entity
 */
@Repository
public interface ApprovalHistoryRepository extends JpaRepository<ApprovalHistory, Long> {

    List<ApprovalHistory> findByApprovalId(Long approvalId);

    List<ApprovalHistory> findByApprovalIdOrderByCreatedAtDesc(Long approvalId);
}
