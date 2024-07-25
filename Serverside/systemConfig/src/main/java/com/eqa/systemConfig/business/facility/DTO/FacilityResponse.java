package com.eqa.systemConfig.business.facility.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityResponse {
    private Long id;
    private String clinicName;
    private LocalDate dateOpened;
    private String province;
    private String county;
    private String subcounty;
    private FacilityRequest.FacilityType type;
    private String physicalAddress;
    private String doctorInCharge;
    private String clinicContact;
    private String companyName;
    private String franchiseeContact;
    private String email;

    // You might want to keep these fields if they're used elsewhere in your application
    private Long companyId;
//    private String companyName;
}