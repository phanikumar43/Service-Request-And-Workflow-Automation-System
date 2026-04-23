package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.entity.Task;
import com.servicedesk.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Task Controller
 * REST APIs for task management
 */
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * Get my tasks (assigned to current user)
     * GET /api/tasks/my-tasks
     */
    @GetMapping("/my-tasks")
    public ResponseEntity<?> getMyTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // In real implementation, get user ID from authentication
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Task> tasks = taskService.getTasksByAgent(1L, pageable);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching tasks: " + e.getMessage()));
        }
    }

    /**
     * Get pending tasks for current user
     * GET /api/tasks/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingTasks(Authentication authentication) {
        try {
            // In real implementation, get user ID from authentication
            List<Task> tasks = taskService.getPendingTasksByAgent(1L);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching tasks: " + e.getMessage()));
        }
    }

    /**
     * Get task by ID
     * GET /api/tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching task: " + e.getMessage()));
        }
    }

    /**
     * Update task status
     * PATCH /api/tasks/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam Task.TaskStatus status) {
        try {
            Task task = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error updating status: " + e.getMessage()));
        }
    }

    /**
     * Add task notes/update description
     * PUT /api/tasks/{id}/notes
     */
    @PutMapping("/{id}/notes")
    public ResponseEntity<?> updateTaskNotes(
            @PathVariable Long id,
            @RequestBody String description) {
        try {
            Task task = taskService.updateTaskDescription(id, description);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error updating notes: " + e.getMessage()));
        }
    }

    /**
     * Reassign task
     * POST /api/tasks/{id}/reassign
     */
    @PostMapping("/{id}/reassign")
    public ResponseEntity<?> reassignTask(
            @PathVariable Long id,
            @RequestParam Long agentId) {
        try {
            Task task = taskService.reassignTask(id, agentId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error reassigning task: " + e.getMessage()));
        }
    }

    /**
     * Complete task with resolution
     * POST /api/tasks/{id}/complete
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeTask(
            @PathVariable Long id,
            @RequestBody String resolutionNotes) {
        try {
            Task task = taskService.completeTask(id, resolutionNotes);
            return ResponseEntity.ok(new ApiResponse(true, "Task completed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error completing task: " + e.getMessage()));
        }
    }

    /**
     * Get tasks for request
     * GET /api/tasks/request/{requestId}
     */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getTasksByRequest(@PathVariable Long requestId) {
        try {
            List<Task> tasks = taskService.getTasksByRequest(requestId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error fetching tasks: " + e.getMessage()));
        }
    }
}
