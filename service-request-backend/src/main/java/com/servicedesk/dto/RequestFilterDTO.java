package com.servicedesk.dto;

import com.servicedesk.entity.ServiceRequest;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for filtering service requests
 */
@Data
public class RequestFilterDTO {

    private Long categoryId;
    private Long typeId;
    private ServiceRequest.RequestStatus status;
    private ServiceRequest.Priority priority;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String searchTerm;
}
