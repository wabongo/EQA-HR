package com.eqa.auth_service.user;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByIdNumber(String idNumber);

    boolean existsByEmailOrPhoneNumberOrUsernameOrIdNumber(String email, String phoneNumber, String username, String idNumber);
}