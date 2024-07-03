//package com.eqa.recruitment_service.user;
//
//import com.eqa.recruitment_service.user.DTO.UserResponse;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//
//    private final RestTemplate restTemplate;
//
//    @Value("${user.service.url}")
//    private String userServiceUrl;
//
//    @Value("${user.service.url}")
//    public void setUserServiceUrl(String userServiceUrl) {
//        this.userServiceUrl = userServiceUrl;
//    }
//
//    public boolean isUserBlacklisted(String idNumber) {
//        String url = userServiceUrl + "/get/by/idNumber/" + idNumber;
//        UserResponse user = restTemplate.getForObject(url, UserResponse.class);
//        return user != null && user.isBlacklisted();
//    }
//}
//
//
