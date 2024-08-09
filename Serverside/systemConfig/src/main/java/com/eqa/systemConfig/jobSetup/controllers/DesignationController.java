package com.eqa.systemConfig.jobSetup.controllers;

import com.eqa.systemConfig.jobSetup.DTO.DesignationRequest;
import com.eqa.systemConfig.jobSetup.services.DesignationService;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/designations")
@Slf4j
public class DesignationController {

    private final DesignationService designationService;

    @Autowired
    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDesignations(Authentication authentication) {
        log.info("Received request for all designations. User: {}", authentication.getName());
        ApiResponse<?> response = designationService.getAllDesignations();
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDesignation(@Valid @RequestBody DesignationRequest designationRequest, Authentication authentication) {
        log.info("Received request to create designation: {}. User: {}", designationRequest.getTitle(), authentication.getName());
        ApiResponse<?> response = designationService.createDesignation(designationRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getDesignation(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to get designation with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = designationService.getDesignation(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDesignation(@PathVariable Long id, @Valid @RequestBody DesignationRequest designationRequest, Authentication authentication) {
        log.info("Received request to update designation with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = designationService.updateDesignation(id, designationRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDesignation(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to delete designation with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = designationService.deleteDesignation(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}