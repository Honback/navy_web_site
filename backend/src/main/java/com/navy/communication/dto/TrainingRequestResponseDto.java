package com.navy.communication.dto;

import com.navy.communication.model.RequestStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TrainingRequestResponseDto(
    Long id,
    Long userId,
    String userName,
    String userEmail,
    Long identityInstructorId,
    String identityInstructorName,
    String identityInstructorRank,
    Long securityInstructorId,
    String securityInstructorName,
    String securityInstructorRank,
    Long communicationInstructorId,
    String communicationInstructorName,
    String communicationInstructorRank,
    Long venueId,
    String venueName,
    String venueRoomNumber,
    Long secondVenueId,
    String secondVenueName,
    String secondVenueRoomNumber,
    String trainingType,
    String fleet,
    LocalDate requestDate,
    LocalDate requestEndDate,
    String startTime,
    RequestStatus status,
    String notes,
    String plan,
    LocalDateTime createdAt
) {}
