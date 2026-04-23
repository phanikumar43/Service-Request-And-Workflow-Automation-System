package com.servicedesk.controller;

import com.servicedesk.entity.User;
import com.servicedesk.repository.UserRepository;
import com.servicedesk.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUserDebug(Authentication authentication) {
        Map<String, Object> debug = new HashMap<>();

        String username = authentication.getName();
        debug.put("authUsername", username);
        debug.put("authPrincipal", authentication.getPrincipal());

        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            debug.put("userId", user.getId());
            debug.put("userUsername", user.getUsername());
            debug.put("userEmail", user.getEmail());

            long requestCount = serviceRequestRepository.findByRequesterId(user.getId()).size();
            debug.put("requestCount", requestCount);
        } else {
            debug.put("userFound", false);
        }

        return ResponseEntity.ok(debug);
    }
}
