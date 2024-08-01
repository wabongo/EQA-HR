package com.eqa.recruitment_service.candidate;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String designation;
    @ElementCollection
    private List<String> documents;
    private String facility;
    private String idNumber;
    private String email;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.RECEIVED;

    public enum ApplicationStatus {
        RECEIVED,
        INTERVIEW_SCHEDULED,
        REVIEWING,
        HIRE,
        NO_HIRE
    }
}