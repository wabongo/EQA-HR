package com.eqa.recruitment_service.candidate.DTO;

import com.eqa.recruitment_service.candidate.Candidate.ApplicationStatus;
import lombok.Data;

import java.util.List;

@Data
public class CandidateRequest {
    private String name;
    private String designation;
    private List<String> documents;
    private String facility;
    private String idNumber;
    private String email;
    private String phoneNumber;
}