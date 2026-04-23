package com.servicedesk.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * Utility class for generating unique ticket IDs
 */
public class TicketIdGenerator {

    private static final String PREFIX = "SR";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Random RANDOM = new Random();

    /**
     * Generate unique ticket ID
     * Format: SR-YYYYMMDD-XXXX
     * Example: SR-20231218-1234
     */
    public static String generateTicketId() {
        String datePart = LocalDateTime.now().format(DATE_FORMAT);
        int randomPart = 1000 + RANDOM.nextInt(9000); // 4-digit random number
        return String.format("%s-%s-%04d", PREFIX, datePart, randomPart);
    }
}
