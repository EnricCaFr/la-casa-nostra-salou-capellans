package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.RestaurantInfoDto;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.mapper.RestaurantMapper;
import com.girasol.restaurant.repository.RestaurantInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantInfoService {
    private final RestaurantInfoRepository repository;
    private final RestaurantMapper mapper;

    public RestaurantInfoDto getInfo() {
        return repository.findAll().stream().findFirst().map(mapper::toDto)
                .orElseThrow(() -> new NotFoundException("Informacion del restaurante no configurada."));
    }
}
