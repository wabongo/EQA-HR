package com.eqa.systemConfig.business.facility;

import com.eqa.systemConfig.business.facility.DTO.FacilityRequest;
import com.eqa.systemConfig.business.facility.DTO.FacilityResponse;
import com.eqa.systemConfig.business.llc.Company;
import com.eqa.systemConfig.business.llc.CompanyRepo;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class FacilityService {

    private final FacilityRepo facilityRepository;
    private final CompanyRepo companyRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public FacilityService(FacilityRepo facilityRepository, CompanyRepo companyRepository, ModelMapper modelMapper) {
        this.facilityRepository = facilityRepository;
        this.companyRepository = companyRepository;
        this.modelMapper = modelMapper;
    }

    public ApiResponse<?> getAllFacilities() {
        try {
            log.info("Fetching all facilities");
            List<Facility> facilities = facilityRepository.findAll();
            log.info("Found {} facilities in the database", facilities.size());

            List<FacilityResponse> facilityResponses = new ArrayList<>();
            for (Facility facility : facilities) {
                try {
                    FacilityResponse response = modelMapper.map(facility, FacilityResponse.class);
                    response.setCompanyName(facility.getCompany().getName());
                    facilityResponses.add(response);
                } catch (Exception e) {
                    log.error("Error mapping facility with ID {}: {}", facility.getId(), e.getMessage());
                }
            }

            return new ApiResponse<>("Facilities fetched successfully", facilityResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching facilities: {}", e.getMessage());
            return new ApiResponse<>("Error fetching facilities", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createFacility(FacilityRequest facilityRequest) {
        try {
            log.info("Creating new facility: {}", facilityRequest.getClinicName());
            if (facilityRepository.existsByEmail(facilityRequest.getEmail())) {
                log.error("Email already exists: {}", facilityRequest.getEmail());
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Optional<Company> companyOptional = companyRepository.findAll().stream()
                    .filter(company -> company.getName().equals(facilityRequest.getLlcName()))
                    .findFirst();

            if (companyOptional.isEmpty()) {
                log.error("LLC not found: {}", facilityRequest.getLlcName());
                return new ApiResponse<>("LLC not found", null, HttpStatus.NOT_FOUND.value());
            }

            Company company = companyOptional.get();
            Facility facility = modelMapper.map(facilityRequest, Facility.class);
            facility.setCompany(company);

            Facility savedFacility = facilityRepository.save(facility);
            log.info("Facility created successfully with id: {}", savedFacility.getId());

            FacilityResponse createdFacilityResponse = modelMapper.map(savedFacility, FacilityResponse.class);
            createdFacilityResponse.setCompanyName(company.getName());

            return new ApiResponse<>("Facility created successfully", createdFacilityResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("Error creating facility: {}", e.getMessage());
            return new ApiResponse<>("Error creating facility", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getFacility(Long id) {
        try {
            log.info("Fetching facility with id: {}", id);
            Facility facility = facilityRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Facility not found"));

            FacilityResponse facilityResponse = modelMapper.map(facility, FacilityResponse.class);
            facilityResponse.setCompanyName(facility.getCompany().getName());

            return new ApiResponse<>("Facility fetched successfully", facilityResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Facility not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error fetching facility: {}", e.getMessage());
            return new ApiResponse<>("Error fetching facility", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateFacility(Long id, FacilityRequest facilityRequest) {
        try {
            log.info("Updating facility with id: {}", id);
            Facility existingFacility = facilityRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Facility not found"));

            if (!existingFacility.getEmail().equals(facilityRequest.getEmail()) && facilityRepository.existsByEmail(facilityRequest.getEmail())) {
                log.error("Email already exists: {}", facilityRequest.getEmail());
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Optional<Company> companyOptional = companyRepository.findAll().stream()
                    .filter(company -> company.getName().equals(facilityRequest.getLlcName()))
                    .findFirst();

            if (companyOptional.isEmpty()) {
                log.error("LLC not found: {}", facilityRequest.getLlcName());
                return new ApiResponse<>("LLC not found", null, HttpStatus.NOT_FOUND.value());
            }

            Company company = companyOptional.get();
            modelMapper.map(facilityRequest, existingFacility);
            existingFacility.setCompany(company);

            Facility updatedFacility = facilityRepository.save(existingFacility);
            log.info("Facility updated successfully: {}", updatedFacility.getId());

            FacilityResponse updatedFacilityResponse = modelMapper.map(updatedFacility, FacilityResponse.class);
            updatedFacilityResponse.setCompanyName(company.getName());

            return new ApiResponse<>("Facility updated successfully", updatedFacilityResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Facility not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error updating facility: {}", e.getMessage());
            return new ApiResponse<>("Error updating facility", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteFacility(Long id) {
        try {
            log.info("Deleting facility with id: {}", id);
            if (!facilityRepository.existsById(id)) {
                log.error("Facility not found with id: {}", id);
                return new ApiResponse<>("Facility not found", null, HttpStatus.NOT_FOUND.value());
            }
            facilityRepository.deleteById(id);
            log.info("Facility deleted successfully: {}", id);
            return new ApiResponse<>("Facility deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error deleting facility: {}", e.getMessage());
            return new ApiResponse<>("Error deleting facility", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}