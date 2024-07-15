package com.eqa.systemConfig.business.facility.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityRequest {
    @NotBlank(message = "Clinic name is required")
    private String clinicName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "County is required")
    private String county;

    @NotBlank(message = "Physical address is required")
    private String physicalAddress;

    @NotBlank(message = "Admin name is required")
    private String admin;

    @NotBlank(message = "Clinic contact is required")
    private String clinicContact;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Clinic type is required")
    private String clinicType;

    @NotNull(message = "Company (LLC) ID is required")
    private Long companyId;
}