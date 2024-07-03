package com.eqa.auth_service.auditing.data_audit;


import com.eqa.auth_service.config.SecurityContextHelper;
import com.eqa.auth_service.user.User;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

public class DataAuditListener {

    @PrePersist
    public void onPrePersist(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            User currentUser = SecurityContextHelper.getCurrentUser();

            if (dataAudit.getCreatedAt() == null) {
                dataAudit.setCreatedAt(LocalDateTime.now());
            }
            dataAudit.setCreatedBy(currentUser);
        }
    }

    public void verify(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            User currentUser = SecurityContextHelper.getCurrentUser();

            dataAudit.setVerifiedAt(LocalDateTime.now());
            dataAudit.setVerifiedBy(currentUser);
            dataAudit.setVerifiedFlag(Constants.YES);
        }
    }
}

