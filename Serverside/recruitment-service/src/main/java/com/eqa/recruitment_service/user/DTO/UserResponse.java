package com.eqa.recruitment_service.user.DTO;

import lombok.Data;

@Data
public class UserResponse {
    private String idNumber;
    private boolean blacklisted;
}
