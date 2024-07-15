package com.eqa.systemConfig.business.facility;

import com.eqa.systemConfig.business.facility.DTO.FacilityRequest;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping("/create")
    public ResponseEntity<?> createFacility(@Valid @RequestBody FacilityRequest request, Authentication authentication) {
        ApiResponse<?> response = facilityService.createFacility(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllFacilities(Authentication authentication) {
        ApiResponse<?> response = facilityService.getAllFacilities();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFacility(@PathVariable Long id, Authentication authentication) {
        ApiResponse<?> response = facilityService.getFacility(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable Long id, @Valid @RequestBody FacilityRequest request, Authentication authentication) {
        ApiResponse<?> response = facilityService.updateFacility(id, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable Long id, Authentication authentication) {
        ApiResponse<?> response = facilityService.deleteFacility(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}