package com.eqa.recruitment_service.job_post;

import com.eqa.recruitment_service.job_post.DTO.JobPostRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/job-posts")
@Tag(name = "Job Posts")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;
    private static final Logger logger = LoggerFactory.getLogger(JobPostController.class);



    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        logger.info("Received request for all departments");
        ApiResponse<?> response = jobPostService.getDepartments();
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/job-types")
    public ResponseEntity<?> getJobTypes() {
        logger.info("Received request for all job types");
        ApiResponse<?> response = jobPostService.getJobTypes();
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/designations")
    public ResponseEntity<?> getDesignations() {
        logger.info("Received request for all designations");
        ApiResponse<?> response = jobPostService.getDesignations();
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String designation) {
        logger.info("Received search request with params - department: {}, jobType: {}, designation: {}",
                department, jobType, designation);
        ApiResponse<?> response = jobPostService.searchJobs(department, jobType, designation);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllJobPosts(Authentication authentication) {
        logger.info("Received request for all job posts. User: {}", authentication.getName());
        ApiResponse<?> response = jobPostService.getAllJobPosts();
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getJobsByStatus(@PathVariable JobPost.JobStatus status) {
        logger.info("Received request for jobs with status: {}", status);
        ApiResponse<?> response = jobPostService.getJobsByStatus(status);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getJobPostById(@PathVariable Long id) {
        logger.info("Received request for job post with ID: {}", id);
        ApiResponse<?> response = jobPostService.getJobPostById(id);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createJobPost(@RequestBody JobPostRequest jobPostRequest) {
        logger.info("Received request to create job post: {}", jobPostRequest);
        ApiResponse<?> response = jobPostService.createJobPost(jobPostRequest);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateJobPost(@PathVariable Long id, @RequestBody JobPostRequest jobPostRequest) {
        logger.info("Received request to update job post with ID: {}", id);
        logger.info("Job post request data: {}", jobPostRequest);
        ApiResponse<?> response = jobPostService.updateJobPost(id, jobPostRequest);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobPost(@PathVariable Long id) {
        logger.info("Received request to delete job post with ID: {}", id);
        ApiResponse<?> response = jobPostService.deleteJobPost(id);
        logger.info("Returning response with status: {}", response.getStatusCode());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}
