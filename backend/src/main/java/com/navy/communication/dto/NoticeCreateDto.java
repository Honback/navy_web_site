package com.navy.communication.dto;

public record NoticeCreateDto(
    String title,
    String content,
    String author,
    Boolean important
) {}
