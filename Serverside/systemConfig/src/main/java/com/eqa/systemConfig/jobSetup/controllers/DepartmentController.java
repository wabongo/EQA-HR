package com.eqa.systemConfig.jobSetup.controllers;


import com.eqa.systemConfig.jobSetup.DTO.DepartmentRequest;
import com.eqa.systemConfig.jobSetup.services.DepartmentService;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/departments")
@Slf4j
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDepartments(Authentication authentication) {
        log.info("Received request for all departments. User: {}", authentication.getName());
        ApiResponse<?> response = departmentService.getAllDepartments();
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDepartment(@Valid @RequestBody DepartmentRequest departmentRequest, Authentication authentication) {
        log.info("Received request to create department: {}. User: {}", departmentRequest.getName(), authentication.getName());
        ApiResponse<?> response = departmentService.createDepartment(departmentRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getDepartment(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to get department with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = departmentService.getDepartment(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest departmentRequest, Authentication authentication) {
        log.info("Received request to update department with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = departmentService.updateDepartment(id, departmentRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to delete department with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = departmentService.deleteDepartment(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}