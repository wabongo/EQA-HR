package com.eqa.recruitment_service.interview;

import com.eqa.recruitment_service.application.Application;
import com.eqa.recruitment_service.application.ApplicationRepository;
import com.eqa.recruitment_service.exception.ResourceNotFoundException;
import com.eqa.recruitment_service.interview.DTO.InterviewRequest;
import com.eqa.recruitment_service.interview.DTO.InterviewResponse;
import com.eqa.recruitment_service.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;

    public ApiResponse<?> getAllInterviews() {
        try {
            List<Interview> interviews = interviewRepository.findAll();
            List<InterviewResponse> interviewResponses = interviews.stream()
                    .map(interview -> modelMapper.map(interview, InterviewResponse.class))
                    .collect(Collectors.toList());

            return new ApiResponse<>("Interviews fetched successfully", interviewResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while fetching interviews.", e);
            return new ApiResponse<>("An error occurred while fetching interviews.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getInterviewById(Long id) {
        try {
            Optional<Interview> interviewOptional = interviewRepository.findById(id);
            if (interviewOptional.isPresent()) {
                Interview interview = interviewOptional.get();
                InterviewResponse interviewResponse = modelMapper.map(interview, InterviewResponse.class);
                return new ApiResponse<>("Interview fetched successfully", interviewResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Interview not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching interview.", e);
            return new ApiResponse<>("An error occurred while fetching interview.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> scheduleInterview(Long applicationId, InterviewRequest interviewRequest) {
        try {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

            Interview interview = modelMapper.map(interviewRequest, Interview.class);
            interview.setApplication(application);
            interview.setStatus("Scheduled");
            Interview savedInterview = interviewRepository.save(interview);
            InterviewResponse interviewResponse = modelMapper.map(savedInterview, InterviewResponse.class);

            return new ApiResponse<>("Interview scheduled successfully", interviewResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred while scheduling interview.", e);
            return new ApiResponse<>("An error occurred while scheduling interview.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateInterview(Long id, InterviewRequest interviewRequest) {
        try {
            Optional<Interview> optionalInterview = interviewRepository.findById(id);
            if (optionalInterview.isEmpty()) {
                return new ApiResponse<>("Interview not found", null, HttpStatus.NOT_FOUND.value());
            }
            Interview interview = optionalInterview.get();
            modelMapper.map(interviewRequest, interview);
            Interview savedInterview = interviewRepository.save(interview);
            InterviewResponse interviewResponse = modelMapper.map(savedInterview, InterviewResponse.class);
            return new ApiResponse<>("Interview updated successfully", interviewResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating interview.", e);
            return new ApiResponse<>("An error occurred while updating interview.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateInterviewStatus(Long id, String status) {
        Optional<Interview> optionalInterview = interviewRepository.findById(id);
        if (optionalInterview.isEmpty()) {
            return new ApiResponse<>("Interview not found", null, HttpStatus.NOT_FOUND.value());
        }

        try {
            Interview interview = optionalInterview.get();
            interview.setStatus(status);
            Interview savedInterview = interviewRepository.save(interview);
            InterviewResponse interviewResponse = modelMapper.map(savedInterview, InterviewResponse.class);

            return new ApiResponse<>("Interview status updated successfully", interviewResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating interview status.", e);
            return new ApiResponse<>("An error occurred while updating interview status.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> addInterviewFeedback(Long id, String feedback) {
        Optional<Interview> optionalInterview = interviewRepository.findById(id);
        if (optionalInterview.isEmpty()) {
            return new ApiResponse<>("Interview not found", null, HttpStatus.NOT_FOUND.value());
        }

        try {
            Interview interview = optionalInterview.get();
            interview.setFeedback(feedback);
            Interview savedInterview = interviewRepository.save(interview);
            InterviewResponse interviewResponse = modelMapper.map(savedInterview, InterviewResponse.class);

            return new ApiResponse<>("Interview feedback added successfully", interviewResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while adding interview feedback.", e);
            return new ApiResponse<>("An error occurred while adding interview feedback.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteInterview(Long id) {
        try {
            if (interviewRepository.existsById(id)) {
                interviewRepository.deleteById(id);
                return new ApiResponse<>("Interview deleted successfully", null, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Interview not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while deleting interview.", e);
            return new ApiResponse<>("An error occurred while deleting interview.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}