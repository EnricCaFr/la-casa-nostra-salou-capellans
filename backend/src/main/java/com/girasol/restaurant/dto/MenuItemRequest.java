package com.girasol.restaurant.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;

public record MenuItemRequest(
        String name,
        String slug,
        String description,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        String imageUrl,
        Long imageAssetId,
        Boolean highlighted,
        Boolean active,
        Integer displayOrder,
        @NotNull Long categoryId,
        Set<String> tagCodes,
        Map<String, TranslationDto> translations) {
}
