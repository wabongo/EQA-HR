package com.eqa.recruitment_service.job_post.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostRequest {
    private String position;
    private String description;
    private String facility;
    private String requirements;
    private Date deadline;
}