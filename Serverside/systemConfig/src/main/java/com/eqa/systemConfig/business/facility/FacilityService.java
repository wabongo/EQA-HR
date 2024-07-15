package com.eqa.systemConfig.business.facility;




import com.eqa.systemConfig.business.facility.DTO.FacilityRequest;
import com.eqa.systemConfig.business.facility.DTO.FacilityResponse;
import com.eqa.systemConfig.business.llc.Company;
import com.eqa.systemConfig.business.llc.CompanyRepo;
import com.eqa.systemConfig.shared.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepo facilityRepository;
    private final CompanyRepo llcRepository;
    private final ModelMapper modelMapper;

    public ApiResponse<?> createFacility(FacilityRequest request) {
        try {
            if (facilityRepository.existsByEmail(request.getEmail())) {
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Company company = llcRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new EntityNotFoundException("LLC not found"));

            Facility facility = modelMapper.map(request, Facility.class);
            facility.setCompany(company);

            Facility savedFacility = facilityRepository.save(facility);
            FacilityResponse response = modelMapper.map(savedFacility, FacilityResponse.class);
            response.setCompanyName(company.getName());

            return new ApiResponse<>("Facility created successfully", response, HttpStatus.CREATED.value());
        } catch (Exception e) {
            return new ApiResponse<>("Error creating facility: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getAllFacilities() {
        try {
            List<Facility> facilities = facilityRepository.findAll();
            List<FacilityResponse> responses = facilities.stream()
                    .map(facility -> {
                        FacilityResponse response = modelMapper.map(facility, FacilityResponse.class);
                        response.setCompanyId(facility.getCompany().getId());
                        response.setCompanyName(facility.getCompany().getName());
                        return response;
                    })
                    .collect(Collectors.toList());

            return new ApiResponse<>("Facilities fetched successfully", responses, HttpStatus.OK.value());
        } catch (Exception e) {
            return new ApiResponse<>("Error fetching facilities: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getFacility(Long id) {
        try {
            Facility facility = facilityRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Facility not found"));

            FacilityResponse response = modelMapper.map(facility, FacilityResponse.class);
            response.setCompanyId(facility.getCompany().getId());
            response.setCompanyName(facility.getCompany().getName());

            return new ApiResponse<>("Facility fetched successfully", response, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            return new ApiResponse<>("Error fetching facility: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateFacility(Long id, FacilityRequest request) {
        try {
            Facility existingFacility = facilityRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Facility not found"));

            if (!existingFacility.getEmail().equals(request.getEmail()) && facilityRepository.existsByEmail(request.getEmail())) {
                return new ApiResponse<>("Email already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Company company = llcRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new EntityNotFoundException("LLC not found"));

            modelMapper.map(request, existingFacility);
            existingFacility.setCompany(company);

            Facility updatedFacility = facilityRepository.save(existingFacility);
            FacilityResponse response = modelMapper.map(updatedFacility, FacilityResponse.class);
            response.setCompanyName(company.getName());

            return new ApiResponse<>("Facility updated successfully", response, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            return new ApiResponse<>("Error updating facility: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteFacility(Long id) {
        try {
            if (!facilityRepository.existsById(id)) {
                return new ApiResponse<>("Facility not found", null, HttpStatus.NOT_FOUND.value());
            }
            facilityRepository.deleteById(id);
            return new ApiResponse<>("Facility deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            return new ApiResponse<>("Error deleting facility: " + e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}