package com.eqa.recruitment_service.job_post;


import com.eqa.recruitment_service.candidate.Candidate;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class JobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String designation;
    private String description;
    private String facility;
    private String requirements;
    private LocalDate deadline;


    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.REQUISITION;



    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP
    }

    public enum JobStatus {
        REQUISITION,
        OPEN,
        APPLIED,
        INTERVIEWING,
        OFFERED,
        CLOSED
    }
}

