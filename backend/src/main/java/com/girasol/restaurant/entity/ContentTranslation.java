package com.girasol.restaurant.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "content_translations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_content_translation",
                columnNames = {"entity_type", "entity_id", "field_name", "language"}))
public class ContentTranslation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false, length = 40)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "field_name", nullable = false, length = 60)
    private String fieldName;

    @Column(nullable = false, length = 10)
    private String language;

    @Column(name = "translated_text", nullable = false, columnDefinition = "text")
    private String translatedText;

    @Column(name = "source_text_hash", nullable = false, length = 64)
    private String sourceTextHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}
