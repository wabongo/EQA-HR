package com.eqa.recruitment_service.candidateold;

import com.eqa.recruitment_service.candidateold.DTO.CandidateRequest;
import com.eqa.recruitment_service.candidateold.DTO.CandidateResponse;
import com.eqa.recruitment_service.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final ModelMapper modelMapper;

    public ApiResponse<?> getAllCandidates() {
        try {
            List<Candidate> candidates = candidateRepository.findAll();
            List<CandidateResponse> candidateResponses = candidates.stream()
                    .map(candidate -> modelMapper.map(candidate, CandidateResponse.class))
                    .collect(Collectors.toList());

            return new ApiResponse<>("Candidates fetched successfully", candidateResponses, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while fetching candidates.", e);
            return new ApiResponse<>("An error occurred while fetching candidates.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> getCandidateById(Long id) {
        try {
            Optional<Candidate> candidateOptional = candidateRepository.findById(id);
            if (candidateOptional.isPresent()) {
                Candidate candidate = candidateOptional.get();
                CandidateResponse candidateResponse = modelMapper.map(candidate, CandidateResponse.class);
                return new ApiResponse<>("Candidate fetched successfully", candidateResponse, HttpStatus.OK.value());
            } else {
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
        } catch (Exception e) {
            log.error("An error occurred while fetching candidate.", e);
            return new ApiResponse<>("An error occurred while fetching candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> createCandidate(CandidateRequest candidateRequest) {
        try {
            Candidate candidate = modelMapper.map(candidateRequest, Candidate.class);
            Candidate savedCandidate = candidateRepository.save(candidate);
            CandidateResponse candidateResponse = modelMapper.map(savedCandidate, CandidateResponse.class);
            return new ApiResponse<>("Candidate created successfully", candidateResponse, HttpStatus.CREATED.value());
        } catch (Exception e) {
            log.error("An error occurred while creating candidate.", e);
            return new ApiResponse<>("An error occurred while creating candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> updateCandidate(Long id, CandidateRequest candidateRequest) {
        try {
            Optional<Candidate> optionalCandidate = candidateRepository.findById(id);
            if (optionalCandidate.isEmpty()) {
                return new ApiResponse<>("Candidate not found", null, HttpStatus.NOT_FOUND.value());
            }
            Candidate candidate = optionalCandidate.get();
            Candidate updatedCandidate = modelMapper.map(candidateRequest, Candidate.class);
            updatedCandidate.setId(id);
            Candidate savedCandidate = candidateRepository.save(updatedCandidate);
            CandidateResponse candidateResponse = modelMapper.map(savedCandidate, CandidateResponse.class);
            return new ApiResponse<>("Candidate updated successfully", candidateResponse, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while updating candidate.", e);
            return new ApiResponse<>("An error occurred while updating candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public ApiResponse<?> deleteCandidate(Long id) {
        try {
            candidateRepository.deleteById(id);
            return new ApiResponse<>("Candidate deleted successfully", null, HttpStatus.OK.value());
        } catch (Exception e) {
            log.error("An error occurred while deleting candidate.", e);
            return new ApiResponse<>("An error occurred while deleting candidate.", null, HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}