package com.eqa.recruitment_service.interview;

import com.eqa.recruitment_service.application.Application;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    private LocalDateTime scheduledDateTime;
    private String interviewLocation;
    private String interviewer;
    private String status; // e.g., Scheduled, Completed, etc.
    private String feedback;
}
