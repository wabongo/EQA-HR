package com.eqa.systemConfig.business.llc;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// LlcRepository.java
@Repository
public interface CompanyRepo extends JpaRepository<Company, Long> {
    boolean existsByEmail(String email);
    boolean existsByKraPin(String kraPin);
}