package com.girasol.restaurant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationRequestDto(
        @NotBlank String name,
        @NotBlank String phone,
        @Email String email,
        @NotNull @FutureOrPresent LocalDate date,
        @NotNull LocalTime time,
        @NotNull @Min(1) Integer people,
        String message) {
}
