package com.navy.communication.dto;

import java.time.LocalDate;

public record InstructorScheduleCreateDto(
    Long instructorId,
    LocalDate scheduleDate,
    LocalDate endDate,
    String description
) {}
