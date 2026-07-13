package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.AllergenTagDto;
import com.girasol.restaurant.dto.AllergenTagRequest;
import com.girasol.restaurant.entity.AllergenTag;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.mapper.RestaurantMapper;
import com.girasol.restaurant.repository.AllergenTagRepository;
import com.girasol.restaurant.repository.MenuItemRepository;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AllergenTagService {
    private final AllergenTagRepository repository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantMapper mapper;
    private final TranslationService translationService;

    @Transactional(readOnly = true)
    public List<AllergenTagDto> findAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(AllergenTag::getType).thenComparing(AllergenTag::getName))
                .map(tag -> withTranslations(mapper.toDto(tag)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AllergenTagDto> findAll(String language) {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(AllergenTag::getType).thenComparing(AllergenTag::getName))
                .map(tag -> translate(mapper.toDto(tag), language))
                .toList();
    }

    @Transactional
    public AllergenTagDto create(AllergenTagRequest request) {
        translationService.validateRequiredTranslations(request.translations(), false);
        AllergenTag tag = new AllergenTag();
        apply(tag, request);
        AllergenTag saved = repository.save(tag);
        translationService.saveTranslations("TAG", saved.getId(), request.translations(), false);
        return withTranslations(mapper.toDto(saved));
    }

    @Transactional
    public AllergenTagDto update(Long id, AllergenTagRequest request) {
        AllergenTag tag = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag no encontrado: " + id));
        translationService.validateRequiredTranslations(request.translations(), false);
        apply(tag, request);
        AllergenTag saved = repository.save(tag);
        translationService.saveTranslations("TAG", saved.getId(), request.translations(), false);
        return withTranslations(mapper.toDto(saved));
    }

    @Transactional
    public void delete(Long id) {
        AllergenTag tag = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag no encontrado: " + id));
        long itemCount = menuItemRepository.countByTags_Id(id);
        if (itemCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar este tag porque esta siendo usado por " + itemCount + " plato(s).");
        }
        repository.delete(tag);
    }

    private void apply(AllergenTag tag, AllergenTagRequest request) {
        String primaryName = translationService.primaryTranslation(request.translations()).name();
        String code = normalizeCode(request.code() == null || request.code().isBlank() ? primaryName : request.code());
        repository.findByCode(code)
                .filter(existing -> !existing.getId().equals(tag.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Ya existe un tag con ese codigo.");
                });
        tag.setCode(code);
        tag.setName(primaryName.trim());
        tag.setIcon(request.icon().trim());
        tag.setType(normalizeType(request.type()));
    }

    private String normalizeCode(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]+", "_")
                .replaceAll("(^_|_$)", "");
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("El nombre del tag no es valido.");
        }
        return normalized;
    }

    private String normalizeType(String value) {
        String type = value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
        if (!type.equals("ALLERGEN") && !type.equals("DIET")) {
            throw new IllegalArgumentException("El tipo debe ser ALLERGEN o DIET.");
        }
        return type;
    }

    private AllergenTagDto translate(AllergenTagDto tag, String language) {
        return new AllergenTagDto(
                tag.id(),
                tag.code(),
                translationService.translate("TAG", tag.id(), "name", tag.name(), language),
                tag.icon(),
                tag.type());
    }

    private AllergenTagDto withTranslations(AllergenTagDto tag) {
        return new AllergenTagDto(tag.id(), tag.code(), tag.name(), tag.icon(), tag.type(),
                translationService.findTranslations("TAG", tag.id()));
    }
}
