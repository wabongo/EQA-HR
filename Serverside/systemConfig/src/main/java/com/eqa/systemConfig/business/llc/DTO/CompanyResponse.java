package com.eqa.systemConfig.business.llc.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {

    private String id;
    private String region;
    private String province;
    private String county;
    private String name;
    private String franchisee;
    private String phoneNumber;
    private String email;
    private String kraPin;
}
