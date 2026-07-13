package com.girasol.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record AllergenTagRequest(
        String code,
        String name,
        @NotBlank String icon,
        @NotBlank String type,
        Map<String, TranslationDto> translations) {
}
