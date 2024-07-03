package com.eqa.recruitment_service.document;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DocumentService {

    static {
        LoggerFactory.getLogger(DocumentService.class);
    }

    public Document createDocument(MultipartFile file, String documentType) throws IOException {
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setData(file.getBytes());
        document.setDocumentType(documentType);
        return document;
    }
}
