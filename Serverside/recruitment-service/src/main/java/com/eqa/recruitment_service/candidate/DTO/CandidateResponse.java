package com.eqa.recruitment_service.candidate.DTO;

import lombok.Data;

@Data
public class CandidateResponse {
    private Long id;
    private String name;
    private String idNumber;
    private String email;
    private String phoneNumber;
    private DocumentDTO cv;

    @Data
    public static class DocumentDTO {
        private Long id;
        private String fileName;
        private String fileType;
        // Add other necessary fields, but avoid including large data fields
    }
}