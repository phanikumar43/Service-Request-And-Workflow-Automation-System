package com.servicedesk.repository;

import com.servicedesk.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for SystemSettings
 */
@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {

    Optional<SystemSettings> findBySettingKey(String settingKey);

    List<SystemSettings> findByCategory(String category);
}
