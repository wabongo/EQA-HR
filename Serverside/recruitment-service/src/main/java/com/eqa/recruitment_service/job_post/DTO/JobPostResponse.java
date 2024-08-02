package com.eqa.recruitment_service.job_post.DTO;

import com.eqa.recruitment_service.job_post.JobPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostResponse {
    private Long id;
    private String designation;
    private String description;
    private String facility;
    private String requirements;
    private LocalDate deadline;
    private JobPost.JobType jobType;
    private JobPost.JobStatus status;
}