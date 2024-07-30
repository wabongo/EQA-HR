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
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String PHONE_NUMBER_REGEX = "^[0-9]{12}$";

    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender javaMailSender;
    private final ModelMapper modelMapper;

    public ApiResponse<AuthenticationResponse> register(RegisterRequest request) {
        try {
            log.info("Starting user registration for email: {}", request.getEmail());

            // Validate email
            if (request.getEmail() == null || request.getEmail().isEmpty() || !isValidEmail(request.getEmail())) {
                return new ApiResponse<>("Invalid email format", null, HttpStatus.BAD_REQUEST.value());
            }

            // Check if email exists
            Optional<User> checkIfUserEmailExists = repository.findByEmail(request.getEmail());
            if (checkIfUserEmailExists.isPresent()) {
                return new ApiResponse<>("A user with this email already exists.", null, HttpStatus.BAD_REQUEST.value());
            }

            // Validate phone number format
            if (!isValidPhoneNumber(request.getPhoneNumber())) {
                return new ApiResponse<>("Phone number must be exactly 12 digits.", null, HttpStatus.BAD_REQUEST.value());
            }

            // Validate idNumber format
            if (!isValidIdNumber(request.getIdNumber())) {
                return new ApiResponse<>("Invalid format for National ID.", null, HttpStatus.BAD_REQUEST.value());
            }

            // Check if national ID exists
            Optional<User> checkIfNationalIdExists = repository.findByIdNumber(request.getIdNumber());
            if (checkIfNationalIdExists.isPresent()) {
                return new ApiResponse<>("A user with this National ID already exists.", null, HttpStatus.BAD_REQUEST.value());
            }

            // Validate role
            try {
                Role.valueOf(request.getRole());
            } catch (IllegalArgumentException e) {
                return new ApiResponse<>("Invalid role: " + request.getRole(), null, HttpStatus.BAD_REQUEST.value());
            }

            // Generate a random password
            String generatedPassword = generateRandomPassword();

            // Build the user entity
            User user = User.builder()
                    .username(request.getUsername())
                    .designation(request.getDesignation())
                    .facility(request.getFacility())
                    .idNumber(request.getIdNumber())
                    .phoneNumber(request.getPhoneNumber())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(generatedPassword))
                    .systemGeneratedPassword(passwordEncoder.encode(generatedPassword))
                    .firstLogin(true)
                    .role(Role.valueOf(request.getRole()))
                    .terms(request.getTerms())
                    .build();

            // Save the user to the repository
            User savedUser = repository.save(user);
            log.info("User registered successfully with email: {}", savedUser.getEmail());

            try {
                sendPasswordEmail(savedUser.getEmail(), generatedPassword);
            } catch (Exception e) {
                log.error("Failed to send password email for user: {}. Error: {}", savedUser.getEmail(), e.getMessage(), e);
                // Depending on your requirements, you might want to return an error response here
                 return new ApiResponse<>("User registered but failed to send email", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
            }

            // Generate JWT and refresh tokens
            String jwtToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            saveUserToken(savedUser, jwtToken);

            log.info("JWT and Refresh tokens generated for user: {}", savedUser.getEmail());

            // Prepare authentication response
            AuthenticationResponse authResponse = AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .firstLogin(true)
                    .build();

            return new ApiResponse<>("Sign up successful", authResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred during registration", e);
            return new ApiResponse<>("An error occurred", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());

        // Try to find the user by email
        var userOptional = repository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            log.warn("User not found with email: {}", request.getEmail());
            return new ApiResponse<>("User not found", null, HttpStatus.NOT_FOUND.value());
        }

        var user = userOptional.get();
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

        try {
            javaMailSender.send(message);
            log.info("Password email sent successfully to: {}", email);
        } catch (MailException e) {
            log.error("Failed to send password email to: {}. Error: {}", email, e.getMessage(), e);
            // Depending on your requirements, you might want to throw this exception
            // throw new RuntimeException("Failed to send password email", e);
        }
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

    public static boolean isValidEmail(@Nullable String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static boolean isValidPhoneNumber(@Nullable String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }
        Pattern pattern = Pattern.compile(PHONE_NUMBER_REGEX);
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }

    private boolean isValidIdNumber(String idNumber) {
        return idNumber != null && idNumber.matches("[0-9]+") && idNumber.length() > 1;
    }
}