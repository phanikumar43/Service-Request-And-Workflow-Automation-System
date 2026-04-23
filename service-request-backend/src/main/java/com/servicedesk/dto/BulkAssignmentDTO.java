package com.servicedesk.dto;

import lombok.Data;
import java.util.List;

/**
 * DTO for bulk request assignment
 */
@Data
public class BulkAssignmentDTO {
    private List<Long> requestIds;
    private Long departmentId;
    private Long agentId;
    private String notes;
}
