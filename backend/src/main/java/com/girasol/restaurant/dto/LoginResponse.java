package com.girasol.restaurant.dto;

public record LoginResponse(String token, String username, String role) {
}
