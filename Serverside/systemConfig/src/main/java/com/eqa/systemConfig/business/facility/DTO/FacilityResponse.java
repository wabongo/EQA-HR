package com.eqa.systemConfig.business.facility.DTO;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityResponse {
    private Long id;
    private String clinicName;
    private String location;
    private String county;
    private String physicalAddress;
    private String admin;
    private String clinicContact;
    private String email;
    private String clinicType;
    private Long companyId;
    private String companyName;
}