package com.eqa.auth_service.auth.authSession;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class AuthSession {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "sn", updatable = false)
    private Long sn;
    private UUID uuid;
    private String username;
    private String Status;
    private Character isActive = 'N';
    private String activity;
    private Date actionTime;
    private String address;
    private String os;
    private String browser;
}