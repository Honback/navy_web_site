package com.navy.communication.dto;

public record UserCreateDto(
    String email,
    String name,
    String affiliation,
    String phone,
    String role,
    String fleet,
    String ship
) {}
