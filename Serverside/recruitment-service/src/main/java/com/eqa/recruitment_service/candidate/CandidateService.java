package com.eqa.recruitment_service.candidate;


import com.eqa.recruitment_service.candidate.DTO.CandidateRequest;
import com.eqa.recruitment_service.candidate.DTO.CandidateResponse;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.document.DocumentService;
import com.eqa.recruitment_service.job_post.JobPost;
import com.eqa.recruitment_service.job_post.JobPostRepository;
import com.eqa.recruitment_service.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CandidateService {

    private final CandidateRepo candidateRepository;
    private JobPostRepository jobPostRepository;
    private final ModelMapper modelMapper;
    private final DocumentService documentService;

    public ApiResponse<?> getAllCandidates() {
        try {
            log.info("Fetching all candidates");
            List<Candidate> candidates = candidateRepository.findAll();
            List<CandidateResponse> candidateResponses = candidates.stream()
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
            Optional<Candidate> candidateOptional = candidateRepository.findById(id);
            if (candidateOptional.isPresent()) {
                Candidate candidate = candidateOptional.get();
                CandidateResponse candidateResponse = modelMapper.map(candidate, CandidateResponse.class);
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
            // Fetch the job post
            JobPost jobPost = jobPostRepository.findById(candidateRequest.getJobPostId())
                    .orElseThrow(() -> new RuntimeException("Job post not found"));

            List<Document> documents = new ArrayList<>();
            documents.add(documentService.createDocument(candidateRequest.getCv(), "CV"));
            documents.add(documentService.createDocument(candidateRequest.getCoverLetter(), "Cover Letter"));
            documents.add(documentService.createDocument(candidateRequest.getLicense(), "License"));
            documents.add(documentService.createDocument(candidateRequest.getCertificate(), "Certificate"));

            Candidate candidate = Candidate.builder()
                    .name(candidateRequest.getName())
                    .jobPost(jobPost)
                    .facility(candidateRequest.getFacility())
                    .idNumber(candidateRequest.getIdNumber())
                    .email(candidateRequest.getEmail())
                    .phoneNumber(candidateRequest.getPhoneNumber())
                    .documents(documents)
                    .status(Candidate.ApplicationStatus.RECEIVED)
                    .build();

            Candidate savedCandidate = candidateRepository.save(candidate);

            // Update job post status
            jobPost.setStatus(JobPost.JobStatus.APPLIED);
            jobPostRepository.save(jobPost);

            CandidateResponse candidateResponse = modelMapper.map(savedCandidate, CandidateResponse.class);
            candidateResponse.setJobPost(modelMapper.map(jobPost, CandidateResponse.JobPostDetails.class));

            return new ApiResponse<>("Candidate created successfully", candidateResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            return new ApiResponse<>("An error occurred while creating candidate: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateCandidate(Long id, CandidateRequest candidateRequest) {
        try {
            log.info("Updating candidate with ID {}", id);
            Optional<Candidate> optionalCandidate = candidateRepository.findById(id);
            if (optionalCandidate.isEmpty()) {
                log.warn("Candidate with ID {} not found", id);
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
            Candidate candidate = optionalCandidate.get();
            modelMapper.map(candidateRequest, candidate);
            candidate.setId(id); // Ensure ID is not overwritten
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