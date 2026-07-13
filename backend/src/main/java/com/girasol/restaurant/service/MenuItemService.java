package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.MenuItemDto;
import com.girasol.restaurant.dto.MenuItemRequest;
import com.girasol.restaurant.dto.CategoryDto;
import com.girasol.restaurant.entity.AllergenTag;
import com.girasol.restaurant.entity.Category;
import com.girasol.restaurant.entity.MediaAsset;
import com.girasol.restaurant.entity.MenuItem;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.mapper.RestaurantMapper;
import com.girasol.restaurant.repository.AllergenTagRepository;
import com.girasol.restaurant.repository.MediaAssetRepository;
import com.girasol.restaurant.repository.MenuItemRepository;
import jakarta.persistence.criteria.JoinType;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MenuItemService {
    private final MenuItemRepository repository;
    private final AllergenTagRepository tagRepository;
    private final MediaAssetRepository mediaAssetRepository;
    private final CategoryService categoryService;
    private final RestaurantMapper mapper;
    private final TranslationService translationService;

    @Transactional(readOnly = true)
    public List<MenuItemDto> findAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> {
                    int c = a.getCategory().getDisplayOrder().compareTo(b.getCategory().getDisplayOrder());
                    if (c != 0) return c;
                    return a.getDisplayOrder().compareTo(b.getDisplayOrder());
                })
                .map(item -> withTranslations(mapper.toDto(item)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> search(String category, String search, Set<String> tags) {
        Specification<MenuItem> spec = Specification.where((root, query, cb) -> {
            root.fetch("category", JoinType.LEFT);
            root.fetch("tags", JoinType.LEFT);
            query.distinct(true);
            return cb.and(
                    cb.isTrue(root.get("active")),
                    cb.isTrue(root.get("category").get("active")));
        });
        if (category != null && !category.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("slug"), category));
        }
        if (search != null && !search.isBlank()) {
            String term = "%" + search.toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), term),
                    cb.like(cb.lower(root.get("description")), term),
                    cb.like(cb.lower(root.get("category").get("name")), term),
                    cb.like(cb.lower(root.join("tags", JoinType.LEFT).get("name")), term)));
        }
        if (tags != null && !tags.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.join("tags", JoinType.INNER).get("code").in(tags));
        }
        return repository.findAll(spec).stream()
                .sorted((a, b) -> {
                    int c = a.getCategory().getDisplayOrder().compareTo(b.getCategory().getDisplayOrder());
                    if (c != 0) return c;
                    return a.getDisplayOrder().compareTo(b.getDisplayOrder());
                })
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> search(String category, String search, Set<String> tags, String language) {
        return searchEntities(category, search, tags).stream()
                .map(item -> translate(mapper.toDto(item), language))
                .toList();
    }

    @Transactional(readOnly = true)
    public MenuItemDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    @Transactional(readOnly = true)
    public MenuItemDto findById(Long id, String language) {
        return translate(mapper.toDto(getEntity(id)), language);
    }

    @Transactional(readOnly = true)
    public MenuItemDto findBySlug(String slug) {
        return mapper.toDto(repository.findBySlugAndActiveTrueAndCategory_ActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Plato no encontrado: " + slug)));
    }

    @Transactional(readOnly = true)
    public MenuItemDto findBySlug(String slug, String language) {
        return translate(mapper.toDto(repository.findBySlugAndActiveTrueAndCategory_ActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Plato no encontrado: " + slug))), language);
    }

    @Transactional
    public MenuItemDto create(MenuItemRequest request) {
        translationService.validateRequiredTranslations(request.translations(), true);
        MenuItem item = new MenuItem();
        apply(item, request);
        MenuItem saved = repository.save(item);
        translationService.saveTranslations("MENU_ITEM", saved.getId(), request.translations(), true);
        return withTranslations(mapper.toDto(saved));
    }

    @Transactional
    public MenuItemDto update(Long id, MenuItemRequest request) {
        translationService.validateRequiredTranslations(request.translations(), true);
        MenuItem item = getEntity(id);
        apply(item, request);
        MenuItem saved = repository.save(item);
        translationService.saveTranslations("MENU_ITEM", saved.getId(), request.translations(), true);
        return withTranslations(mapper.toDto(saved));
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    private MenuItem getEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Plato no encontrado: " + id));
    }

    private List<MenuItem> searchEntities(String category, String search, Set<String> tags) {
        Specification<MenuItem> spec = Specification.where((root, query, cb) -> {
            root.fetch("category", JoinType.LEFT);
            root.fetch("tags", JoinType.LEFT);
            query.distinct(true);
            return cb.and(
                    cb.isTrue(root.get("active")),
                    cb.isTrue(root.get("category").get("active")));
        });
        if (category != null && !category.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("slug"), category));
        }
        if (search != null && !search.isBlank()) {
            String term = "%" + search.toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), term),
                    cb.like(cb.lower(root.get("description")), term),
                    cb.like(cb.lower(root.get("category").get("name")), term),
                    cb.like(cb.lower(root.join("tags", JoinType.LEFT).get("name")), term)));
        }
        if (tags != null && !tags.isEmpty()) {
            spec = spec.and((root, query, cb) -> root.join("tags", JoinType.INNER).get("code").in(tags));
        }
        return repository.findAll(spec).stream()
                .sorted((a, b) -> {
                    int c = a.getCategory().getDisplayOrder().compareTo(b.getCategory().getDisplayOrder());
                    if (c != 0) return c;
                    return a.getDisplayOrder().compareTo(b.getDisplayOrder());
                })
                .toList();
    }

    private void apply(MenuItem item, MenuItemRequest request) {
        var primary = translationService.primaryTranslation(request.translations());
        Category category = categoryService.getEntity(request.categoryId());
        Set<String> codes = request.tagCodes() == null ? Set.of() : request.tagCodes();
        List<AllergenTag> tags = tagRepository.findByCodeIn(codes);
        if (tags.size() != codes.size()) {
            throw new IllegalArgumentException("Uno o mas tags no existen.");
        }
        item.setName(primary.name());
        item.setSlug(request.slug() == null || request.slug().isBlank() ? mapper.slugify(primary.name()) : mapper.slugify(request.slug()));
        item.setDescription(primary.description());
        item.setPrice(request.price());
        if (request.imageAssetId() != null) {
            MediaAsset asset = mediaAssetRepository.findById(request.imageAssetId())
                    .orElseThrow(() -> new NotFoundException("Imagen no encontrada: " + request.imageAssetId()));
            item.setImageAsset(asset);
            item.setImageUrl(asset.getUrl());
        } else {
            item.setImageAsset(null);
            item.setImageUrl(request.imageUrl() == null || request.imageUrl().isBlank() ? null : request.imageUrl());
        }
        item.setHighlighted(Boolean.TRUE.equals(request.highlighted()));
        item.setActive(request.active() == null || request.active());
        item.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        item.setCategory(category);
        item.setTags(new LinkedHashSet<>(tags));
    }

    private MenuItemDto translate(MenuItemDto item, String language) {
        CategoryDto category = item.category();
        CategoryDto translatedCategoryDto = new CategoryDto(
                category.id(),
                translationService.translate("CATEGORY", category.id(), "name", category.name(), language),
                category.slug(),
                translationService.translate("CATEGORY", category.id(), "description", category.description(), language),
                category.displayOrder(),
                category.active());

        return new MenuItemDto(
                item.id(),
                translationService.translate("MENU_ITEM", item.id(), "name", item.name(), language),
                item.slug(),
                translationService.translate("MENU_ITEM", item.id(), "description", item.description(), language),
                item.price(),
                item.imageUrl(),
                item.imageAssetId(),
                item.highlighted(),
                item.active(),
                item.displayOrder(),
                translatedCategoryDto,
                item.tags().stream()
                        .map(tag -> new com.girasol.restaurant.dto.AllergenTagDto(
                                tag.id(),
                                tag.code(),
                                translationService.translate("TAG", tag.id(), "name", tag.name(), language),
                                tag.icon(),
                                tag.type()))
                        .toList());
    }

    private MenuItemDto withTranslations(MenuItemDto item) {
        return new MenuItemDto(
                item.id(),
                item.name(),
                item.slug(),
                item.description(),
                item.price(),
                item.imageUrl(),
                item.imageAssetId(),
                item.highlighted(),
                item.active(),
                item.displayOrder(),
                item.category(),
                item.tags(),
                translationService.findTranslations("MENU_ITEM", item.id()));
    }
}
