package com.eqa.recruitment_service.job_post;

import com.eqa.recruitment_service.job_post.DTO.JobPostRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/job-posts")
@Tag(name = "Job Posts")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;
    private static final Logger logger = LoggerFactory.getLogger(JobPostController.class);

    @GetMapping("/")
    public ResponseEntity<?> getAllJobPosts() {
        ApiResponse<?> response = jobPostService.getAllJobPosts();
        logger.info("Received request for job posts from authenticated user");
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobPostById(@PathVariable Long id) {
        ApiResponse<?> response = jobPostService.getJobPostById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJobPost(@RequestBody JobPostRequest jobPostRequest) {
        logger.info("Received request to create job post: {}", jobPostRequest);
        ApiResponse<?> response = jobPostService.createJobPost(jobPostRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobPost(@PathVariable Long id, @RequestBody JobPostRequest jobPostRequest) {
        ApiResponse<?> response = jobPostService.updateJobPost(id, jobPostRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobPost(@PathVariable Long id) {
        ApiResponse<?> response = jobPostService.deleteJobPost(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
