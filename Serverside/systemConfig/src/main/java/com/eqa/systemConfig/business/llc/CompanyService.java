package com.eqa.systemConfig.business.llc;

import com.eqa.systemConfig.business.llc.DTO.CompanyRequest;
import com.eqa.systemConfig.business.llc.DTO.CompanyResponse;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class CompanyService {
    private final CompanyRepo llcRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CompanyService(CompanyRepo llcRepository, ModelMapper modelMapper) {
        this.llcRepository = llcRepository;
        this.modelMapper = modelMapper;
    }

    public ApiResponse<?> getAllLlcs() {
        try {
            log.info("Fetching all LLCs");
            List<Company> llcs = llcRepository.findAll();
            log.info("Found {} LLCs in the database", llcs.size());

            List<CompanyResponse> companyResponses = new ArrayList<>();
            for (Company llc : llcs) {
                try {
                    CompanyResponse response = modelMapper.map(llc, CompanyResponse.class);
                    companyResponses.add(response);
                } catch (Exception e) {
                    log.error("Error mapping LLC with ID {}: {}", llc.getId(), e.getMessage());
                }
            }

            return new ApiResponse<>("LLCs fetched successfully", companyResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching LLCs: {}", e.getMessage());
            return new ApiResponse<>("Error fetching LLCs", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createLlc(CompanyRequest companyRequest) {
        try {
            log.info("Creating new LLC: {}", companyRequest.getName());
            if (llcRepository.existsByEmail(companyRequest.getEmail())) {
                log.error("Email already exists: {}", companyRequest.getEmail());
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }
            if (llcRepository.existsByKraPin(companyRequest.getKraPin())) {
                log.error("KRA PIN already exists: {}", companyRequest.getKraPin());
                return new ApiResponse<>("KRA PIN already exists", null, HttpStatus.BAD_REQUEST.value());
            }
            Company llc = modelMapper.map(companyRequest, Company.class);
            Company savedLlc = llcRepository.save(llc);
            log.info("LLC created successfully with id: {}", savedLlc.getId());
            CompanyRequest createdCompanyRequest = modelMapper.map(savedLlc, CompanyRequest.class);
            return new ApiResponse<>("LLC created successfully", createdCompanyRequest, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("Error creating LLC: {}", e.getMessage());
            return new ApiResponse<>("Error creating LLC", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getLlc(Long id) {
        try {
            log.info("Fetching LLC with id: {}", id);
            Company llc = llcRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("LLC not found"));
            CompanyResponse companyResponse = modelMapper.map(llc, CompanyResponse.class);
            return new ApiResponse<>("LLC fetched successfully", companyResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("LLC not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error fetching LLC: {}", e.getMessage());
            return new ApiResponse<>("Error fetching LLC", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateLlc(Long id, CompanyRequest companyRequest) {
        try {
            log.info("Updating LLC with id: {}", id);
            Company existingLlc = llcRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("LLC not found"));

            if (!existingLlc.getEmail().equals(companyRequest.getEmail()) && llcRepository.existsByEmail(companyRequest.getEmail())) {
                log.error("Email already exists: {}", companyRequest.getEmail());
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }
            if (!existingLlc.getKraPin().equals(companyRequest.getKraPin()) && llcRepository.existsByKraPin(companyRequest.getKraPin())) {
                log.error("KRA PIN already exists: {}", companyRequest.getKraPin());
                return new ApiResponse<>("KRA PIN already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            modelMapper.map(companyRequest, existingLlc);
            Company updatedLlc = llcRepository.save(existingLlc);
            log.info("LLC updated successfully: {}", updatedLlc.getId());
            CompanyResponse updatedCompanyResponse = modelMapper.map(updatedLlc, CompanyResponse.class);
            return new ApiResponse<>("LLC updated successfully", updatedCompanyResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("LLC not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error updating LLC: {}", e.getMessage());
            return new ApiResponse<>("Error updating LLC", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteLlc(Long id) {
        try {
            log.info("Deleting LLC with id: {}", id);
            if (!llcRepository.existsById(id)) {
                log.error("LLC not found with id: {}", id);
                return new ApiResponse<>("LLC not found", null, HttpStatus.NOT_FOUND.value());
            }
            llcRepository.deleteById(id);
            log.info("LLC deleted successfully: {}", id);
            return new ApiResponse<>("LLC deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error deleting LLC: {}", e.getMessage());
            return new ApiResponse<>("Error deleting LLC", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}