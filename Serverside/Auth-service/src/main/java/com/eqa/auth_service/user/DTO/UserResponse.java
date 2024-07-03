package com.eqa.auth_service.user.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String designation;
    private String facility;
    private String idNumber;
    private String phoneNumber;
    private String email;
    private String role;
    private String terms;
    private boolean firstLogin;
}