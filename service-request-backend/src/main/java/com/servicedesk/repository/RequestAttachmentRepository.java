package com.servicedesk.repository;

import com.servicedesk.entity.RequestAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for RequestAttachment entity
 */
@Repository
public interface RequestAttachmentRepository extends JpaRepository<RequestAttachment, Long> {

    List<RequestAttachment> findByRequestId(Long requestId);

    List<RequestAttachment> findByUploadedById(Long uploadedById);
}
