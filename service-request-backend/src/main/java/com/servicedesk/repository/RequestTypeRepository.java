package com.servicedesk.repository;

import com.servicedesk.entity.RequestType;
import com.servicedesk.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RequestType entity
 */
@Repository
public interface RequestTypeRepository extends JpaRepository<RequestType, Long> {

    List<RequestType> findByCategoryAndIsActiveTrue(ServiceCategory category);

    List<RequestType> findByCategoryIdAndIsActiveTrue(Long categoryId);

    List<RequestType> findByIsActiveTrue();
}
