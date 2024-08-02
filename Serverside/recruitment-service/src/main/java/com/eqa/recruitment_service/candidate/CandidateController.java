package com.eqa.recruitment_service.candidate;


import com.eqa.recruitment_service.candidate.DTO.CandidateRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/candidates")
@Tag(name = "Candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private static final Logger logger = LoggerFactory.getLogger(CandidateController.class);

    @GetMapping
    public ResponseEntity<?> getAllCandidates() {
        logger.info("Received request for all candidates");
        ApiResponse<?> response = candidateService.getAllCandidates();
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidateById(@PathVariable Long id) {
        logger.info("Received request for candidate with ID: {}", id);
        ApiResponse<?> response = candidateService.getCandidateById(id);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createCandidate(@ModelAttribute CandidateRequest candidateRequest) {
        logger.info("Received request to create candidate: {}", candidateRequest);
        ApiResponse<?> response = candidateService.createCandidate(candidateRequest);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCandidate(@PathVariable Long id, @RequestBody CandidateRequest candidateRequest) {
        logger.info("Received request to update candidate with ID: {}", id);
        logger.info("Candidate request data: {}", candidateRequest);
        ApiResponse<?> response = candidateService.updateCandidate(id, candidateRequest);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id) {
        logger.info("Received request to delete candidate with ID: {}", id);
        ApiResponse<?> response = candidateService.deleteCandidate(id);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}