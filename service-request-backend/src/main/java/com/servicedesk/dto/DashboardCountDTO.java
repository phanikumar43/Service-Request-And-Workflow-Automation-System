package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for dashboard request counts
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCountDTO {
    private long total;
    private long pending;
    private long completed;
    private long cancelled;
}
