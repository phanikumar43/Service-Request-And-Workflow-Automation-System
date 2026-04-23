package com.servicedesk.controller;

import com.servicedesk.entity.SystemSettings;
import com.servicedesk.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for system settings management
 */
@RestController
@RequestMapping("/admin/settings")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService settingsService;

    /**
     * Get all settings
     */
    @GetMapping
    public ResponseEntity<List<SystemSettings>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }

    /**
     * Get settings by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<SystemSettings>> getSettingsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(settingsService.getSettingsByCategory(category));
    }

    /**
     * Update setting
     */
    @PutMapping("/{key}")
    public ResponseEntity<SystemSettings> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> payload) {
        SystemSettings setting = settingsService.saveSetting(
                key,
                payload.get("value"),
                payload.get("category"),
                payload.get("description"));
        return ResponseEntity.ok(setting);
    }

    /**
     * Bulk update settings
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> bulkUpdateSettings(@RequestBody Map<String, Object> payload) {
        String category = (String) payload.get("category");
        @SuppressWarnings("unchecked")
        Map<String, String> settings = (Map<String, String>) payload.get("settings");
        settingsService.bulkUpdateSettings(settings, category);
        return ResponseEntity.ok(Map.of("success", true, "message", "Settings updated successfully"));
    }
}
