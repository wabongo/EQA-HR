package com.eqa.auth_service.user;

import com.eqa.auth_service.auth.AuthenticationService;
import com.eqa.auth_service.auth.DTO.RegisterRequest;
import com.eqa.auth_service.utils.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

//    @PatchMapping
//    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal connectedUser) {
//        userService.changePassword(request, connectedUser);
//        return ResponseEntity.ok().build();
//    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        ApiResponse<?> response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @GetMapping("/get/by/idNumber/{idNumber}")
    public ResponseEntity<?> getUserByIdNumber(@PathVariable("idNumber") String idNumber) {
        ApiResponse<?> response = userService.getUserByIdNumber(idNumber);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}