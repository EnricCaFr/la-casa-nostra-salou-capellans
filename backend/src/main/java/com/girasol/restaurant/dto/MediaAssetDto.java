package com.girasol.restaurant.dto;

import java.time.LocalDateTime;

public record MediaAssetDto(
        Long id,
        String fileName,
        String originalFileName,
        String contentType,
        Long size,
        String url,
        LocalDateTime createdAt) {
}
