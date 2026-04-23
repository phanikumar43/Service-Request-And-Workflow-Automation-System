package com.servicedesk.controller;

import com.servicedesk.dto.AdminRequestDTO;
import com.servicedesk.service.DepartmentRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/department/dashboard")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('DEPARTMENT', 'ADMIN')")
public class DepartmentDashboardController {

    @Autowired
    private DepartmentRequestService departmentRequestService;

    @GetMapping("/assigned-requests")
    public ResponseEntity<Page<AdminRequestDTO>> getAssignedRequests(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(departmentRequestService.getAssignedRequests(username, status, pageable));
    }
}
