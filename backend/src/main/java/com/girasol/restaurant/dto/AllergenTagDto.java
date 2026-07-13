package com.girasol.restaurant.dto;

import java.util.Map;

public record AllergenTagDto(Long id, String code, String name, String icon, String type, Map<String, TranslationDto> translations) {
    public AllergenTagDto(Long id, String code, String name, String icon, String type) {
        this(id, code, name, icon, type, Map.of());
    }
}
