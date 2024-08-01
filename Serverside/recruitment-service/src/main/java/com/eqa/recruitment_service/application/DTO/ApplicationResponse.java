package com.eqa.recruitment_service.application.DTO;


import com.eqa.recruitment_service.candidate.Candidate;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.job_post.JobPost;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ApplicationResponse {
    private Long id;
    private Date applicationDate;
    private Candidate candidate;
    private String status;
    private JobPost jobPost;
    private List<Document> documents;
}
