package com.eqa.recruitment_service.job_post;

import com.eqa.recruitment_service.job_post.DTO.JobPostRequest;
import com.eqa.recruitment_service.job_post.DTO.JobPostResponse;
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
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final ModelMapper modelMapper;

    public ApiResponse<?> getAllJobPosts() {
        try {
            log.info("Fetching all job posts");
            List<JobPost> jobPosts = jobPostRepository.findAll();
            log.info("Found {} job posts in the database", jobPosts.size());

            List<JobPostResponse> jobPostResponses = new ArrayList<>();
            for (JobPost jobPost : jobPosts) {
                try {
                    JobPostResponse response = modelMapper.map(jobPost, JobPostResponse.class);
                    jobPostResponses.add(response);
                } catch (Exception e) {
                    log.error("Error mapping job post with ID {}: {}", jobPost.getId(), e.getMessage());
                }
            }

            log.info("Mapped {} job posts to response DTOs", jobPostResponses.size());
            return new ApiResponse<>("Job posts fetched successfully", jobPostResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching job posts: ", e);
            return new ApiResponse<>("An error occurred while fetching job posts.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getJobPostById(Long id) {
        try {
            log.info("Fetching job post with ID {}", id);
            Optional<JobPost> jobPostOptional = jobPostRepository.findById(id);
            if (jobPostOptional.isPresent()) {
                JobPost jobPost = jobPostOptional.get();
                JobPostResponse jobPostResponse = modelMapper.map(jobPost, JobPostResponse.class);
                log.info("Job post with ID {} fetched successfully", id);
                return new ApiResponse<>("Job post fetched successfully", jobPostResponse, HttpStatus.OK.value());
            } else {
                log.warn("Job post with ID {} not found", id);
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching job post with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while fetching job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createJobPost(JobPostRequest jobPostRequest) {
        try {
            log.info("Creating a new job post");
            JobPost jobPost = modelMapper.map(jobPostRequest, JobPost.class);
            JobPost savedJobPost = jobPostRepository.save(jobPost);
            JobPostResponse jobPostResponse = modelMapper.map(savedJobPost, JobPostResponse.class);
            log.info("Job post created successfully with ID {}", savedJobPost.getId());
            return new ApiResponse<>("Job post created successfully", jobPostResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred while creating job post: ", e);
            return new ApiResponse<>("An error occurred while creating job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateJobPost(Long id, JobPostRequest jobPostRequest) {
        try {
            log.info("Updating job post with ID {}", id);
            Optional<JobPost> optionalJobPost = jobPostRepository.findById(id);
            if (optionalJobPost.isEmpty()) {
                log.warn("Job post with ID {} not found", id);
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
            JobPost jobPost = optionalJobPost.get();
            JobPost updatedJobPost = modelMapper.map(jobPostRequest, JobPost.class);
            updatedJobPost.setId(id);
            JobPost savedJobPost = jobPostRepository.save(updatedJobPost);
            JobPostResponse jobPostResponse = modelMapper.map(savedJobPost, JobPostResponse.class);
            log.info("Job post with ID {} updated successfully", id);
            return new ApiResponse<>("Job post updated successfully", jobPostResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating job post with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while updating job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteJobPost(Long id) {
        try {
            log.info("Deleting job post with ID {}", id);
            if (jobPostRepository.existsById(id)) {
                jobPostRepository.deleteById(id);
                log.info("Job post with ID {} deleted successfully", id);
                return new ApiResponse<>("Job post deleted successfully", null, HttpStatus.OK.value());
            } else {
                log.warn("Job post with ID {} not found", id);
                return new ApiResponse<>("Job post not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while deleting job post with ID {}: ", id, e);
            return new ApiResponse<>("An error occurred while deleting job post.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}
