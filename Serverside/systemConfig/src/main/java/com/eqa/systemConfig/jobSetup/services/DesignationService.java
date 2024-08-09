package com.eqa.systemConfig.jobSetup.services;

import com.eqa.systemConfig.jobSetup.DTO.DesignationRequest;
import com.eqa.systemConfig.jobSetup.DTO.DesignationResponse;
import com.eqa.systemConfig.jobSetup.Department;
import com.eqa.systemConfig.jobSetup.DepartmentRepo;
import com.eqa.systemConfig.jobSetup.DesignationRepo;
import com.eqa.systemConfig.shared.ApiResponse;
import com.eqa.systemConfig.jobSetup.Designation;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DesignationService {

    private final DesignationRepo designationRepository;
    private final DepartmentRepo departmentRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DesignationService(DesignationRepo designationRepository, DepartmentRepo departmentRepository, ModelMapper modelMapper) {
        this.designationRepository = designationRepository;
        this.departmentRepository = departmentRepository;
        this.modelMapper = modelMapper;
    }

    public ApiResponse<?> getAllDesignations() {
        try {
            log.info("Fetching all designations");
            List<Designation> designations = designationRepository.findAll();
            log.info("Found {} designations in the database", designations.size());

            List<DesignationResponse> designationResponses = designations.stream()
                    .map(this::mapToDesignationResponse)
                    .collect(Collectors.toList());

            return new ApiResponse<>("Designations fetched successfully", designationResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching designations: {}", e.getMessage());
            return new ApiResponse<>("Error fetching designations", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createDesignation(DesignationRequest designationRequest) {
        try {
            log.info("Creating new designation: {}", designationRequest.getTitle());
            if (designationRepository.existsByTitle(designationRequest.getTitle())) {
                log.error("Designation already exists: {}", designationRequest.getTitle());
                return new ApiResponse<>("Designation already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Department department = departmentRepository.findById(designationRequest.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));

            Designation designation = modelMapper.map(designationRequest, Designation.class);
            designation.setDepartment(department);

            Designation savedDesignation = designationRepository.save(designation);
            log.info("Designation created successfully with id: {}", savedDesignation.getId());

            DesignationResponse createdDesignationResponse = mapToDesignationResponse(savedDesignation);

            return new ApiResponse<>("Designation created successfully", createdDesignationResponse, HttpStatus.CREATED.value());
        } catch (EntityNotFoundException e) {
            log.error("Department not found: {}", designationRequest.getDepartmentId());
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error creating designation: {}", e.getMessage());
            return new ApiResponse<>("Error creating designation", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getDesignation(Long id) {
        try {
            log.info("Fetching designation with id: {}", id);
            Designation designation = designationRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Designation not found"));

            DesignationResponse designationResponse = mapToDesignationResponse(designation);

            return new ApiResponse<>("Designation fetched successfully", designationResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Designation not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error fetching designation: {}", e.getMessage());
            return new ApiResponse<>("Error fetching designation", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateDesignation(Long id, DesignationRequest designationRequest) {
        try {
            log.info("Updating designation with id: {}", id);
            Designation existingDesignation = designationRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Designation not found"));

            if (!existingDesignation.getTitle().equals(designationRequest.getTitle()) &&
                    designationRepository.existsByTitle(designationRequest.getTitle())) {
                log.error("Designation title already exists: {}", designationRequest.getTitle());
                return new ApiResponse<>("Designation title already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Department department = departmentRepository.findById(designationRequest.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));

            modelMapper.map(designationRequest, existingDesignation);
            existingDesignation.setDepartment(department);

            Designation updatedDesignation = designationRepository.save(existingDesignation);
            log.info("Designation updated successfully: {}", updatedDesignation.getId());

            DesignationResponse updatedDesignationResponse = mapToDesignationResponse(updatedDesignation);

            return new ApiResponse<>("Designation updated successfully", updatedDesignationResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Designation or Department not found: {}", e.getMessage());
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error updating designation: {}", e.getMessage());
            return new ApiResponse<>("Error updating designation", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteDesignation(Long id) {
        try {
            log.info("Deleting designation with id: {}", id);
            if (!designationRepository.existsById(id)) {
                log.error("Designation not found with id: {}", id);
                return new ApiResponse<>("Designation not found", null, HttpStatus.NOT_FOUND.value());
            }
            designationRepository.deleteById(id);
            log.info("Designation deleted successfully: {}", id);
            return new ApiResponse<>("Designation deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error deleting designation: {}", e.getMessage());
            return new ApiResponse<>("Error deleting designation", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private DesignationResponse mapToDesignationResponse(Designation designation) {
        DesignationResponse response = modelMapper.map(designation, DesignationResponse.class);
        response.setDepartmentName(designation.getDepartment().getName());
        return response;
    }
}