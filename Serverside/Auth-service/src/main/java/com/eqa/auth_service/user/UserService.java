package com.eqa.auth_service.user;

import com.eqa.auth_service.user.DTO.UserResponse;
import com.eqa.auth_service.utils.ApiResponse;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        log.info("Starting password change process for user: {}", connectedUser.getName());

        var user = userRepository.findByEmail(connectedUser.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.debug("Fetched user details from principal: {}", user.getUsername());

        if (user.isFirstLogin()) {
            handleFirstLoginPasswordChange(request, user);
        } else {
            handleRegularPasswordChange(request, user);
        }
    }

    private void handleFirstLoginPasswordChange(ChangePasswordRequest request, User user) {
        // Check if the current password matches the system-generated password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getSystemGeneratedPassword())) {
            log.warn("System-generated password mismatch for user: {}", user.getUsername());
            throw new IllegalStateException("Wrong password");
        }

        // Check if the new password and confirmation password are the same
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            log.warn("New password and confirmation password do not match for user: {}", user.getUsername());
            throw new IllegalStateException("Passwords are not the same");
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setSystemGeneratedPassword(null);  // Clear the system-generated password
        user.setFirstLogin(false);  // Set first login to false

        // Save the new password
        userRepository.save(user);
        log.info("Password change successful for first login user: {}", user.getUsername());
    }

    private void handleRegularPasswordChange(ChangePasswordRequest request, User user) {
        // Check if the current password is correct
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            log.warn("Current password mismatch for user: {}", user.getUsername());
            throw new IllegalStateException("Wrong password");
        }

        // Check if the new password and confirmation password are the same
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            log.warn("New password and confirmation password do not match for user: {}", user.getUsername());
            throw new IllegalStateException("Passwords are not the same");
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save the new password
        userRepository.save(user);
        log.info("Password change successful for user: {}", user.getUsername());
    }

    public ApiResponse<?> getUserByIdNumber(String idNumber) {
        try {
            Optional<User> userOptional = userRepository.findByIdNumber(idNumber);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                UserResponse userResponse = modelMapper.map(user, UserResponse.class);

                return new ApiResponse<>("User Fetched Successfully.", userResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("User not found.", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching user.", e);
            return new ApiResponse<>("An error occurred while fetching user.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}