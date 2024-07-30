package com.eqa.auth_service;

import com.eqa.auth_service.auth.AuthenticationService;
import com.eqa.auth_service.auth.DTO.RegisterRequest;
import com.eqa.auth_service.user.Role;
import com.eqa.auth_service.user.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaAuditing
@Slf4j
public class AuthServiceApplication {



	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	public CommandLineRunner commandLineRunner(AuthenticationService service, UserRepository userRepository) {
		return args -> {
			createAdminUser(service, userRepository);

		};
	}

	@Bean
	public CommandLineRunner createAdminUser(AuthenticationService service, UserRepository userRepository) {
		return args -> {
			String adminEmail = "admin@mail.com";
			String adminIdNumber = "34018528";

			log.info("Checking for existing admin user...");

			if (userRepository.findByEmail(adminEmail).isEmpty() && userRepository.findByIdNumber(adminIdNumber).isEmpty()) {
				log.info("Admin user not found. Attempting to create...");

				var adminRequest = RegisterRequest.builder()
						.username("Admin")
						.designation("Administrator")
						.facility("Head Office")
						.idNumber(adminIdNumber)
						.phoneNumber("254712345678")
						.email(adminEmail)
						.role("ADMIN")
						.terms("Full Time")
						.build();

				try {
					var response = service.register(adminRequest);
					if (response.getStatusCode() == HttpStatus.CREATED.value()) {
						log.info("Admin user created successfully");
						// Uncomment the next line if you want to see the admin token in the logs
						// log.info("Admin token: {}", response.getData().getAccessToken());
					} else {
						log.warn("Admin user creation failed. Status: {}, Message: {}",
								response.getStatusCode(), response.getMessage());
					}
				} catch (Exception e) {
					log.error("Error creating admin user", e);
				}
			} else {
				log.info("Admin user already exists.");
			}
		};
	}
}