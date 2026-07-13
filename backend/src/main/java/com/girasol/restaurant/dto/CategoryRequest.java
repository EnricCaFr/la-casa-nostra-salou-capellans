package com.girasol.restaurant.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record CategoryRequest(
        String name,
        String slug,
        String description,
        @NotNull Integer displayOrder,
        @NotNull Boolean active,
        Map<String, TranslationDto> translations) {
}
