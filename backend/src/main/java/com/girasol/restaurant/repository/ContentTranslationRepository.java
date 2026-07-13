package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.ContentTranslation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentTranslationRepository extends JpaRepository<ContentTranslation, Long> {
    Optional<ContentTranslation> findByEntityTypeAndEntityIdAndFieldNameAndLanguage(
            String entityType,
            Long entityId,
            String fieldName,
            String language);
}
