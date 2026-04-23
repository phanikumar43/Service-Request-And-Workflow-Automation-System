package com.servicedesk.repository;

import com.servicedesk.entity.RequestStatusHistory;
import com.servicedesk.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RequestStatusHistory entity
 */
@Repository
public interface RequestStatusHistoryRepository extends JpaRepository<RequestStatusHistory, Long> {

    List<RequestStatusHistory> findByRequestOrderByChangedAtDesc(ServiceRequest request);

    List<RequestStatusHistory> findByRequestIdOrderByChangedAtDesc(Long requestId);
}
