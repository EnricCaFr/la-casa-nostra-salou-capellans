package com.girasol.restaurant.dto;

import com.girasol.restaurant.entity.ReservationStatus;
import jakarta.validation.constraints.NotNull;

public record ReservationStatusRequest(@NotNull ReservationStatus status) {
}
