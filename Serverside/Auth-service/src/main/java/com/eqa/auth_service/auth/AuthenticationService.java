package com.eqa.auth_service.auth;

import com.eqa.auth_service.auth.DTO.AuthenticationRequest;
import com.eqa.auth_service.auth.DTO.AuthenticationResponse;
import com.eqa.auth_service.auth.DTO.RegisterRequest;
import com.eqa.auth_service.config.JwtService;
import com.eqa.auth_service.token.Token;
import com.eqa.auth_service.token.TokenRepository;
import com.eqa.auth_service.token.TokenType;
import com.eqa.auth_service.user.ChangePasswordRequest;
import com.eqa.auth_service.user.Role;
import com.eqa.auth_service.user.User;
import com.eqa.auth_service.user.UserRepository;
import com.eqa.auth_service.utils.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender javaMailSender;
    private final ModelMapper modelMapper;
    private final AuditorAware auditorAware;

    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Starting user registration for email: {}", request.getEmail());

        // Check if email, phone number, username, or ID number already exists
        if (repository.existsByEmailOrPhoneNumberOrUsernameOrIdNumber(
                request.getEmail(), request.getPhoneNumber(), request.getUsername(), request.getIdNumber())) {
            log.error("Email, phone number, username, or ID number already exists");
            throw new RuntimeException("Email, phone number, username, or ID number already exists");
        }

        // Validate role
        Role role;
        try {
            role = Role.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            log.error("Invalid role: {}", request.getRole());
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        String generatedPassword = generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(generatedPassword);
        var user = User.builder()
                .username(request.getUsername())
                .designation(request.getDesignation())
                .facility(request.getFacility())
                .idNumber(request.getIdNumber())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .password(encodedPassword)
                .systemGeneratedPassword(encodedPassword)
                .firstLogin(true)
                .role(role)
                .terms(request.getTerms())
                .build();
        var savedUser = repository.save(user);
        log.info("User registered successfully with email: {}", savedUser.getEmail());

        sendPasswordEmail(savedUser.getEmail(), generatedPassword);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);

        log.info("JWT and Refresh tokens generated for user: {}", savedUser.getEmail());
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .firstLogin(savedUser.isFirstLogin())
                .build();
    }

    public ApiResponse<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());
        try {
            // Find the user by email
            var user = repository.findByEmail(request.getEmail()).orElseThrow();

            log.info("User found with email: {}", user.getEmail());

            // Check if it's the user's first login and if the password matches the system-generated password
            boolean isFirstLogin = user.isFirstLogin();
            boolean matchesGeneratedPassword = passwordEncoder.matches(request.getPassword(), user.getSystemGeneratedPassword());

            log.info("User first login status: {}, Password matches generated password: {}", isFirstLogin, matchesGeneratedPassword);

            if (isFirstLogin && matchesGeneratedPassword) {
                log.info("First login detected for user: {}. Prompting password change.", user.getEmail());
                // Return a special response indicating that the user needs to change their password
                AuthenticationResponse firstLoginResponse = AuthenticationResponse.builder()
                        .firstLogin(true)
                        .build();
                return new ApiResponse<>("Change password then login", firstLoginResponse, HttpStatus.OK.value());
            }

            // Authenticate the user
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );
                log.info("Authentication successful for email: {}", request.getEmail());

            } catch (BadCredentialsException e) {
                log.error("Bad credentials for user: {}", request.getEmail());
                return new ApiResponse<>("Invalid credentials", null, HttpStatus.UNAUTHORIZED.value());
            }

            // Generate JWT and refresh tokens
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            log.info("JWT and refresh tokens generated for user: {}", user.getEmail());

            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            log.info("User tokens saved and revoked previous tokens for user: {}", user.getEmail());

            // Create AuthenticationResponse with tokens
            AuthenticationResponse authResponse = AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .firstLogin(false)
                    .build();

            log.info("User authenticated successfully: {}", user.getEmail());
            return new ApiResponse<>("Authentication successful", authResponse, HttpStatus.OK.value());
        } catch (RuntimeException e) {
            log.error("An error occurred during authentication for email: {}", request.getEmail(), e);
            return new ApiResponse<>("An error occurred", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Transactional
    public ApiResponse<String> changePassword(ChangePasswordRequest request) {
        if (request == null) {
            log.error("ChangePasswordRequest is null");
            return new ApiResponse<>("Request cannot be null", null, HttpStatus.BAD_REQUEST.value());
        }

        String email = request.getEmail();
        log.info("Changing password for user with email: {}", email);

        User user = repository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new RuntimeException("User not found");
                });
        log.info("User found with email: {}", email);

        synchronized (user) {
            if (user.isFirstLogin()) {
                return handleFirstLoginPasswordChange(request, user);
            } else {
                return handleRegularPasswordChange(request, user);
            }
        }
    }

    private ApiResponse<String> handleRegularPasswordChange(ChangePasswordRequest request, User user) {
        if (passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            repository.save(user);

            log.info("Password changed successfully for user: {}", user.getEmail());
            return new ApiResponse<>("Password changed successfully", null, HttpStatus.OK.value());
        }

        log.error("Current password does not match for user: {}", request.getEmail());
        return new ApiResponse<>("Current password is incorrect", null, HttpStatus.UNAUTHORIZED.value());

    }

    private ApiResponse<String> handleFirstLoginPasswordChange(ChangePasswordRequest request, User user) {
        if (passwordEncoder.matches(request.getOldPassword(), user.getSystemGeneratedPassword())) {

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstLogin(false);
            repository.save(user);

            log.info("Password changed successfully during first login for user: {}", user.getEmail());
            return new ApiResponse<>("Password changed successfully during first login", null, HttpStatus.OK.value());
        }

        log.error("Current password does not match the system-generated password for first login for user: {}", request.getEmail());
        return new ApiResponse<>("Current password is incorrect", null, HttpStatus.UNAUTHORIZED.value());
    }

    private String generateRandomPassword() {
        int length = 8;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }
        return password.toString();
    }

    private void sendPasswordEmail(String email, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your New Account Password");
        message.setText("Dear user \n\nYour new account has been created. Here is your system-generated password: " + password + "\n\nPlease use this password to log in and change it immediately.\n\nRegards,\nEquity Afia");
        javaMailSender.send(message);
    }

    private void saveUserToken(User user, String jwtToken) {
        log.debug("Saving token for user: {}", user.getEmail());
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
        log.debug("Token saved successfully for user: {}", user.getEmail());
    }

    private void revokeAllUserTokens(User user) {
        log.debug("Revoking all tokens for user: {}", user.getEmail());
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            log.debug("No valid tokens found for user: {}", user.getEmail());
            return;
        }
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
        log.debug("All tokens revoked for user: {}", user.getEmail());
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Refreshing token");
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("No Bearer token found in request");
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            log.debug("Extracted email from refresh token: {}", userEmail);
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", userEmail);
                        return new RuntimeException("User not found");
                    });
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
                log.info("Token refreshed successfully for user: {}", userEmail);
            } else {
                log.warn("Invalid refresh token for user: {}", userEmail);
            }
        } else {
            log.warn("No user email found in refresh token");
        }
    }
}
