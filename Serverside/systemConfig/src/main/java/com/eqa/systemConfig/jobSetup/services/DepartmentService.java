package com.eqa.systemConfig.jobSetup.services;


import com.eqa.systemConfig.jobSetup.DTO.DepartmentRequest;
import com.eqa.systemConfig.jobSetup.DTO.DepartmentResponse;
import com.eqa.systemConfig.jobSetup.Department;
import com.eqa.systemConfig.jobSetup.DepartmentRepo;
import com.eqa.systemConfig.shared.ApiResponse;
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
public class DepartmentService {

    private final DepartmentRepo departmentRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DepartmentService(DepartmentRepo departmentRepository, ModelMapper modelMapper) {
        this.departmentRepository = departmentRepository;
        this.modelMapper = modelMapper;
    }

    public ApiResponse<?> getAllDepartments() {
        try {
            log.info("Fetching all departments");
            List<Department> departments = departmentRepository.findAll();
            log.info("Found {} departments in the database", departments.size());

            List<DepartmentResponse> departmentResponses = departments.stream()
                    .map(dept -> modelMapper.map(dept, DepartmentResponse.class))
                    .collect(Collectors.toList());

            return new ApiResponse<>("Departments fetched successfully", departmentResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error fetching departments: {}", e.getMessage());
            return new ApiResponse<>("Error fetching departments", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createDepartment(DepartmentRequest departmentRequest) {
        try {
            log.info("Creating new department: {}", departmentRequest.getName());
            if (departmentRepository.existsByName(departmentRequest.getName())) {
                log.error("Department already exists: {}", departmentRequest.getName());
                return new ApiResponse<>("Department already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            Department department = modelMapper.map(departmentRequest, Department.class);
            Department savedDepartment = departmentRepository.save(department);
            log.info("Department created successfully with id: {}", savedDepartment.getId());

            DepartmentResponse createdDepartmentResponse = modelMapper.map(savedDepartment, DepartmentResponse.class);

            return new ApiResponse<>("Department created successfully", createdDepartmentResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("Error creating department: {}", e.getMessage());
            return new ApiResponse<>("Error creating department", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getDepartment(Long id) {
        try {
            log.info("Fetching department with id: {}", id);
            Department department = departmentRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));

            DepartmentResponse departmentResponse = modelMapper.map(department, DepartmentResponse.class);

            return new ApiResponse<>("Department fetched successfully", departmentResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Department not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error fetching department: {}", e.getMessage());
            return new ApiResponse<>("Error fetching department", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateDepartment(Long id, DepartmentRequest departmentRequest) {
        try {
            log.info("Updating department with id: {}", id);
            Department existingDepartment = departmentRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));

            if (!existingDepartment.getName().equals(departmentRequest.getName()) &&
                    departmentRepository.existsByName(departmentRequest.getName())) {
                log.error("Department name already exists: {}", departmentRequest.getName());
                return new ApiResponse<>("Department name already exists", null, HttpStatus.BAD_REQUEST.value());
            }

            modelMapper.map(departmentRequest, existingDepartment);
            Department updatedDepartment = departmentRepository.save(existingDepartment);
            log.info("Department updated successfully: {}", updatedDepartment.getId());

            DepartmentResponse updatedDepartmentResponse = modelMapper.map(updatedDepartment, DepartmentResponse.class);

            return new ApiResponse<>("Department updated successfully", updatedDepartmentResponse, HttpStatus.OK.value());
        } catch (EntityNotFoundException e) {
            log.error("Department not found with id: {}", id);
            return new ApiResponse<>(e.getMessage(), null, HttpStatus.NOT_FOUND.value());
        } catch (Exception e) {
            log.error("Error updating department: {}", e.getMessage());
            return new ApiResponse<>("Error updating department", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteDepartment(Long id) {
        try {
            log.info("Deleting department with id: {}", id);
            if (!departmentRepository.existsById(id)) {
                log.error("Department not found with id: {}", id);
                return new ApiResponse<>("Department not found", null, HttpStatus.NOT_FOUND.value());
            }
            departmentRepository.deleteById(id);
            log.info("Department deleted successfully: {}", id);
            return new ApiResponse<>("Department deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("Error deleting department: {}", e.getMessage());
            return new ApiResponse<>("Error deleting department", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}

