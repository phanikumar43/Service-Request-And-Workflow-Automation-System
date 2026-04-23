package com.servicedesk.repository;

import com.servicedesk.entity.RequestComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for RequestComment entity
 */
@Repository
public interface RequestCommentRepository extends JpaRepository<RequestComment, Long> {

    List<RequestComment> findByRequestId(Long requestId);

    List<RequestComment> findByRequestIdOrderByCreatedAtDesc(Long requestId);

    List<RequestComment> findByRequestIdAndIsInternal(Long requestId, Boolean isInternal);
}
