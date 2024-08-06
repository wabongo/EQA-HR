package com.eqa.recruitment_service.application;

import com.eqa.recruitment_service.application.DTO.ApplicationRequest;
import com.eqa.recruitment_service.application.DTO.ApplicationResponse;
import com.eqa.recruitment_service.candidate.Candidate;
import com.eqa.recruitment_service.candidate.CandidateRepo;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final DocumentService documentService;
    private final JobPostRepository jobPostRepository;
    private final CandidateRepo candidateRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ApiResponse<?> submitApplication(ApplicationRequest applicationRequest) {
        try {
            JobPost jobPost = jobPostRepository.findById(applicationRequest.getJobPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobPost not found"));

            if (jobPost.getStatus() == JobPost.JobStatus.REQUISITION) {
                return new ApiResponse<>("Cannot apply to a job in REQUISITION status", null, HttpStatus.BAD_REQUEST.value());
            }

            Candidate candidate = candidateRepository.findById(applicationRequest.getCandidateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

            List<Document> documents = new ArrayList<>();
            documents.add(documentService.createDocument(applicationRequest.getCoverLetter(), "CoverLetter"));
            if (applicationRequest.getLicense() != null) {
                documents.add(documentService.createDocument(applicationRequest.getLicense(), "License"));
            }
            if (applicationRequest.getCertificate() != null) {
                documents.add(documentService.createDocument(applicationRequest.getCertificate(), "Certificate"));
            }

            Application application = new Application();
            application.setCandidate(candidate);
            application.setStatus(Application.ApplicationStatus.RECEIVED);
            application.setJobPost(jobPost);
            application.setDocuments(documents);
            application.setApplicationDate(new Date());

            Application savedApplication = applicationRepository.save(application);

            // Update JobPost status to APPLIED if it's not already in a later stage
            if (jobPost.getStatus().ordinal() < JobPost.JobStatus.APPLIED.ordinal()) {
                jobPost.setStatus(JobPost.JobStatus.APPLIED);
                jobPostRepository.save(jobPost);
            }

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
            Application application = applicationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
            ApplicationResponse applicationResponse = modelMapper.map(application, ApplicationResponse.class);
            return new ApiResponse<>("Application fetched successfully", applicationResponse, HttpStatus.OK.value());
        } catch (ResourceNotFoundException e) {
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("An error occurred while fetching application.", e);
            return new ApiResponse<>("An error occurred while fetching application.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Transactional
    public ApiResponse<?> updateApplicationStatus(Long id, Application.ApplicationStatus status) {
        try {
            Application application = applicationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
            application.setStatus(status);
            Application updatedApplication = applicationRepository.save(application);
            ApplicationResponse applicationResponse = modelMapper.map(updatedApplication, ApplicationResponse.class);
            return new ApiResponse<>("Application status updated successfully", applicationResponse, HttpStatus.OK.value());
        } catch (ResourceNotFoundException e) {
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("An error occurred while updating application status.", e);
            return new ApiResponse<>("An error occurred while updating application status.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}