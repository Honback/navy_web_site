package com.navy.communication.dto;

public record RegisterRequest(
    String email,
    String name,
    String affiliation,
    String phone
) {}
