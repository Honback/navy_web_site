package com.navy.communication.controller;

import com.navy.communication.dto.AssignInstructorsDto;
import com.navy.communication.dto.AvailabilityResponseDto;
import com.navy.communication.dto.PlanUpdateDto;
import com.navy.communication.dto.StatusUpdateDto;
import com.navy.communication.dto.TrainingRequestCreateDto;
import com.navy.communication.dto.TrainingRequestResponseDto;
import com.navy.communication.model.RequestStatus;
import com.navy.communication.service.TrainingRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class TrainingRequestController {

    private final TrainingRequestService trainingRequestService;

    public TrainingRequestController(TrainingRequestService trainingRequestService) {
        this.trainingRequestService = trainingRequestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingRequestResponseDto create(@RequestBody TrainingRequestCreateDto dto) {
        return trainingRequestService.createRequest(dto);
    }

    @GetMapping
    public List<TrainingRequestResponseDto> getAll(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return trainingRequestService.getRequestsByUser(userId);
        }
        return trainingRequestService.getAllRequests();
    }

    @GetMapping("/availability")
    public AvailabilityResponseDto getAvailability(@RequestParam LocalDate date) {
        return trainingRequestService.getAvailability(date);
    }

    @PatchMapping("/{id}/status")
    public TrainingRequestResponseDto updateStatus(@PathVariable Long id,
                                                   @RequestBody StatusUpdateDto dto) {
        RequestStatus status = RequestStatus.valueOf(dto.status());
        return trainingRequestService.updateStatus(id, status);
    }

    @PatchMapping("/{id}/instructors")
    public TrainingRequestResponseDto assignInstructors(@PathVariable Long id,
                                                        @RequestBody AssignInstructorsDto dto) {
        return trainingRequestService.assignInstructors(
                id, dto.identityInstructorId(), dto.securityInstructorId(), dto.communicationInstructorId());
    }

    @PatchMapping("/{id}/plan")
    public TrainingRequestResponseDto updatePlan(@PathVariable Long id,
                                                  @RequestBody PlanUpdateDto dto) {
        return trainingRequestService.updatePlan(id, dto.plan());
    }
}
