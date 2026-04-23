package com.servicedesk.repository;

import com.servicedesk.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Task entity
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByRequestId(Long requestId);

    List<Task> findByAssignedToId(Long assignedToId);

    Page<Task> findByAssignedToId(Long assignedToId, Pageable pageable);

    List<Task> findByAssignedToIdAndStatus(Long assignedToId, Task.TaskStatus status);

    List<Task> findByStatus(Task.TaskStatus status);
}
