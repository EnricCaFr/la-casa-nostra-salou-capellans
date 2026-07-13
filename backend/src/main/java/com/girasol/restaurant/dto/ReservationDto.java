package com.girasol.restaurant.dto;

import com.girasol.restaurant.entity.ReservationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationDto(
        Long id,
        String name,
        String phone,
        String email,
        LocalDate date,
        LocalTime time,
        Integer people,
        String message,
        ReservationStatus status,
        LocalDateTime createdAt) {
}
