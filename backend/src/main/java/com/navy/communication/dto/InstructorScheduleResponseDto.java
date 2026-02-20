package com.navy.communication.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record InstructorScheduleResponseDto(
    Long id,
    Long instructorId,
    String instructorName,
    String instructorRank,
    LocalDate scheduleDate,
    LocalDate endDate,
    String description,
    String source,
    Long requestId,
    LocalDateTime createdAt
) {}
