package com.servicedesk.service;

import com.servicedesk.entity.Role;
import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.entity.User;
import com.servicedesk.repository.RoleRepository;
import com.servicedesk.repository.ServiceRequestRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Service
 * Business logic for admin operations
 */
@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    /**
     * Create new user
     */
    @Transactional
    public User createUser(User user, String roleName) {
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign role
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.addRole(role);

        return userRepository.save(user);
    }

    /**
     * Update user
     */
    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setDepartment(updatedUser.getDepartment());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Delete user (soft delete)
     */
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Assign role to user
     */
    @Transactional
    public User assignRole(Long userId, String roleName) {
        User user = getUserById(userId);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.addRole(role);
        return userRepository.save(user);
    }

    /**
     * Remove role from user
     */
    @Transactional
    public User removeRole(Long userId, String roleName) {
        User user = getUserById(userId);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.removeRole(role);
        return userRepository.save(user);
    }

    /**
     * Get admin dashboard statistics
     */
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        // Active users
        long activeUsers = userRepository.findAll().stream()
                .filter(User::getIsActive)
                .count();
        stats.put("activeUsers", activeUsers);

        // Inactive users
        stats.put("inactiveUsers", totalUsers - activeUsers);

        // Users by role
        Map<String, Long> usersByRole = new HashMap<>();
        List<Role> roles = roleRepository.findAll();
        for (Role role : roles) {
            long count = userRepository.findAll().stream()
                    .filter(user -> user.getRoles().contains(role))
                    .count();
            usersByRole.put(role.getName(), count);
        }
        stats.put("usersByRole", usersByRole);

        return stats;
    }

    /**
     * Activate user
     */
    @Transactional
    public User activateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(true);
        return userRepository.save(user);
    }

    /**
     * Deactivate user
     */
    @Transactional
    public User deactivateUser(Long id) {
        User user = getUserById(id);
        user.setIsActive(false);
        return userRepository.save(user);
    }

    /**
     * Get all service requests (for admin)
     * Returns all requests with pagination and sorting
     */
    public Page<ServiceRequest> getAllServiceRequests(Pageable pageable) {
        return serviceRequestRepository.findAll(pageable);
    }
}
