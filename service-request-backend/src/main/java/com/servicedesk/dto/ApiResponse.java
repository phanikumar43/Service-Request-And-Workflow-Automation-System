package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Generic API Response DTO
 */
@Data
@AllArgsConstructor
public class ApiResponse {

    private Boolean success;
    private String message;

    public ApiResponse(String message) {
        this.success = true;
        this.message = message;
    }
}
