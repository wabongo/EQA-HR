package com.eqa.recruitment_service.application.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ApplicationRequest {
    private Long candidateId;
    private Long jobPostId;
    private MultipartFile cv;
    private MultipartFile license;
    private MultipartFile certificate;
}
