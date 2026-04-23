package com.servicedesk.service;

import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.repository.ServiceRequestRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Reports Service
 * Business logic for generating reports and analytics
 */
@Service
public class ReportsService {

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get overall statistics
     */
    public Map<String, Object> getOverallStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", requests.size());
        stats.put("pendingRequests", countByStatus(requests, ServiceRequest.RequestStatus.NEW,
                ServiceRequest.RequestStatus.PENDING_APPROVAL, ServiceRequest.RequestStatus.ASSIGNED));
        stats.put("inProgressRequests", countByStatus(requests, ServiceRequest.RequestStatus.IN_PROGRESS));
        stats.put("resolvedRequests", countByStatus(requests, ServiceRequest.RequestStatus.RESOLVED,
                ServiceRequest.RequestStatus.CLOSED));
        stats.put("cancelledRequests", countByStatus(requests, ServiceRequest.RequestStatus.CANCELLED));

        // Calculate average resolution time
        double avgResolutionTime = calculateAverageResolutionTime(requests);
        stats.put("averageResolutionTimeHours", avgResolutionTime);

        return stats;
    }

    /**
     * Get requests breakdown by status
     */
    public Map<String, Long> getRequestsByStatus(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        return requests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus().toString(),
                        Collectors.counting()));
    }

    /**
     * Get requests breakdown by category
     */
    public Map<String, Long> getRequestsByCategory(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        return requests.stream()
                .filter(r -> r.getCategory() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getCategory().getName(),
                        Collectors.counting()));
    }

    /**
     * Get requests breakdown by priority
     */
    public Map<String, Long> getRequestsByPriority(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        return requests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getPriority().toString(),
                        Collectors.counting()));
    }

    /**
     * Get requests over time
     */
    public Map<String, Object> getRequestsOverTime(LocalDateTime startDate, LocalDateTime endDate, String groupBy) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        Map<String, Long> timeSeries = new LinkedHashMap<>();
        DateTimeFormatter formatter;

        switch (groupBy.toLowerCase()) {
            case "hour":
                formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:00");
                break;
            case "week":
                formatter = DateTimeFormatter.ofPattern("yyyy-'W'ww");
                break;
            case "month":
                formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                break;
            default: // day
                formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        }

        timeSeries = requests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().format(formatter),
                        LinkedHashMap::new,
                        Collectors.counting()));

        Map<String, Object> result = new HashMap<>();
        result.put("data", timeSeries);
        result.put("groupBy", groupBy);
        return result;
    }

    /**
     * Get department performance
     */
    public Map<String, Object> getDepartmentPerformance(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        Map<String, Map<String, Object>> deptStats = new HashMap<>();

        requests.stream()
                .filter(r -> r.getDepartment() != null)
                .forEach(r -> {
                    String deptName = r.getDepartment().getName();
                    deptStats.putIfAbsent(deptName, new HashMap<>());
                    Map<String, Object> stats = deptStats.get(deptName);

                    stats.put("total", (Long) stats.getOrDefault("total", 0L) + 1);
                    if (r.getStatus() == ServiceRequest.RequestStatus.RESOLVED ||
                            r.getStatus() == ServiceRequest.RequestStatus.CLOSED) {
                        stats.put("resolved", (Long) stats.getOrDefault("resolved", 0L) + 1);
                    }
                });

        Map<String, Object> result = new HashMap<>();
        result.put("departments", deptStats);
        return result;
    }

    /**
     * Get agent performance
     */
    public Map<String, Object> getAgentPerformance(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> requests = getFilteredRequests(startDate, endDate);

        Map<String, Map<String, Object>> agentStats = new HashMap<>();

        requests.stream()
                .filter(r -> r.getAssignedAgent() != null)
                .forEach(r -> {
                    String agentName = r.getAssignedAgent().getUsername();
                    agentStats.putIfAbsent(agentName, new HashMap<>());
                    Map<String, Object> stats = agentStats.get(agentName);

                    stats.put("total", (Long) stats.getOrDefault("total", 0L) + 1);
                    if (r.getStatus() == ServiceRequest.RequestStatus.RESOLVED ||
                            r.getStatus() == ServiceRequest.RequestStatus.CLOSED) {
                        stats.put("resolved", (Long) stats.getOrDefault("resolved", 0L) + 1);
                    }
                });

        Map<String, Object> result = new HashMap<>();
        result.put("agents", agentStats);
        return result;
    }

    // Helper methods

    private List<ServiceRequest> getFilteredRequests(LocalDateTime startDate, LocalDateTime endDate) {
        List<ServiceRequest> allRequests = requestRepository.findAll();

        if (startDate == null && endDate == null) {
            return allRequests;
        }

        return allRequests.stream()
                .filter(r -> {
                    LocalDateTime createdAt = r.getCreatedAt();
                    boolean afterStart = startDate == null || createdAt.isAfter(startDate)
                            || createdAt.isEqual(startDate);
                    boolean beforeEnd = endDate == null || createdAt.isBefore(endDate) || createdAt.isEqual(endDate);
                    return afterStart && beforeEnd;
                })
                .collect(Collectors.toList());
    }

    private long countByStatus(List<ServiceRequest> requests, ServiceRequest.RequestStatus... statuses) {
        Set<ServiceRequest.RequestStatus> statusSet = new HashSet<>(Arrays.asList(statuses));
        return requests.stream()
                .filter(r -> statusSet.contains(r.getStatus()))
                .count();
    }

    private double calculateAverageResolutionTime(List<ServiceRequest> requests) {
        List<ServiceRequest> resolvedRequests = requests.stream()
                .filter(r -> r.getClosedAt() != null)
                .collect(Collectors.toList());

        if (resolvedRequests.isEmpty()) {
            return 0.0;
        }

        double totalHours = resolvedRequests.stream()
                .mapToDouble(r -> {
                    LocalDateTime created = r.getCreatedAt();
                    LocalDateTime closed = r.getClosedAt();
                    return java.time.Duration.between(created, closed).toHours();
                })
                .sum();

        return totalHours / resolvedRequests.size();
    }
}
