package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.dto.ChangePasswordDTO;
import com.servicedesk.dto.UpdateProfileDTO;
import com.servicedesk.dto.UserProfileDTO;
import com.servicedesk.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * User Controller
 * Handles user-specific operations
 */
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get current user profile
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            String username = getUsername(authentication);
            UserProfileDTO profile = userService.getUserProfile(username);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to fetch profile: " + e.getMessage()));
        }
    }

    /**
     * Update current user profile
     * PUT /api/user/profile
     */
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileDTO updateDTO) {
        try {
            String username = getUsername(authentication);
            UserProfileDTO profile = userService.updateUserProfile(username, updateDTO);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update profile: " + e.getMessage()));
        }
    }

    /**
     * Change password
     * PUT /api/user/change-password
     */
    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        try {
            String username = getUsername(authentication);
            userService.changeUserPassword(username, changePasswordDTO);
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to change password: " + e.getMessage()));
        }
    }

    /**
     * Helper method to get username from authentication
     */
    private String getUsername(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return authentication.getName();
        }
        authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("User not authenticated");
        }
        return authentication.getName();
    }
}
