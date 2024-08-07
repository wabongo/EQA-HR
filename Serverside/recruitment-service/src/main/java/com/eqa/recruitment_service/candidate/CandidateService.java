package com.eqa.recruitment_service.candidate;

import com.eqa.recruitment_service.candidate.DTO.CandidateRequest;
import com.eqa.recruitment_service.candidate.DTO.CandidateResponse;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.document.DocumentService;
import com.eqa.recruitment_service.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CandidateService {

    private final CandidateRepo candidateRepository;
    private final ModelMapper modelMapper;
    private final DocumentService documentService;

    public ApiResponse<?> getAllCandidates() {
        try {
            log.info("Fetching all candidates");
            var candidates = candidateRepository.findAll();
            var candidateResponses = candidates.stream()
                    .map(candidate -> modelMapper.map(candidate, CandidateResponse.class))
                    .collect(Collectors.toList());
            log.info("Found {} candidates", candidateResponses.size());
            return new ApiResponse<>("Candidates fetched successfully", candidateResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching candidates: ", e);
            return new ApiResponse<>("An error occurred while fetching candidates.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getCandidateById(Long id) {
        try {
            log.info("Fetching candidate with ID {}", id);
            var candidateOptional = candidateRepository.findById(id);
            if (candidateOptional.isPresent()) {
                var candidate = candidateOptional.get();
                var candidateResponse = modelMapper.map(candidate, CandidateResponse.class);
                log.info("Candidate with ID {} fetched successfully", id);
                return new ApiResponse<>("Candidate fetched successfully", candidateResponse, HttpStatus.OK.value());
            } else {
                log.warn("Candidate with ID {} not found", id);
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching candidate with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while fetching candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createCandidate(CandidateRequest candidateRequest) {
        try {
            Document cv = documentService.createDocument(candidateRequest.getCv(), "CV");

            Candidate candidate = Candidate.builder()
                    .name(candidateRequest.getName())
                    .idNumber(candidateRequest.getIdNumber())
                    .email(candidateRequest.getEmail())
                    .phoneNumber(candidateRequest.getPhoneNumber())
                    .cv(cv)
                    .build();

            Candidate savedCandidate = candidateRepository.save(candidate);
            CandidateResponse candidateResponse = modelMapper.map(savedCandidate, CandidateResponse.class);

            return new ApiResponse<>("Candidate created successfully", candidateResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            return new ApiResponse<>("An error occurred while creating candidate: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateCandidate(Long id, CandidateRequest candidateRequest) {
        try {
            log.info("Updating candidate with ID {}", id);
            var optionalCandidate = candidateRepository.findById(id);
            if (optionalCandidate.isEmpty()) {
                log.warn("Candidate with ID {} not found", id);
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
            var candidate = optionalCandidate.get();
            candidate.setName(candidateRequest.getName());
            candidate.setIdNumber(candidateRequest.getIdNumber());
            candidate.setEmail(candidateRequest.getEmail());
            candidate.setPhoneNumber(candidateRequest.getPhoneNumber());

            Document cv = documentService.createDocument(candidateRequest.getCv(), "CV");
            candidate.setCv(cv);

            Candidate savedCandidate = candidateRepository.save(candidate);
            CandidateResponse candidateResponse = modelMapper.map(savedCandidate, CandidateResponse.class);
            log.info("Candidate with ID {} updated successfully", id);
            return new ApiResponse<>("Candidate updated successfully", candidateResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating candidate with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while updating candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteCandidate(Long id) {
        try {
            log.info("Deleting candidate with ID {}", id);
            if (candidateRepository.existsById(id)) {
                candidateRepository.deleteById(id);
                log.info("Candidate with ID {} deleted successfully", id);
                return new ApiResponse<>("Candidate deleted successfully", null, HttpStatus.OK.value());
            } else {
                log.warn("Candidate with ID {} not found", id);
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while deleting candidate with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while deleting candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}