package com.servicedesk.controller;

import com.servicedesk.entity.Department;
import com.servicedesk.entity.User;
import com.servicedesk.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Department Controller
 * Handles department-related operations for admin
 */
@RestController
@RequestMapping("/admin/departments")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    /**
     * Get all active departments
     * GET /api/admin/departments
     */
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        System.out.println("=== ADMIN: Fetching all departments ===");

        List<Department> departments = departmentService.getAllActiveDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * Get agents by department
     * GET /api/admin/departments/{id}/agents
     */
    @GetMapping("/{id}/agents")
    public ResponseEntity<List<User>> getAgentsByDepartment(@PathVariable Long id) {
        System.out.println("=== ADMIN: Fetching agents for department " + id + " ===");

        List<User> agents = departmentService.getAgentsByDepartment(id);
        return ResponseEntity.ok(agents);
    }

    /**
     * Get all agents
     * GET /api/admin/departments/agents
     */
    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        System.out.println("=== ADMIN: Fetching all agents ===");

        List<User> agents = departmentService.getAllAgents();
        return ResponseEntity.ok(agents);
    }

    /**
     * Toggle department active status
     * PATCH /api/admin/departments/{id}/toggle-status
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Department> toggleDepartmentStatus(@PathVariable Long id) {
        System.out.println("=== ADMIN: Toggling status for department " + id + " ===");

        Department department = departmentService.toggleDepartmentStatus(id);
        return ResponseEntity.ok(department);
    }

    /**
     * Create department
     * POST /api/admin/departments
     */
    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody Department department) {
        System.out.println("=== ADMIN: Creating department: " + department.getName() + " ===");
        try {
            Department newDepartment = departmentService.createDepartment(department);
            return ResponseEntity.ok(newDepartment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update department
     * PUT /api/admin/departments/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
        System.out.println("=== ADMIN: Updating department: " + id + " ===");
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, department);
            return ResponseEntity.ok(updatedDepartment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete department
     * DELETE /api/admin/departments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        System.out.println("=== ADMIN: Deleting department: " + id + " ===");
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
