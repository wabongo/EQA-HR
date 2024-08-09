package com.eqa.systemConfig.jobSetup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepo extends JpaRepository<Department, Integer> {
    Optional<Department> findById(Long id);
    boolean existsByName(String name);
    boolean existsById(Long id);
    boolean deleteById(Long id);
}
