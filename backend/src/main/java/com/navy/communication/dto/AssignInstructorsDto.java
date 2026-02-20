package com.navy.communication.dto;

public record AssignInstructorsDto(
    Long identityInstructorId,
    Long securityInstructorId,
    Long communicationInstructorId
) {}
