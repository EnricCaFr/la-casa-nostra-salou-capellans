package com.girasol.restaurant.dto;

import java.util.Map;

public record CategoryDto(
        Long id,
        String name,
        String slug,
        String description,
        Integer displayOrder,
        Boolean active,
        Map<String, TranslationDto> translations) {
    public CategoryDto(Long id, String name, String slug, String description, Integer displayOrder, Boolean active) {
        this(id, name, slug, description, displayOrder, active, Map.of());
    }
}
