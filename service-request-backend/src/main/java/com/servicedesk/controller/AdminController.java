package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.entity.User;
import com.servicedesk.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin Controller
 * Handles admin-specific operations
 * All endpoints require ROLE_ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get all users
     * GET /api/admin/users
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Create new user
     * POST /api/admin/users
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        try {
            User user = new User();
            user.setUsername((String) request.get("username"));
            user.setEmail((String) request.get("email"));
            user.setPassword((String) request.get("password"));
            user.setFirstName((String) request.get("firstName"));
            user.setLastName((String) request.get("lastName"));
            user.setPhone((String) request.get("phone"));
            user.setDepartment((String) request.get("department"));
            user.setIsActive(true);

            String roleName = (String) request.getOrDefault("role", "ROLE_USER");
            User createdUser = adminService.createUser(user, roleName);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create user: " + e.getMessage()));
        }
    }

    /**
     * Update user
     * PUT /api/admin/users/{id}
     */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = adminService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update user: " + e.getMessage()));
        }
    }

    /**
     * Delete user (soft delete)
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to delete user: " + e.getMessage()));
        }
    }

    /**
     * Assign role to user
     * POST /api/admin/users/{id}/roles
     */
    @PostMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> assignRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String roleName = request.get("roleName");
            User user = adminService.assignRole(id, roleName);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to assign role: " + e.getMessage()));
        }
    }

    /**
     * Remove role from user
     * DELETE /api/admin/users/{id}/roles/{roleName}
     */
    @DeleteMapping("/users/{id}/roles/{roleName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> removeRole(@PathVariable Long id, @PathVariable String roleName) {
        try {
            User user = adminService.removeRole(id, roleName);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to remove role: " + e.getMessage()));
        }
    }

    /**
     * Get admin dashboard statistics
     * GET /api/admin/dashboard/stats
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboardStats() {
        Map<String, Object> stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Activate user
     * PUT /api/admin/users/{id}/activate
     */
    @PutMapping("/users/{id}/activate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            User user = adminService.activateUser(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to activate user: " + e.getMessage()));
        }
    }

    /**
     * Deactivate user
     * PUT /api/admin/users/{id}/deactivate
     */
    @PutMapping("/users/{id}/deactivate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            User user = adminService.deactivateUser(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to deactivate user: " + e.getMessage()));
        }
    }

    /**
     * Get all service requests (Admin)
     * GET /api/admin/requests
     */
    @GetMapping("/requests")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            org.springframework.data.domain.Sort.Direction direction = sortDir.equalsIgnoreCase("asc")
                    ? org.springframework.data.domain.Sort.Direction.ASC
                    : org.springframework.data.domain.Sort.Direction.DESC;

            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
                    page,
                    size,
                    org.springframework.data.domain.Sort.by(direction, sortBy));

            org.springframework.data.domain.Page<?> requests = adminService.getAllServiceRequests(pageable);

            // Return in format expected by frontend
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("requests", requests.getContent());
            response.put("totalItems", requests.getTotalElements());
            response.put("totalPages", requests.getTotalPages());
            response.put("currentPage", requests.getNumber());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to fetch requests: " + e.getMessage()));
        }
    }
}
