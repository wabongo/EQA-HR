package com.eqa.recruitment_service.candidate.DTO;

import com.eqa.recruitment_service.candidate.Candidate;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.job_post.JobPost;
import lombok.Data;

import java.util.List;

@Data
public class CandidateResponse {
    private Long id;
    private String name;
//    private List<String> documents;
    private String facility;
    private String idNumber;
    private String email;
    private String phoneNumber;
    private Candidate.ApplicationStatus status;
    private List<Document> documents;

    private JobPostDetails jobPost;

    @Data
    public static class JobPostDetails {
        private Long id;
        private String designation;
        private JobPost.JobStatus status;
    }
}