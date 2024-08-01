package com.eqa.auth_service.auditing.data_audit;

import com.eqa.auth_service.config.SecurityContextHelper;
import com.eqa.auth_service.user.User;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;
public class DataAuditListener {

    @PrePersist
    public void onPrePersist(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            User currentUser = SecurityContextHelper.getCurrentUser();
            if (currentUser != null) { // Add this check to ensure currentUser is not null
                if (dataAudit.getCreatedAt() == null) {
                    dataAudit.setCreatedAt(LocalDateTime.now());
                }
                dataAudit.setCreatedBy(currentUser);
            } else {
                System.out.println("Current user is null during onPrePersist"); // Add this line for debugging
            }
        }
    }

    @PreUpdate
    public void onPreUpdate(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            dataAudit.setUpdatedAt(LocalDateTime.now());
            dataAudit.setUpdatedFlag(Constants.YES);
            dataAudit.setUpdatedBy(SecurityContextHelper.getCurrentUser());
        }
    }

    @PreRemove
    public void onPreRemove(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            dataAudit.setDeletedAt(LocalDateTime.now());
            dataAudit.setDeletedFlag(Constants.YES);
            dataAudit.setDeletedBy(SecurityContextHelper.getCurrentUser());
        }
    }

    public void verify(Object entity) {
        if (entity instanceof DataAudit dataAudit) {
            dataAudit.setVerifiedAt(LocalDateTime.now());
            dataAudit.setVerifiedBy(SecurityContextHelper.getCurrentUser());
            dataAudit.setVerifiedFlag(Constants.YES);
        }
    }
}