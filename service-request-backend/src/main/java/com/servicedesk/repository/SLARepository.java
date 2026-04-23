package com.servicedesk.repository;

import com.servicedesk.entity.SLA;
import com.servicedesk.entity.SLA.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for SLA Entity
 */
@Repository
public interface SLARepository extends JpaRepository<SLA, Long> {

    /**
     * Find SLA by priority
     */
    Optional<SLA> findByPriority(Priority priority);
}
