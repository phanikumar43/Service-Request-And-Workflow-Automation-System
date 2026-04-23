package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.dto.JwtAuthResponse;
import com.servicedesk.dto.LoginRequest;
import com.servicedesk.dto.RegisterRequest;
import com.servicedesk.entity.Role;
import com.servicedesk.entity.User;
import com.servicedesk.repository.RoleRepository;
import com.servicedesk.repository.UserRepository;
import com.servicedesk.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Authentication Controller
 * Handles user authentication and registration
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtTokenProvider tokenProvider;

        /**
         * User login endpoint
         * POST /api/auth/login
         */
        @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
                System.out.println("=== LOGIN ATTEMPT ===");
                System.out.println("Username: " + loginRequest.getUsername());

                try {
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        loginRequest.getUsername(),
                                                        loginRequest.getPassword()));

                        System.out.println("Authentication successful for: " + loginRequest.getUsername());

                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        String jwt = tokenProvider.generateToken(authentication);

                        User user = userRepository.findByUsername(loginRequest.getUsername())
                                        .orElseThrow(() -> new RuntimeException("User not found"));

                        // Update last login
                        user.setLastLogin(LocalDateTime.now());
                        userRepository.save(user);

                        List<String> roles = user.getRoles().stream()
                                        .map(Role::getName)
                                        .collect(Collectors.toList());

                        System.out.println("User roles: " + roles);
                        System.out.println("=== LOGIN SUCCESS ===");

                        return ResponseEntity.ok(new JwtAuthResponse(
                                        jwt,
                                        user.getId(),
                                        user.getUsername(),
                                        user.getEmail(),
                                        roles));
                } catch (org.springframework.security.authentication.BadCredentialsException e) {
                        System.err.println("=== LOGIN FAILED: Bad Credentials ===");
                        System.err.println("Username: " + loginRequest.getUsername());
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(new ApiResponse(false, "Invalid username or password"));
                } catch (Exception e) {
                        System.err.println("=== LOGIN FAILED: Unexpected Error ===");
                        System.err.println("Username: " + loginRequest.getUsername());
                        System.err.println("Error: " + e.getClass().getName() + " - " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(new ApiResponse(false, "Invalid username or password"));
                }
        }

        /**
         * User registration endpoint
         * POST /api/auth/register
         */
        @PostMapping("/register")
        public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
                // Check if username already exists
                if (userRepository.existsByUsername(registerRequest.getUsername())) {
                        return ResponseEntity.badRequest()
                                        .body(new ApiResponse(false, "Username is already taken"));
                }

                // Check if email already exists
                if (userRepository.existsByEmail(registerRequest.getEmail())) {
                        return ResponseEntity.badRequest()
                                        .body(new ApiResponse(false, "Email is already in use"));
                }

                // Create new user
                User user = new User();
                user.setUsername(registerRequest.getUsername());
                user.setEmail(registerRequest.getEmail());
                user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
                user.setFirstName(registerRequest.getFirstName());
                user.setLastName(registerRequest.getLastName());
                user.setPhone(registerRequest.getPhone());
                user.setDepartment(registerRequest.getDepartment());
                user.setIsActive(true);

                // Assign default role (END_USER)
                Role userRole = roleRepository.findByName("ROLE_END_USER")
                                .orElseThrow(() -> new RuntimeException("Default role not found"));
                user.addRole(userRole);

                userRepository.save(user);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new ApiResponse(true, "User registered successfully"));
        }

        /**
         * Get current user info
         * GET /api/auth/me
         */
        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser(Authentication authentication) {
                if (authentication == null || !authentication.isAuthenticated()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(new ApiResponse(false, "Not authenticated"));
                }

                String username = authentication.getName();
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<String> roles = user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toList());

                return ResponseEntity.ok(new JwtAuthResponse(
                                null,
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                roles));
        }

        /**
         * Logout endpoint (client-side token removal)
         * POST /api/auth/logout
         */
        @PostMapping("/logout")
        public ResponseEntity<?> logoutUser() {
                return ResponseEntity.ok(new ApiResponse(true, "User logged out successfully"));
        }
}
