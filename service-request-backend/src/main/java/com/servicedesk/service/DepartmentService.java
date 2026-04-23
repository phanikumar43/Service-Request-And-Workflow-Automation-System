package com.servicedesk.service;

import com.servicedesk.entity.CategoryDepartmentMapping;
import com.servicedesk.entity.Department;
import com.servicedesk.entity.User;
import com.servicedesk.repository.CategoryDepartmentMappingRepository;
import com.servicedesk.repository.DepartmentRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing departments
 */
@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryDepartmentMappingRepository mappingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all active departments
     */
    public List<Department> getAllActiveDepartments() {
        return departmentRepository.findByIsActiveTrue();
    }

    /**
     * Get department by ID
     */
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    /**
     * Get department for a category (auto-assignment logic)
     */
    public Optional<Department> getDepartmentForCategory(Long categoryId) {
        return mappingRepository.findByCategoryId(categoryId)
                .stream()
                .map(CategoryDepartmentMapping::getDepartment)
                .findFirst();
    }

    /**
     * Get agents by department
     * Returns users with ROLE_AGENT or ROLE_ADMIN
     */
    public List<User> getAgentsByDepartment(Long departmentId) {
        // For now, return all agents
        // In a full implementation, you'd have a department_users table
        return getAllAgents();
    }

    /**
     * Get all agents (users with ROLE_AGENT)
     */
    public List<User> getAllAgents() {
        // Return all users for now - in production, filter by role
        return userRepository.findAll();
    }

    /**
     * Toggle department active status
     */
    public Department toggleDepartmentStatus(Long id) {
        Department department = getDepartmentById(id);
        department.setIsActive(!department.getIsActive());
        Department saved = departmentRepository.save(department);
        System.out.println("✓ Department " + saved.getName() + " status toggled to: " +
                (saved.getIsActive() ? "ACTIVE" : "INACTIVE"));
        return saved;
    }

    /**
     * Create new department
     */
    public Department createDepartment(Department department) {
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new IllegalArgumentException("Department with name " + department.getName() + " already exists");
        }
        Department saved = departmentRepository.save(department);
        System.out.println("✓ Created department: " + saved.getName());
        return saved;
    }

    /**
     * Update department
     */
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);

        // Check name uniqueness if changed
        if (!department.getName().equals(departmentDetails.getName()) &&
                departmentRepository.findByName(departmentDetails.getName()).isPresent()) {
            throw new IllegalArgumentException(
                    "Department with name " + departmentDetails.getName() + " already exists");
        }

        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        // Add other fields as necessary

        Department saved = departmentRepository.save(department);
        System.out.println("✓ Updated department: " + saved.getName());
        return saved;
    }

    /**
     * Delete department
     */
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);

        // TODO: Check for dependencies (users, requests) before deleting
        // For now, handle via Foreign Key constraints or soft delete

        departmentRepository.delete(department);
        System.out.println("✓ Deleted department: " + department.getName());
    }
}
