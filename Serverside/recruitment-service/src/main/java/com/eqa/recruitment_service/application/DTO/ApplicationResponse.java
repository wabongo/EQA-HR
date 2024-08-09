package com.eqa.recruitment_service.application.DTO;


import com.eqa.recruitment_service.application.Application;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ApplicationResponse {
    private Long id;
    private Date applicationDate;
    private Long candidateId;
    private String candidateName;
    private Application.ApplicationStatus status;
    private Long jobPostId;
    private String jobPostTitle;
    private List<String> documentNames;
}