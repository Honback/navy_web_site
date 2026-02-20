package com.navy.communication.dto;

import java.time.LocalDate;

public record TrainingRequestCreateDto(
    Long userId,
    Long identityInstructorId,
    Long securityInstructorId,
    Long communicationInstructorId,
    Long venueId,
    Long secondVenueId,
    String trainingType,
    String fleet,
    LocalDate requestDate,
    LocalDate requestEndDate,
    String startTime,
    String notes
) {}
