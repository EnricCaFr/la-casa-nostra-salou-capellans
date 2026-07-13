package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.CategoryDto;
import com.girasol.restaurant.dto.CategoryRequest;
import com.girasol.restaurant.entity.Category;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.mapper.RestaurantMapper;
import com.girasol.restaurant.repository.CategoryRepository;
import com.girasol.restaurant.repository.MenuItemRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantMapper mapper;
    private final TranslationService translationService;

    public List<CategoryDto> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Category::getDisplayOrder).thenComparing(Category::getName))
                .map(category -> withTranslations(mapper.toDto(category)))
                .toList();
    }

    public List<CategoryDto> findActive() {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(Category::getDisplayOrder).thenComparing(Category::getName))
                .map(mapper::toDto)
                .toList();
    }

    public List<CategoryDto> findActive(String language) {
        return repository.findByActiveTrue().stream()
                .sorted(Comparator.comparing(Category::getDisplayOrder).thenComparing(Category::getName))
                .map(category -> translate(mapper.toDto(category), language))
                .toList();
    }

    public Category getEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Categoria no encontrada: " + id));
    }

    public CategoryDto create(CategoryRequest request) {
        translationService.validateRequiredTranslations(request.translations(), false);
        Category category = new Category();
        apply(category, request);
        Category saved = repository.save(category);
        translationService.saveTranslations("CATEGORY", saved.getId(), request.translations(), true);
        return withTranslations(mapper.toDto(saved));
    }

    public CategoryDto update(Long id, CategoryRequest request) {
        translationService.validateRequiredTranslations(request.translations(), false);
        Category category = getEntity(id);
        apply(category, request);
        Category saved = repository.save(category);
        translationService.saveTranslations("CATEGORY", saved.getId(), request.translations(), true);
        return withTranslations(mapper.toDto(saved));
    }

    public void delete(Long id) {
        long itemCount = menuItemRepository.countByCategoryId(id);
        if (itemCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar una categoria que tiene platos. Desactivala o mueve/elimina esos platos primero.");
        }
        repository.delete(getEntity(id));
    }

    private void apply(Category category, CategoryRequest request) {
        var primary = translationService.primaryTranslation(request.translations());
        category.setName(primary.name());
        category.setSlug(request.slug() == null || request.slug().isBlank() ? mapper.slugify(primary.name()) : mapper.slugify(request.slug()));
        category.setDescription(primary.description());
        category.setDisplayOrder(request.displayOrder());
        category.setActive(request.active());
    }

    private CategoryDto translate(CategoryDto category, String language) {
        return new CategoryDto(
                category.id(),
                translationService.translate("CATEGORY", category.id(), "name", category.name(), language),
                category.slug(),
                translationService.translate("CATEGORY", category.id(), "description", category.description(), language),
                category.displayOrder(),
                category.active());
    }

    private CategoryDto withTranslations(CategoryDto category) {
        return new CategoryDto(category.id(), category.name(), category.slug(), category.description(),
                category.displayOrder(), category.active(), translationService.findTranslations("CATEGORY", category.id()));
    }
}
