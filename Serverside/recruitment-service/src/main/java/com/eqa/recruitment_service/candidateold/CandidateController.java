package com.eqa.recruitment_service.candidateold;

import com.eqa.recruitment_service.candidateold.DTO.CandidateRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/candidates")
@Tag(name = "Candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping
    public ResponseEntity<?> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCandidate(@RequestBody CandidateRequest candidateRequest) {
        ApiResponse<?> response = candidateService.createCandidate(candidateRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateCandidate(@PathVariable Long id, @RequestBody CandidateRequest candidateRequest) {
        ApiResponse<?> response = candidateService.updateCandidate(id, candidateRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.deleteCandidate(id));
    }
}