package com.eqa.auth_service.auth.authSession;


import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthSessionRepo extends JpaRepository<AuthSession, Long> {
}