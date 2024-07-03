package com.eqa.recruitment_service.candidate.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String nationalId;
    private String region;
}
