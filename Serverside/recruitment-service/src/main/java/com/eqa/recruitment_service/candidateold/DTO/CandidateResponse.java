package com.eqa.recruitment_service.candidateold.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String nationalId;
    private String region;
//    private boolean blacklisted;
}
