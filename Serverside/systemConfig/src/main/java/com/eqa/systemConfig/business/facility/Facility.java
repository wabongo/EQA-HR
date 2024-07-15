package com.eqa.systemConfig.business.facility;


import com.eqa.systemConfig.business.llc.Company;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clinicName;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String county;

    @Column(nullable = false)
    private String physicalAddress;

    @Column(nullable = false)
    private String admin;

    @Column(nullable = false)
    private String clinicContact;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String clinicType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "llc_id", nullable = false)
    private Company company;
}