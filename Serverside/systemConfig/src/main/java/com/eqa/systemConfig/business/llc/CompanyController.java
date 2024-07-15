package com.eqa.systemConfig.business.llc;

import com.eqa.systemConfig.business.llc.DTO.CompanyRequest;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/llcs")
@Slf4j
public class CompanyController {
    private final CompanyService llcService;

    @Autowired
    public CompanyController(CompanyService llcService) {
        this.llcService = llcService;
    }

    @GetMapping
    public ResponseEntity<?> getAllLlcs(Authentication authentication) {
        log.info("Received request for all LLCs. User: {}", authentication.getName());
        ApiResponse<?> response = llcService.getAllLlcs();
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLlc(@Valid @RequestBody CompanyRequest companyRequest, Authentication authentication) {
        log.info("Received request to create LLC: {}. User: {}", companyRequest.getName(), authentication.getName());
        ApiResponse<?> response = llcService.createLlc(companyRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getLlc(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to get LLC with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = llcService.getLlc(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateLlc(@PathVariable Long id, @Valid @RequestBody CompanyRequest companyRequest, Authentication authentication) {
        log.info("Received request to update LLC with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = llcService.updateLlc(id, companyRequest);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLlc(@PathVariable Long id, Authentication authentication) {
        log.info("Received request to delete LLC with id: {}. User: {}", id, authentication.getName());
        ApiResponse<?> response = llcService.deleteLlc(id);
        log.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}