package com.navy.communication.dto;

import java.math.BigDecimal;

public record InstructorCreateDto(
    String name,
    String rank,
    String specialty,
    String phone,
    String email,
    String affiliation,
    String educationTopic,
    String availableRegion,
    BigDecimal rating,
    String recommendation,
    String category,
    String notes,
    String career,
    String oneLineReview,
    String conditions,
    BigDecimal deliveryScore,
    BigDecimal expertiseScore,
    BigDecimal interactionScore,
    BigDecimal timeManagementScore,
    String strengths,
    String weaknesses
) {}
