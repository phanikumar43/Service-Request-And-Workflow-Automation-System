package com.servicedesk.repository;

import com.servicedesk.entity.ServiceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ServiceRequest entity
 */
@Repository
public interface ServiceRequestRepository
                extends JpaRepository<ServiceRequest, Long>, JpaSpecificationExecutor<ServiceRequest> {

        Optional<ServiceRequest> findByTicketId(String ticketId);

        List<ServiceRequest> findByRequesterId(Long requesterId);

        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {
                        "service", "service.category", "service.sla",
                        "requester", "assignedTo", "category", "requestType",
                        "department", "assignedAgent"
        })
        Page<ServiceRequest> findByRequesterId(Long requesterId, Pageable pageable);

        List<ServiceRequest> findByAssignedToId(Long assignedToId);

        Page<ServiceRequest> findByAssignedToId(Long assignedToId, Pageable pageable);

        List<ServiceRequest> findByStatus(ServiceRequest.RequestStatus status);

        // Dashboard count methods
        long countByRequesterId(Long requesterId);

        long countByRequesterIdAndStatus(Long requesterId, ServiceRequest.RequestStatus status);

        Page<ServiceRequest> findByStatus(ServiceRequest.RequestStatus status, Pageable pageable);

        List<ServiceRequest> findByPriority(ServiceRequest.Priority priority);

        Page<ServiceRequest> findByPriority(ServiceRequest.Priority priority, Pageable pageable);

        @Query("SELECT sr FROM ServiceRequest sr WHERE sr.service.category.id = :categoryId")
        List<ServiceRequest> findByCategoryId(@Param("categoryId") Long categoryId);

        @Query("SELECT sr FROM ServiceRequest sr WHERE sr.createdAt BETWEEN :startDate AND :endDate")
        List<ServiceRequest> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.status = :status")
        Long countByStatus(@Param("status") ServiceRequest.RequestStatus status);

        @Query("SELECT COUNT(sr) FROM ServiceRequest sr WHERE sr.priority = :priority")
        Long countByPriority(@Param("priority") ServiceRequest.Priority priority);

        // Find requests by status and resolved date (for auto-closing)
        List<ServiceRequest> findByStatusAndResolvedAtBefore(ServiceRequest.RequestStatus status,
                        LocalDateTime resolvedAt);

        @Override
        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {
                        "service", "service.category",
                        "requester", "assignedTo", "category", "requestType",
                        "department", "assignedAgent"
        })
        Page<ServiceRequest> findAll(org.springframework.data.jpa.domain.Specification<ServiceRequest> spec,
                        Pageable pageable);
}
