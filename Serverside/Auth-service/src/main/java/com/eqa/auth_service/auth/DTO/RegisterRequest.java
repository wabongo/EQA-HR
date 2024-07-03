package com.eqa.auth_service.auth.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String username;
    private String designation;
    private String facility;
    private String idNumber;
    private String phoneNumber;
    private String email;
    private String role;
    private String terms; // e.g., full time, part time, commissionable
}
