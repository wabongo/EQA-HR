package com.eqa.systemConfig.jobSetup;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Designation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}