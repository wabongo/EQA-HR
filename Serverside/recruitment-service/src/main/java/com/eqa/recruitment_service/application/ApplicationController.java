package com.eqa.recruitment_service.application;

import com.eqa.recruitment_service.application.DTO.ApplicationRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@ModelAttribute ApplicationRequest applicationRequest) {
        ApiResponse<?> response = applicationService.submitApplication(applicationRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        ApiResponse<?> response = applicationService.updateApplicationStatus(id, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}