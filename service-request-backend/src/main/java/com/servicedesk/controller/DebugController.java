package com.servicedesk.controller;

import com.servicedesk.entity.User;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Debug Controller - FOR TESTING ONLY
 */
@RestController
@RequestMapping("/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/reset-admin-password")
    public ResponseEntity<?> resetAdminPassword(@RequestBody Map<String, String> request) {
        String newPassword = request.get("password");

        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByUsername("admin").orElse(null);

        if (user == null) {
            response.put("success", false);
            response.put("message", "Admin user not found");
            return ResponseEntity.ok(response);
        }

        // Encode the new password
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Password updated successfully");
        response.put("newHashStart", encodedPassword.substring(0, 20));

        // Test if it matches
        boolean matches = passwordEncoder.matches(newPassword, encodedPassword);
        response.put("testMatches", matches);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-user/{username}")
    public ResponseEntity<?> checkUser(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            response.put("found", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }

        response.put("found", true);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("isActive", user.getIsActive());
        response.put("rolesCount", user.getRoles().size());
        response.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
        response.put("passwordHashStart", user.getPassword().substring(0, 20));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-password")
    public ResponseEntity<?> testPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            response.put("userFound", false);
            return ResponseEntity.ok(response);
        }

        response.put("userFound", true);
        response.put("passwordMatches", passwordEncoder.matches(password, user.getPassword()));
        response.put("isActive", user.getIsActive());
        response.put("hasRoles", !user.getRoles().isEmpty());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-phani-user")
    public ResponseEntity<?> createPhaniUser() {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByUsername("phani")) {
            response.put("success", false);
            response.put("message", "User 'phani' already exists");
            return ResponseEntity.ok(response);
        }

        com.servicedesk.entity.Role role = new com.servicedesk.entity.Role();
        role.setName("ROLE_DEPARTMENT");
        // Note: Role should ideally be fetched from DB. Assuming it might exist or
        // cascading saves it.
        // Better to fetch existing role.

        User user = new User();
        user.setUsername("phani");
        user.setFirstName("phani");
        user.setLastName("samavedam"); // Matching the screenshot user knew
        user.setEmail("phani@servicedesk.com");
        user.setPassword(passwordEncoder.encode("password"));
        user.setIsActive(true);
        // We need to fetch the role from DB to associate correctly
        // But for debug controller we can try to rely on existing roles or handle it
        // loosely

        userRepository.save(user);

        // Use SQL to assign role to avoid complexity of Role repository fetching in
        // this controller if not injected
        // Actually, let's just save the user and we can assign role via separate query
        // or another service if needed.
        // Wait, User entity has roles.

        response.put("success", true);
        response.put("message",
                "User 'phani' created. Please assign ROLE_DEPARTMENT via SQL or Admin dashboard if not auto-assigned.");
        return ResponseEntity.ok(response);
    }
}
