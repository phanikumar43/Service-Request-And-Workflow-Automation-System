package com.servicedesk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scheduling Configuration
 * Enables scheduled tasks and async execution
 */
@Configuration
@EnableScheduling
@EnableAsync
public class SchedulingConfig {
    // Configuration for scheduled tasks
    // SLA monitoring, auto-close, daily digests, etc.
}
