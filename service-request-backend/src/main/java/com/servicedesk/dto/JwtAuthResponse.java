package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * JWT Authentication Response DTO
 */
@Data
@AllArgsConstructor
public class JwtAuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private List<String> roles;

    public JwtAuthResponse(String accessToken, Long userId, String username, String email, List<String> roles) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}
