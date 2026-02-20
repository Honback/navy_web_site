package com.navy.communication.dto;

import java.util.List;

public record AvailabilityResponseDto(
    List<Long> bookedInstructorIds,
    List<Long> bookedVenueIds
) {}
