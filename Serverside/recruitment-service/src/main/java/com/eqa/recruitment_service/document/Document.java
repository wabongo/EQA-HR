package com.eqa.recruitment_service.document;


import com.eqa.recruitment_service.application.Application;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;

    @Lob
    private byte[] data;

//    @ManyToOne
//    @JoinColumn(name = "application_id")
//    private Application application;

    private String documentType;
}
