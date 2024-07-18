package com.eqa.systemConfig.business.llc;

import com.eqa.systemConfig.business.facility.Facility;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

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

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Facility> facilities;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank String getRegion() {
        return region;
    }

    public void setRegion(@NotBlank String region) {
        this.region = region;
    }

    public @NotBlank String getProvince() {
        return province;
    }

    public void setProvince(@NotBlank String province) {
        this.province = province;
    }

    public @NotBlank String getCounty() {
        return county;
    }

    public void setCounty(@NotBlank String county) {
        this.county = county;
    }

    public @NotBlank String getName() {
        return name;
    }

    public void setName(@NotBlank String name) {
        this.name = name;
    }

    public @NotBlank String getFranchisee() {
        return franchisee;
    }

    public void setFranchisee(@NotBlank String franchisee) {
        this.franchisee = franchisee;
    }

    public @NotBlank String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NotBlank String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank String email) {
        this.email = email;
    }

    public @NotBlank String getKraPin() {
        return kraPin;
    }

    public void setKraPin(@NotBlank String kraPin) {
        this.kraPin = kraPin;
    }

    public List<Facility> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<Facility> facilities) {
        this.facilities = facilities;
    }
}

