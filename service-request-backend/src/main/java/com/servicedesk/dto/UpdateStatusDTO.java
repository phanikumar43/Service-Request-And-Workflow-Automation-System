package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating request status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusDTO {
    private String status;
    private String notes;
}
