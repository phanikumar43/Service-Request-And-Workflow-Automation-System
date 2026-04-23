package com.servicedesk.repository;

import com.servicedesk.entity.SLATracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for SLA Tracking Entity
 */
@Repository
public interface SLATrackingRepository extends JpaRepository<SLATracking, Long> {

    /**
     * Find tracking by request ID
     */
    Optional<SLATracking> findByRequestId(Long requestId);

    /**
     * Find overdue requests (resolution time passed and not breached yet)
     */
    List<SLATracking> findByResolutionDueAtBeforeAndBreachedFalse(LocalDateTime now);

    /**
     * Find requests approaching deadline
     */
    List<SLATracking> findByResolutionDueAtBetweenAndBreachedFalse(
            LocalDateTime start,
            LocalDateTime end);

    /**
     * Count breached SLAs
     */
    long countByBreachedTrue();

    /**
     * Find response SLA breaches
     */
    @Query("SELECT s FROM SLATracking s WHERE s.responseDueAt < :now AND s.responseMet = false AND s.breached = false")
    List<SLATracking> findResponseSLABreaches(@Param("now") LocalDateTime now);

    /**
     * Find resolution SLA breaches
     */
    @Query("SELECT s FROM SLATracking s WHERE s.resolutionDueAt < :now AND s.resolutionMet = false AND s.breached = false")
    List<SLATracking> findResolutionSLABreaches(@Param("now") LocalDateTime now);

    /**
     * Count response breaches
     */
    @Query("SELECT COUNT(s) FROM SLATracking s WHERE s.responseDueAt < CURRENT_TIMESTAMP AND s.responseMet = false")
    long countResponseBreaches();

    /**
     * Count resolution breaches
     */
    @Query("SELECT COUNT(s) FROM SLATracking s WHERE s.resolutionDueAt < CURRENT_TIMESTAMP AND s.resolutionMet = false")
    long countResolutionBreaches();
}
