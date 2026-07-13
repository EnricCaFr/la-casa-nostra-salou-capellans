package com.girasol.restaurant.controller;

import com.girasol.restaurant.dto.*;
import com.girasol.restaurant.service.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PublicController {
    private final CategoryService categoryService;
    private final AllergenTagService allergenTagService;
    private final MenuItemService menuItemService;
    private final ReservationService reservationService;
    private final RestaurantInfoService restaurantInfoService;

    @GetMapping("/categories")
    public List<CategoryDto> categories(@RequestParam(required = false) String lang) {
        return categoryService.findActive(lang);
    }

    @GetMapping("/tags")
    public List<AllergenTagDto> tags(@RequestParam(required = false) String lang) {
        return allergenTagService.findAll(lang);
    }

    @GetMapping("/menu-items")
    public List<MenuItemDto> menuItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Set<String> tags,
            @RequestParam(required = false) String lang) {
        return menuItemService.search(category, search, tags, lang);
    }

    @GetMapping("/menu-items/{id}")
    public MenuItemDto menuItem(@PathVariable Long id, @RequestParam(required = false) String lang) {
        return menuItemService.findById(id, lang);
    }

    @GetMapping("/menu-items/slug/{slug}")
    public MenuItemDto menuItemBySlug(@PathVariable String slug, @RequestParam(required = false) String lang) {
        return menuItemService.findBySlug(slug, lang);
    }

    @GetMapping("/restaurant-info")
    public RestaurantInfoDto restaurantInfo() {
        return restaurantInfoService.getInfo();
    }

    @PostMapping("/reservations")
    public ReservationDto reserve(@Valid @RequestBody ReservationRequestDto request) {
        return reservationService.create(request);
    }
}
