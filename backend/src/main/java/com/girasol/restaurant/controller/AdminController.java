package com.girasol.restaurant.controller;

import com.girasol.restaurant.dto.*;
import com.girasol.restaurant.service.AllergenTagService;
import com.girasol.restaurant.service.CategoryService;
import com.girasol.restaurant.service.MenuItemService;
import com.girasol.restaurant.service.ReservationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final CategoryService categoryService;
    private final AllergenTagService allergenTagService;
    private final MenuItemService menuItemService;
    private final ReservationService reservationService;

    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return categoryService.findAll();
    }

    @PostMapping("/categories")
    public CategoryDto createCategory(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryDto updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }

    @GetMapping("/tags")
    public List<AllergenTagDto> tags() {
        return allergenTagService.findAll();
    }

    @PostMapping("/tags")
    public AllergenTagDto createTag(@Valid @RequestBody AllergenTagRequest request) {
        return allergenTagService.create(request);
    }

    @PutMapping("/tags/{id}")
    public AllergenTagDto updateTag(@PathVariable Long id, @Valid @RequestBody AllergenTagRequest request) {
        return allergenTagService.update(id, request);
    }

    @DeleteMapping("/tags/{id}")
    public void deleteTag(@PathVariable Long id) {
        allergenTagService.delete(id);
    }

    @GetMapping("/menu-items")
    public List<MenuItemDto> menuItems() {
        return menuItemService.findAll();
    }

    @PostMapping("/menu-items")
    public MenuItemDto createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        return menuItemService.create(request);
    }

    @PutMapping("/menu-items/{id}")
    public MenuItemDto updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        return menuItemService.update(id, request);
    }

    @DeleteMapping("/menu-items/{id}")
    public void deleteMenuItem(@PathVariable Long id) {
        menuItemService.delete(id);
    }

    @GetMapping("/reservations")
    public List<ReservationDto> reservations() {
        return reservationService.findAll();
    }

    @PutMapping("/reservations/{id}/status")
    public ReservationDto updateReservationStatus(@PathVariable Long id, @Valid @RequestBody ReservationStatusRequest request) {
        return reservationService.updateStatus(id, request.status());
    }
}
