package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.ReservationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRequestRepository extends JpaRepository<ReservationRequest, Long> {
}
