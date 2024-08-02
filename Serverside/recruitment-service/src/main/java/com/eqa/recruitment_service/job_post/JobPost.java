package com.eqa.recruitment_service.job_post;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

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
    private JobStatus status; // "Open" or "Applied" "Offered"


    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP
    }

    public enum JobStatus {
        OPEN,
        APPLIED,
        INTERVIEWING,
        OFFERED,
        CLOSED
    }
}

