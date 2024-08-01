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
public class JobPostRequest {
    private String designation;
    private String description;
    private String facility;
    private String requirements;
    private LocalDate deadline;
    private JobPost.JobType jobType;
    // Note: We typically don't include status in the request as it's usually set by the system
}