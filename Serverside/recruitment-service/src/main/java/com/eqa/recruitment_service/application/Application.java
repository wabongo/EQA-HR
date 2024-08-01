package com.eqa.recruitment_service.application;

import com.eqa.recruitment_service.candidateold.Candidate;
import com.eqa.recruitment_service.document.Document;
import com.eqa.recruitment_service.job_post.JobPost;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date applicationDate;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "job_post_id")
    private JobPost jobPost;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "application_id")
    private List<Document> documents;
}