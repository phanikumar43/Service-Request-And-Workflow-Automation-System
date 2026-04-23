package com.servicedesk.repository;

import com.servicedesk.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ActivityLog entity
 */
@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    /**
     * Find all activity logs for a specific request, ordered by creation time
     * descending
     */
    List<ActivityLog> findByRequestIdOrderByCreatedAtDesc(Long requestId);

    /**
     * Find activity logs by action type
     */
    List<ActivityLog> findByActionTypeOrderByCreatedAtDesc(String actionType);

    /**
     * Find activity logs performed by a specific user
     */
    List<ActivityLog> findByPerformedByIdOrderByCreatedAtDesc(Long userId);
}
