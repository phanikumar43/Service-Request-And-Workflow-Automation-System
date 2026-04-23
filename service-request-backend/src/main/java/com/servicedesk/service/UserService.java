package com.servicedesk.service;

import com.servicedesk.dto.ChangePasswordDTO;
import com.servicedesk.dto.UpdateProfileDTO;
import com.servicedesk.dto.UserProfileDTO;
import com.servicedesk.entity.Role;
import com.servicedesk.entity.User;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.RoleRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * User Service
 * Business logic for user operations
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get current user profile
     */
    public User getCurrentUserProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Update current user profile
     */
    @Transactional
    public User updateProfile(String username, User updatedProfile) {
        User user = getCurrentUserProfile(username);

        user.setFirstName(updatedProfile.getFirstName());
        user.setLastName(updatedProfile.getLastName());
        user.setPhone(updatedProfile.getPhone());
        user.setDepartment(updatedProfile.getDepartment());

        // Only update password if provided
        if (updatedProfile.getPassword() != null && !updatedProfile.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedProfile.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Get user dashboard statistics
     */
    public Map<String, Object> getUserDashboardStats(String username) {
        Map<String, Object> stats = new HashMap<>();

        User user = getCurrentUserProfile(username);

        // Add user-specific stats here
        stats.put("userId", user.getId());
        stats.put("username", user.getUsername());
        stats.put("fullName", user.getFullName());
        stats.put("email", user.getEmail());
        stats.put("department", user.getDepartment());

        // Placeholder for request statistics
        // These will be populated when request service is integrated
        stats.put("totalRequests", 0);
        stats.put("pendingRequests", 0);
        stats.put("completedRequests", 0);
        stats.put("cancelledRequests", 0);

        return stats;
    }

    /**
     * Change password
     */
    @Transactional
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = getCurrentUserProfile(username);

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Get user profile as DTO
     */
    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return mapToProfileDTO(user);
    }

    /**
     * Update user profile with DTO
     */
    @Transactional
    public UserProfileDTO updateUserProfile(String username, UpdateProfileDTO updateDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        user.setFirstName(updateDTO.getFirstName());
        user.setLastName(updateDTO.getLastName());
        user.setPhone(updateDTO.getPhone());
        user.setDepartment(updateDTO.getDepartment());

        User savedUser = userRepository.save(user);
        return mapToProfileDTO(savedUser);
    }

    /**
     * Change user password with DTO
     */
    @Transactional
    public void changeUserPassword(String username, ChangePasswordDTO changePasswordDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Verify passwords match
        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        // Verify current password
        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Map User entity to UserProfileDTO
     */
    private UserProfileDTO mapToProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());

        // Map roles
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().replace("ROLE_", ""))
                .collect(java.util.stream.Collectors.toSet()));

        return dto;
    }
}
