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


//    private MultipartFile coverLetter;
//    private MultipartFile license;
//    private MultipartFile certificate;
//    private String designation;
//    private Long jobPostId;
//    private List<String> documents;
//    private String facility;
}