package com.servicedesk.repository;

import com.servicedesk.entity.EmailAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailAuditLogRepository extends JpaRepository<EmailAuditLog, Long> {
    List<EmailAuditLog> findByRequestIdOrderBySentAtDesc(Long requestId);

    List<EmailAuditLog> findByRecipientOrderBySentAtDesc(String recipient);
}
