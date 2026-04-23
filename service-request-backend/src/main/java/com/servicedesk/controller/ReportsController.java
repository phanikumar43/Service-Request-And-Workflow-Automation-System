package com.servicedesk.controller;

import com.servicedesk.service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Reports Controller
 * Provides analytics and reporting endpoints for admin dashboard
 */
@RestController
@RequestMapping("/admin/reports")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    /**
     * Get overall statistics
     * GET /api/admin/reports/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        System.out.println("=== REPORTS: Fetching statistics ===");
        Map<String, Object> stats = reportsService.getOverallStatistics(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get requests breakdown by status
     * GET /api/admin/reports/requests-by-status
     */
    @GetMapping("/requests-by-status")
    public ResponseEntity<Map<String, Long>> getRequestsByStatus(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Long> breakdown = reportsService.getRequestsByStatus(startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }

    /**
     * Get requests breakdown by category
     * GET /api/admin/reports/requests-by-category
     */
    @GetMapping("/requests-by-category")
    public ResponseEntity<Map<String, Long>> getRequestsByCategory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Long> breakdown = reportsService.getRequestsByCategory(startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }

    /**
     * Get requests breakdown by priority
     * GET /api/admin/reports/requests-by-priority
     */
    @GetMapping("/requests-by-priority")
    public ResponseEntity<Map<String, Long>> getRequestsByPriority(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Long> breakdown = reportsService.getRequestsByPriority(startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }

    /**
     * Get requests over time (for trend chart)
     * GET /api/admin/reports/requests-over-time
     */
    @GetMapping("/requests-over-time")
    public ResponseEntity<Map<String, Object>> getRequestsOverTime(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "day") String groupBy) {

        Map<String, Object> timeSeries = reportsService.getRequestsOverTime(startDate, endDate, groupBy);
        return ResponseEntity.ok(timeSeries);
    }

    /**
     * Get department performance metrics
     * GET /api/admin/reports/department-performance
     */
    @GetMapping("/department-performance")
    public ResponseEntity<Map<String, Object>> getDepartmentPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Object> performance = reportsService.getDepartmentPerformance(startDate, endDate);
        return ResponseEntity.ok(performance);
    }

    /**
     * Get agent performance metrics
     * GET /api/admin/reports/agent-performance
     */
    @GetMapping("/agent-performance")
    public ResponseEntity<Map<String, Object>> getAgentPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Map<String, Object> performance = reportsService.getAgentPerformance(startDate, endDate);
        return ResponseEntity.ok(performance);
    }
}
