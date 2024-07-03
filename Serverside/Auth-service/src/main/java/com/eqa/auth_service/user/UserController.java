package com.eqa.auth_service.user;


import com.eqa.auth_service.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    @PatchMapping
//    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal connectedUser) {
//        userService.changePassword(request, connectedUser);
//        return ResponseEntity.ok().build();
//    }

    @GetMapping("/get/by/idNumber/{idNumber}")
    public ResponseEntity<?> getUserByIdNumber(@PathVariable("idNumber") String idNumber) {
        ApiResponse<?> response = userService.getUserByIdNumber(idNumber);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
