package com.eqa.systemConfig.business.facility;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepo extends JpaRepository<Facility, Long> {
    boolean existsByEmail(String email);
}