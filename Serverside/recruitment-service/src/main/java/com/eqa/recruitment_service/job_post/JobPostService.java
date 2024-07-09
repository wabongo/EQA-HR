package com.eqa.recruitment_service.job_post;

import com.eqa.recruitment_service.job_post.DTO.JobPostRequest;
import com.eqa.recruitment_service.job_post.DTO.JobPostResponse;
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
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final ModelMapper modelMapper;




    public ApiResponse<?> getAllJobPosts() {
        try {
            log.debug("Fetching all job posts");
            List<JobPost> jobPosts = jobPostRepository.findAll();
            List<JobPostResponse> jobPostResponses = jobPosts.stream()
                    .map(jobPost -> modelMapper.map(jobPost, JobPostResponse.class))
                    .collect(Collectors.toList());
            log.debug("Fetched {} job posts", jobPostResponses.size());
            return new ApiResponse<>("Job posts fetched successfully", jobPostResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching job posts: ", e);
            return new ApiResponse<>("An error occurred while fetching job posts.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getJobPostById(Long id) {
        try {
            Optional<JobPost> jobPostOptional = jobPostRepository.findById(id);
            if (jobPostOptional.isPresent()) {
                JobPost jobPost = jobPostOptional.get();
                JobPostResponse jobPostResponse = modelMapper.map(jobPost, JobPostResponse.class);
                return new ApiResponse<>("Job post fetched successfully", jobPostResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching job post.", e);
            return new ApiResponse<>("An error occurred while fetching job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createJobPost(JobPostRequest jobPostRequest) {
        try {
            JobPost jobPost = modelMapper.map(jobPostRequest, JobPost.class);
            JobPost savedJobPost = jobPostRepository.save(jobPost);
            JobPostResponse jobPostResponse = modelMapper.map(savedJobPost, JobPostResponse.class);
            return new ApiResponse<>("Job post created successfully", jobPostResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred while creating job post.", e);
            return new ApiResponse<>("An error occurred while creating job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateJobPost(Long id, JobPostRequest jobPostRequest) {
        try {
            Optional<JobPost> optionalJobPost = jobPostRepository.findById(id);
            if (optionalJobPost.isEmpty()) {
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
            JobPost jobPost = optionalJobPost.get();
            JobPost updatedJobPost = modelMapper.map(jobPostRequest, JobPost.class);
            updatedJobPost.setId(id);
            JobPost savedJobPost = jobPostRepository.save(updatedJobPost);
            JobPostResponse jobPostResponse = modelMapper.map(savedJobPost, JobPostResponse.class);
            return new ApiResponse<>("Job post updated successfully", jobPostResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating job post.", e);
            return new ApiResponse<>("An error occurred while updating job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteJobPost(Long id) {
        try {
            if (jobPostRepository.existsById(id)) {
                jobPostRepository.deleteById(id);
                return new ApiResponse<>("Job post deleted successfully", null, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while deleting job post.", e);
            return new ApiResponse<>("An error occurred while deleting job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}
