package com.eqa.recruitment_service.interview;

import com.eqa.recruitment_service.interview.DTO.InterviewRequest;
import com.eqa.recruitment_service.shared.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/interviews")
@Tag(name = "Interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<?> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleInterview(@RequestParam Long applicationId,
                                               @RequestParam LocalDateTime scheduledDateTime,
                                               @RequestParam String location,
                                               @RequestParam String interviewer) {
        InterviewRequest interviewRequest = InterviewRequest.builder()
                .application(null) // Replace with actual application retrieval logic
                .scheduledDateTime(scheduledDateTime)
                .interviewLocation(location)
                .interviewer(interviewer)
                .status("Scheduled")
                .feedback(null)
                .build();
        ApiResponse<?> response = interviewService.scheduleInterview(applicationId, interviewRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInterview(@PathVariable Long id, @RequestBody InterviewRequest interviewRequest) {
        ApiResponse<?> response = interviewService.updateInterview(id, interviewRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateInterviewStatus(@PathVariable Long id, @RequestParam String status) {
        ApiResponse<?> response = interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PatchMapping("/{id}/feedback")
    public ResponseEntity<?> addInterviewFeedback(@PathVariable Long id, @RequestParam String feedback) {
        ApiResponse<?> response = interviewService.addInterviewFeedback(id, feedback);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInterview(@PathVariable Long id) {
        ApiResponse<?> response = interviewService.deleteInterview(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}