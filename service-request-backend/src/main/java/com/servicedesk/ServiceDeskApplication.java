package com.servicedesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Service Request and Workflow Automation System
 * Main Spring Boot Application
 * 
 * @author Service Desk Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableScheduling
public class ServiceDeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceDeskApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("Service Request System Started Successfully!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("========================================\n");
    }
}
