package com.eqa.systemConfig.business.facility.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FacilityRequest {

    @NotBlank(message = "Clinic name is required")
    private String clinicName;

    @NotNull(message = "Date opened is required")
    @PastOrPresent(message = "Date opened must be in the past or present")
    private LocalDate dateOpened;

    @NotBlank(message = "Province is required")
    private String province;

    @NotBlank(message = "County is required")
    private String county;

    @NotBlank(message = "Subcounty is required")
    private String subcounty;

    @NotNull(message = "Facility type is required")
    private FacilityType type;

    @NotBlank(message = "Physical address is required")
    private String physicalAddress;

    @NotBlank(message = "Doctor in charge is required")
    private String doctorInCharge;

    @NotBlank(message = "Clinic contact is required")
    @Pattern(regexp = "^\\+?\\d{10,14}$", message = "Invalid phone number format")
    private String clinicContact;

    @NotBlank(message = "LLC name is required")
    private String llcName;

    @NotBlank(message = "Franchisee contact is required")
    @Pattern(regexp = "^\\+?\\d{10,14}$", message = "Invalid phone number format")
    private String franchiseeContact;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String recruitmentEmail;

    public enum FacilityType {
        HUB,
        SATELLITE,
        SPOKE
    }
}