package com.eqa.recruitment_service.document;

import com.eqa.recruitment_service.candidate.Candidate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data", columnDefinition="LONGBLOB")
    private byte[] data;

    private String documentType; // CV, Cover Letter, Other

//    @OneToOne(mappedBy = "document")
//    private Candidate candidate;
}