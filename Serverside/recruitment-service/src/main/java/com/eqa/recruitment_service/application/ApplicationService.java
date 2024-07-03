package com.eqa.recruitment_service.application;

import com.eqa.recruitment_service.application.DTO.ApplicationRequest;
import com.eqa.recruitment_service.application.DTO.ApplicationResponse;
import com.eqa.recruitment_service.candidate.Candidate;
import com.eqa.recruitment_service.candidate.CandidateRepository;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.document.DocumentService;
import com.eqa.recruitment_service.exception.ResourceNotFoundException;
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
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final DocumentService documentService;
    private final JobPostRepository jobPostRepository;
    private final CandidateRepository candidateRepository;
    private final ModelMapper modelMapper;

    public ApiResponse<?> submitApplication(ApplicationRequest applicationRequest) {
        try {
            JobPost jobPost = jobPostRepository.findById(applicationRequest.getJobPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobPost not found"));

            Candidate candidate = candidateRepository.findById(applicationRequest.getCandidateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

            List<Document> documents = new ArrayList<>();
            documents.add(documentService.createDocument(applicationRequest.getCv(), "CV"));
            documents.add(documentService.createDocument(applicationRequest.getLicense(), "License"));
            documents.add(documentService.createDocument(applicationRequest.getCertificate(), "Certificate"));

            Application application = new Application();
            application.setCandidate(candidate);
            application.setStatus("Submitted");
            application.setJobPost(jobPost);
            application.setDocuments(documents);

            Application savedApplication = applicationRepository.save(application);
            ApplicationResponse applicationResponse = modelMapper.map(savedApplication, ApplicationResponse.class);

            return new ApiResponse<>("Application submitted successfully", applicationResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred while submitting application.", e);
            return new ApiResponse<>("An error occurred while submitting application.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getAllApplications() {
        try {
            List<Application> applications = applicationRepository.findAll();
            List<ApplicationResponse> applicationResponses = applications.stream()
                    .map(application -> modelMapper.map(application, ApplicationResponse.class))
                    .collect(Collectors.toList());

            return new ApiResponse<>("Applications fetched successfully", applicationResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while fetching applications.", e);
            return new ApiResponse<>("An error occurred while fetching applications.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getApplicationById(Long id) {
        try {
            Optional<Application> applicationOptional = applicationRepository.findById(id);
            if (applicationOptional.isPresent()) {
                Application application = applicationOptional.get();
                ApplicationResponse applicationResponse = modelMapper.map(application, ApplicationResponse.class);
                return new ApiResponse<>("Application fetched successfully", applicationResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Application not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching application.", e);
            return new ApiResponse<>("An error occurred while fetching application.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateApplicationStatus(Long id, String status) {
        try {
            Optional<Application> optionalApplication = applicationRepository.findById(id);
            if (optionalApplication.isEmpty()) {
                return new ApiResponse<>("Application not found", null, HttpStatus.NOT_FOUND.value());
            }
            Application application = optionalApplication.get();
            application.setStatus(status);
            Application updatedApplication = applicationRepository.save(application);
            ApplicationResponse applicationResponse = modelMapper.map(updatedApplication, ApplicationResponse.class);
            return new ApiResponse<>("Application updated successfully", applicationResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating application status.", e);
            return new ApiResponse<>("An error occurred while updating application status.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}