package com.navy.communication.dto;

public record VenueRoomCreateDto(
    Long venueId,
    String name,
    Integer capacity,
    Boolean hasProjector,
    Boolean hasMicrophone,
    Boolean hasWhiteboard,
    String bannerSize,
    String podiumSize,
    String deskLayout,
    String notes
) {}
