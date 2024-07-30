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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public ApiResponse<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            if (!users.isEmpty()) {
                List<UserResponse> userResponses = users.stream()
                        .map(user -> modelMapper.map(user, UserResponse.class))
                        .collect(Collectors.toList());

                return new ApiResponse<>("Users fetched successfully.", userResponses, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("No users found.", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching users.", e);
            return new ApiResponse<>("An error occurred while fetching users.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getUserProfile(Principal principal) {
        try {
            // Get the email (or username) of the currently authenticated user
            String email = principal.getName();

            // Use the email to fetch the user's profile from the database
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                UserResponse userResponse = modelMapper.map(user, UserResponse.class);

                return new ApiResponse<>("User profile fetched successfully.", userResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("User not found.", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching user profile.", e);
            return new ApiResponse<>("An error occurred while fetching user profile.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

}