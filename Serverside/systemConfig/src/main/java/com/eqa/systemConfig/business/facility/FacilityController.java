package com.eqa.systemConfig.business.facility;

import com.eqa.systemConfig.business.facility.DTO.FacilityRequest;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/facilities")
@Slf4j
public class FacilityController {

    private final FacilityService facilityService;

    @Autowired
    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<?> getAllFacilities(Authentication authentication) {
        log.info("Received request for all facilities. User: {}", authentication.getName());
        ApiResponse<?> response = facilityService.getAllFacilities();
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFacility(@Valid @RequestBody FacilityRequest facilityRequest, Authentication authentication) {
        log.info("Received request to create facility: {}. User: {}", facilityRequest.getClinicName(), authentication.getName());
        ApiResponse<?> response = facilityService.createFacility(facilityRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("/view/{id}")
    public ResponseEntity<?> getFacility(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to get facility with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = facilityService.getFacility(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable Long id, @Valid @RequestBody FacilityRequest facilityRequest, Authentication authentication) {
        log.info("Received request to update facility with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = facilityService.updateFacility(id, facilityRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to delete facility with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = facilityService.deleteFacility(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}