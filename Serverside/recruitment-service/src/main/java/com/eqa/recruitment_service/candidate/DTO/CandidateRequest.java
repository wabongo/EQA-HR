package com.eqa.recruitment_service.candidate.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CandidateRequest {
    private String name;
    private String idNumber;
    private String email;
    private String phoneNumber;

    private MultipartFile cv;
}