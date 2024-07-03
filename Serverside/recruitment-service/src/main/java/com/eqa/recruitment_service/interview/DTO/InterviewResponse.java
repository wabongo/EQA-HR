package com.eqa.recruitment_service.interview.DTO;

import com.eqa.recruitment_service.application.Application;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private Long id;
    private Application application;
    private LocalDateTime scheduledDateTime;
    private String interviewLocation;
    private String interviewer;
    private String status;
    private String feedback;
}
