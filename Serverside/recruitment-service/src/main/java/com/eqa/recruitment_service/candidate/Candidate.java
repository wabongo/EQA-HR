package com.eqa.recruitment_service.candidate;

import com.eqa.recruitment_service.document.Document;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String designation;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Document> documents;
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