package com.eqa.systemConfig.jobSetup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DesignationRepo extends JpaRepository<Designation, Integer> {

    Optional<Designation> findById(Long id);

    boolean existsByTitle(String title);
    boolean existsById(Long id);
    boolean deleteById(Long id);
}
