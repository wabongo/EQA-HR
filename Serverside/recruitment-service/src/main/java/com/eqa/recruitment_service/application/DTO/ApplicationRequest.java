package com.eqa.recruitment_service.application.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ApplicationRequest {
    private Long candidateId;
    private Long jobPostId;
    private MultipartFile coverLetter;
    private MultipartFile license;
    private MultipartFile certificate;
}