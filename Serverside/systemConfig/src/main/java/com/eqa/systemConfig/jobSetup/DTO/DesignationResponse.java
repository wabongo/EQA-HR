package com.eqa.systemConfig.jobSetup.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignationResponse {
    private Long id;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;
}