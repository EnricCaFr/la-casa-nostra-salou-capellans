package com.girasol.restaurant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record MenuItemDto(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        Long imageAssetId,
        Boolean highlighted,
        Boolean active,
        Integer displayOrder,
        CategoryDto category,
        List<AllergenTagDto> tags,
        Map<String, TranslationDto> translations) {
    public MenuItemDto(
            Long id,
            String name,
            String slug,
            String description,
            BigDecimal price,
            String imageUrl,
            Long imageAssetId,
            Boolean highlighted,
            Boolean active,
            Integer displayOrder,
            CategoryDto category,
            List<AllergenTagDto> tags) {
        this(id, name, slug, description, price, imageUrl, imageAssetId, highlighted, active, displayOrder, category, tags, Map.of());
    }
}
