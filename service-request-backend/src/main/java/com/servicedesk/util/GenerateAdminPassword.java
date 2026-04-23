package com.servicedesk.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateAdminPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Admin@123";
        String encodedPassword = encoder.encode(password);

        System.out.println("========================================");
        System.out.println("Password: " + password);
        System.out.println("Encoded: " + encodedPassword);
        System.out.println("========================================");
        System.out.println();
        System.out.println("SQL to update admin user:");
        System.out.println("UPDATE users SET password = '" + encodedPassword + "' WHERE username = 'admin';");
        System.out.println();

        // Test the encoding
        boolean matches = encoder.matches(password, encodedPassword);
        System.out.println("Password matches: " + matches);
    }
}
