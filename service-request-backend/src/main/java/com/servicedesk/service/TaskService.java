package com.servicedesk.service;

import com.servicedesk.entity.*;
import com.servicedesk.entity.Task;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.*;
import com.servicedesk.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Task Service
 * Business logic for task management
 */
@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Create task
     */
    public Task createTask(ServiceRequest request, User assignedTo, String title, String description) {
        Task task = new Task();
        task.setRequest(request);
        task.setAssignedTo(assignedTo);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(request.getPriority());
        task.setStatus(Task.TaskStatus.PENDING);

        // Set due date based on SLA
        if (request.getService().getSla() != null) {
            task.setDueDate(LocalDateTime.now().plusHours(
                    request.getService().getSla().getResolutionTimeHours()));
        }

        Task savedTask = taskRepository.save(task);

        // Update request status and assignment
        request.setAssignedTo(assignedTo);
        request.setStatus(ServiceRequest.RequestStatus.ASSIGNED);
        serviceRequestRepository.save(request);

        // Send notification
        notificationService.sendAssignmentNotification(request);

        return savedTask;
    }

    /**
     * Get task by ID
     */
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    /**
     * Get tasks assigned to agent
     */
    public Page<Task> getTasksByAgent(Long agentId, Pageable pageable) {
        return taskRepository.findByAssignedToId(agentId, pageable);
    }

    /**
     * Get pending tasks for agent
     */
    public List<Task> getPendingTasksByAgent(Long agentId) {
        return taskRepository.findByAssignedToIdAndStatus(agentId, Task.TaskStatus.PENDING);
    }

    /**
     * Get tasks by status
     */
    public List<Task> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    /**
     * Update task status
     */
    public Task updateTaskStatus(Long taskId, Task.TaskStatus newStatus) {
        Task task = getTaskById(taskId);
        task.setStatus(newStatus);

        // Update service request status accordingly
        ServiceRequest request = task.getRequest();
        if (newStatus == Task.TaskStatus.IN_PROGRESS) {
            request.setStatus(ServiceRequest.RequestStatus.IN_PROGRESS);
        } else if (newStatus == Task.TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
            request.setStatus(ServiceRequest.RequestStatus.RESOLVED);
        }

        serviceRequestRepository.save(request);
        notificationService.sendStatusChangeNotification(request);

        return taskRepository.save(task);
    }

    /**
     * Add task notes/update
     */
    public Task updateTaskDescription(Long taskId, String description) {
        Task task = getTaskById(taskId);
        task.setDescription(description);
        return taskRepository.save(task);
    }

    /**
     * Reassign task
     */
    public Task reassignTask(Long taskId, Long newAgentId) {
        Task task = getTaskById(taskId);
        User newAgent = userRepository.findById(newAgentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", newAgentId));

        task.setAssignedTo(newAgent);

        // Update service request assignment
        ServiceRequest request = task.getRequest();
        request.setAssignedTo(newAgent);
        serviceRequestRepository.save(request);

        // Send notification to new agent
        notificationService.sendAssignmentNotification(request);

        return taskRepository.save(task);
    }

    /**
     * Complete task with resolution
     */
    public Task completeTask(Long taskId, String resolutionNotes) {
        Task task = getTaskById(taskId);
        task.setStatus(Task.TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());

        // Update service request
        ServiceRequest request = task.getRequest();
        request.setStatus(ServiceRequest.RequestStatus.RESOLVED);
        request.setResolutionNotes(resolutionNotes);
        serviceRequestRepository.save(request);

        // Send notification
        notificationService.createNotification(
                request.getRequester(),
                "Request Resolved",
                String.format("Your service request %s has been resolved.", request.getTicketId()),
                Notification.NotificationType.SUCCESS,
                request);

        return taskRepository.save(task);
    }

    /**
     * Get tasks for request
     */
    public List<Task> getTasksByRequest(Long requestId) {
        return taskRepository.findByRequestId(requestId);
    }
}
