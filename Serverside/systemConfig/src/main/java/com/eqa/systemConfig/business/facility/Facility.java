package com.eqa.systemConfig.business.facility;

import com.eqa.systemConfig.business.llc.Company;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "facilities")
@Data
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clinicName;

    @Column(nullable = false)
    private LocalDate dateOpened;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String county;

    @Column(nullable = false)
    private String subcounty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;

    @Column(nullable = false)
    private String physicalAddress;

    @Column(nullable = false)
    private String doctorInCharge;

    @Column(nullable = false)
    private String clinicContact;

    @Column(nullable = false)
    private String franchiseeContact;

    @Column(unique = true)
    private String recruitmentEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public enum FacilityType {
        HUB,
        SATELLITE,
        SPOKE
    }
}