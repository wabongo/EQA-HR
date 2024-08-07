package com.eqa.recruitment_service.candidate.DTO;

import com.eqa.recruitment_service.document.Document;
import lombok.Data;

@Data
public class CandidateResponse {
    private Long id;
    private String name;
    private String idNumber;
    private String email;
    private String phoneNumber;
    private Document cv;
}