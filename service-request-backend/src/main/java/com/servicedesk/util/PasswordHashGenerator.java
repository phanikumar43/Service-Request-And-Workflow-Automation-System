package com.servicedesk.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility to generate BCrypt password hash
 * Run this to generate the correct password hash for admin user
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Admin@123";
        String hashedPassword = encoder.encode(password);

        System.out.println("========================================");
        System.out.println("Password Hash Generator");
        System.out.println("========================================");
        System.out.println("Plain Password: " + password);
        System.out.println("BCrypt Hash: " + hashedPassword);
        System.out.println("========================================");
        System.out.println();

        // Verify the hash
        boolean matches = encoder.matches(password, hashedPassword);
        System.out.println("Verification: " + (matches ? "SUCCESS" : "FAILED"));
        System.out.println();

        // Test with the hash from database-schema.sql
        String dbHash = "$2a$10$xZ8qJ9Y5K3L4M6N7O8P9QeRsT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9m";
        boolean dbMatches = encoder.matches(password, dbHash);
        System.out.println("Testing database hash: " + dbHash);
        System.out.println("Database hash verification: " + (dbMatches ? "SUCCESS" : "FAILED"));
        System.out.println();

        if (!dbMatches) {
            System.out.println("WARNING: The hash in database-schema.sql is INVALID!");
            System.out.println("Use this SQL to fix the admin user:");
            System.out.println();
            System.out.println("UPDATE users SET password = '" + hashedPassword + "' WHERE username = 'admin';");
        }
    }
}
