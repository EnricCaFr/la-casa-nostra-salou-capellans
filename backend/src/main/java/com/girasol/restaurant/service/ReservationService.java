package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.ReservationDto;
import com.girasol.restaurant.dto.ReservationRequestDto;
import com.girasol.restaurant.entity.ReservationRequest;
import com.girasol.restaurant.entity.ReservationStatus;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.mapper.RestaurantMapper;
import com.girasol.restaurant.repository.ReservationRequestRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRequestRepository repository;
    private final RestaurantMapper mapper;

    public ReservationDto create(ReservationRequestDto request) {
        ReservationRequest reservation = new ReservationRequest();
        reservation.setName(request.name());
        reservation.setPhone(request.phone());
        reservation.setEmail(request.email());
        reservation.setDate(request.date());
        reservation.setTime(request.time());
        reservation.setPeople(request.people());
        reservation.setMessage(request.message());
        return mapper.toDto(repository.save(reservation));
    }

    public List<ReservationDto> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(ReservationRequest::getCreatedAt).reversed())
                .map(mapper::toDto)
                .toList();
    }

    public ReservationDto updateStatus(Long id, ReservationStatus status) {
        ReservationRequest reservation = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Solicitud no encontrada: " + id));
        reservation.setStatus(status);
        return mapper.toDto(repository.save(reservation));
    }
}
