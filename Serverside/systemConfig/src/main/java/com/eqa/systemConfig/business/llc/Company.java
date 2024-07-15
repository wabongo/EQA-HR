package com.eqa.systemConfig.business.llc;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// LLC.java
@Entity
@Table(name = "companies")
@Data
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String region;

    @NotBlank
    private String province;

    @NotBlank
    private String county;

    @NotBlank
    private String name;

    @NotBlank
    private String franchisee;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    @Column(unique = true)
    private String kraPin;
}

