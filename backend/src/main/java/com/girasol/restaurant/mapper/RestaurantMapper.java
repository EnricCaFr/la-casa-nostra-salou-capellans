package com.girasol.restaurant.mapper;

import com.girasol.restaurant.dto.*;
import com.girasol.restaurant.entity.*;
import java.text.Normalizer;
import java.util.Comparator;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {
    public CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getSlug(), category.getDescription(),
                category.getDisplayOrder(), category.getActive());
    }

    public AllergenTagDto toDto(AllergenTag tag) {
        return new AllergenTagDto(tag.getId(), tag.getCode(), tag.getName(), tag.getIcon(), tag.getType());
    }

    public MenuItemDto toDto(MenuItem item) {
        return new MenuItemDto(
                item.getId(),
                item.getName(),
                item.getSlug(),
                item.getDescription(),
                item.getPrice(),
                item.getImageUrl(),
                item.getImageAsset() == null ? null : item.getImageAsset().getId(),
                item.getHighlighted(),
                item.getActive(),
                item.getDisplayOrder(),
                toDto(item.getCategory()),
                item.getTags().stream().map(this::toDto).sorted(Comparator.comparing(AllergenTagDto::name)).toList());
    }

    public ReservationDto toDto(ReservationRequest reservation) {
        return new ReservationDto(reservation.getId(), reservation.getName(), reservation.getPhone(),
                reservation.getEmail(), reservation.getDate(), reservation.getTime(), reservation.getPeople(),
                reservation.getMessage(), reservation.getStatus(), reservation.getCreatedAt());
    }

    public RestaurantInfoDto toDto(RestaurantInfo info) {
        return new RestaurantInfoDto(info.getId(), info.getName(), info.getClaim(), info.getDescription(),
                info.getAddress(), info.getPhone(), info.getEmail(), info.getWhatsapp(), info.getOpeningHours(),
                info.getInstagramUrl(), info.getGoogleMapsUrl());
    }

    public String slugify(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "item" : normalized;
    }
}
