package com.girasol.restaurant.service;

import com.girasol.restaurant.entity.ContentTranslation;
import com.girasol.restaurant.dto.TranslationDto;
import com.girasol.restaurant.repository.ContentTranslationRepository;
import com.girasol.restaurant.service.translation.TranslationProvider;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TranslationService {
    private static final String SOURCE_LANGUAGE = "es";
    private static final Set<String> SUPPORTED_LANGUAGES = Set.of("es", "ca", "en", "fr", "de", "it", "pt", "nl", "ru");

    private final ContentTranslationRepository repository;
    private final TranslationProvider provider;

    @Value("${translation.enabled:true}")
    private boolean enabled;

    public String normalizeLanguage(String language) {
        if (language == null || language.isBlank()) return SOURCE_LANGUAGE;
        String normalized = language.toLowerCase(Locale.ROOT).split("[-_]")[0];
        return SUPPORTED_LANGUAGES.contains(normalized) ? normalized : SOURCE_LANGUAGE;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized String translate(String entityType, Long entityId, String fieldName, String sourceText, String language) {
        String lang = normalizeLanguage(language);
        if (sourceText == null || sourceText.isBlank() || SOURCE_LANGUAGE.equals(lang) || !enabled) return sourceText;

        return repository.findByEntityTypeAndEntityIdAndFieldNameAndLanguage(entityType, entityId, fieldName, lang)
                .map(ContentTranslation::getTranslatedText)
                .filter(text -> text != null && !text.isBlank())
                .orElse(sourceText);
    }

    public Map<String, TranslationDto> findTranslations(String entityType, Long entityId) {
        Map<String, TranslationDto> translations = new LinkedHashMap<>();
        for (String language : SUPPORTED_LANGUAGES) {
            String name = repository.findByEntityTypeAndEntityIdAndFieldNameAndLanguage(entityType, entityId, "name", language)
                    .map(ContentTranslation::getTranslatedText)
                    .orElse("");
            String description = repository.findByEntityTypeAndEntityIdAndFieldNameAndLanguage(entityType, entityId, "description", language)
                    .map(ContentTranslation::getTranslatedText)
                    .orElse("");
            translations.put(language, new TranslationDto(name, description));
        }
        return translations;
    }

    public void validateRequiredTranslations(Map<String, TranslationDto> translations, boolean requireDescription) {
        for (String language : SUPPORTED_LANGUAGES) {
            TranslationDto translation = translations == null ? null : translations.get(language);
            if (translation == null) {
                throw new IllegalArgumentException("Falta la traduccion en " + languageLabel(language) + ".");
            }
            if (isBlank(translation.name())) {
                throw new IllegalArgumentException("Falta el nombre en " + languageLabel(language) + ".");
            }
            if (requireDescription && isBlank(translation.description())) {
                throw new IllegalArgumentException("Falta la descripcion en " + languageLabel(language) + ".");
            }
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveTranslations(String entityType, Long entityId, Map<String, TranslationDto> translations, boolean saveDescription) {
        for (String language : SUPPORTED_LANGUAGES) {
            TranslationDto translation = translations.get(language);
            saveTranslation(entityType, entityId, "name", translation.name(), language);
            if (saveDescription) saveTranslation(entityType, entityId, "description", translation.description(), language);
        }
    }

    public TranslationDto primaryTranslation(Map<String, TranslationDto> translations) {
        TranslationDto spanish = translations == null ? null : translations.get(SOURCE_LANGUAGE);
        if (spanish != null && !isBlank(spanish.name())) return spanish;
        return translations == null ? new TranslationDto("", "") : translations.values().stream()
                .filter(translation -> !isBlank(translation.name()))
                .findFirst()
                .orElse(new TranslationDto("", ""));
    }

    private void saveTranslation(String entityType, Long entityId, String fieldName, String text, String language) {
        ContentTranslation translation = repository.findByEntityTypeAndEntityIdAndFieldNameAndLanguage(entityType, entityId, fieldName, language)
                .orElseGet(() -> {
                    ContentTranslation created = new ContentTranslation();
                    created.setEntityType(entityType);
                    created.setEntityId(entityId);
                    created.setFieldName(fieldName);
                    created.setLanguage(language);
                    created.setCreatedAt(Instant.now());
                    return created;
                });
        String normalized = text.trim();
        translation.setTranslatedText(normalized);
        translation.setSourceTextHash(hash(normalized));
        translation.setUpdatedAt(Instant.now());
        repository.save(translation);
    }

    private boolean isBlank(String text) {
        return text == null || text.trim().isBlank();
    }

    private String languageLabel(String language) {
        return switch (language) {
            case "es" -> "Español";
            case "ca" -> "Catalán";
            case "en" -> "Inglés";
            case "fr" -> "Francés";
            case "de" -> "Alemán";
            case "it" -> "Italiano";
            case "pt" -> "Portugués";
            case "nl" -> "Neerlandés";
            case "ru" -> "Ruso";
            default -> language;
        };
    }

    private String hash(String sourceText) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(sourceText.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no disponible", exception);
        }
    }
}
