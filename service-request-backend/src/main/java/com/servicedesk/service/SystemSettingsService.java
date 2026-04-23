package com.servicedesk.service;

import com.servicedesk.entity.SystemSettings;
import com.servicedesk.repository.SystemSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing system settings
 */
@Service
public class SystemSettingsService {

    @Autowired
    private SystemSettingsRepository settingsRepository;

    /**
     * Get all settings
     */
    public List<SystemSettings> getAllSettings() {
        return settingsRepository.findAll();
    }

    /**
     * Get settings by category
     */
    public List<SystemSettings> getSettingsByCategory(String category) {
        return settingsRepository.findByCategory(category);
    }

    /**
     * Get setting by key
     */
    public SystemSettings getSettingByKey(String key) {
        return settingsRepository.findBySettingKey(key).orElse(null);
    }

    /**
     * Update or create setting
     */
    public SystemSettings saveSetting(String key, String value, String category, String description) {
        SystemSettings setting = settingsRepository.findBySettingKey(key)
                .orElse(new SystemSettings());

        setting.setSettingKey(key);
        setting.setSettingValue(value);
        setting.setCategory(category);
        setting.setDescription(description);

        return settingsRepository.save(setting);
    }

    /**
     * Bulk update settings
     */
    public void bulkUpdateSettings(Map<String, String> settings, String category) {
        settings.forEach((key, value) -> {
            saveSetting(key, value, category, null);
        });
    }

    /**
     * Delete setting
     */
    public void deleteSetting(Long id) {
        settingsRepository.deleteById(id);
    }
}
