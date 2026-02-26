package com.navy.communication.dto;

public record VenueContactCreateDto(
    Long venueId,
    String name,
    String role,
    String phone,
    String email,
    String preferredContact,
    String notes
) {}
