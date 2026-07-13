package com.girasol.restaurant.dto;

public record RestaurantInfoDto(
        Long id,
        String name,
        String claim,
        String description,
        String address,
        String phone,
        String email,
        String whatsapp,
        String openingHours,
        String instagramUrl,
        String googleMapsUrl) {
}
