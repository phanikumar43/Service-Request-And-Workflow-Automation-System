package com.servicedesk.repository;

import com.servicedesk.entity.EmailConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailConfigRepository extends JpaRepository<EmailConfig, Long> {
    // Usually there's only one config, so we can fetch the first one
    Optional<EmailConfig> findFirstByOrderByIdAsc();
}
