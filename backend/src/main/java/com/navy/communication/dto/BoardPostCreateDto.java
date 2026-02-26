package com.navy.communication.dto;

public record BoardPostCreateDto(
    String title,
    String content,
    String summary,
    String author,
    String tags,
    String images
) {}
