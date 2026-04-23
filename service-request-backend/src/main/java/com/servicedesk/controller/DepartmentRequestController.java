package com.servicedesk.controller;

import com.servicedesk.dto.AdminRequestDTO;
import com.servicedesk.dto.ApproveRequestDTO;
import com.servicedesk.dto.RejectRequestDTO;
import com.servicedesk.dto.ResolveRequestDTO;
import com.servicedesk.dto.UpdateStatusDTO;
import com.servicedesk.service.DepartmentRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/department/actions/requests")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ROLE_DEPARTMENT') or hasRole('ROLE_ADMIN')")
public class DepartmentRequestController {

    @Autowired
    private DepartmentRequestService departmentRequestService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDepartmentRequests(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AdminRequestDTO> requests = departmentRequestService.getDepartmentRequests(status, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("requests", requests.getContent());
        response.put("currentPage", requests.getNumber());
        response.put("totalItems", requests.getTotalElements());
        response.put("totalPages", requests.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusDTO dto) {
        try {
            AdminRequestDTO updatedRequest = departmentRequestService.updateStatus(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "request", updatedRequest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolveRequest(
            @PathVariable Long id,
            @RequestBody @Valid ResolveRequestDTO dto) {
        try {
            AdminRequestDTO resolvedRequest = departmentRequestService.resolveRequest(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "request", resolvedRequest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestBody ApproveRequestDTO dto) {
        try {
            AdminRequestDTO approvedRequest = departmentRequestService.approveRequest(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "request", approvedRequest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestBody @Valid RejectRequestDTO dto) {
        try {
            AdminRequestDTO rejectedRequest = departmentRequestService.rejectRequest(id, dto);
            return ResponseEntity.ok(Map.of("success", true, "request", rejectedRequest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
