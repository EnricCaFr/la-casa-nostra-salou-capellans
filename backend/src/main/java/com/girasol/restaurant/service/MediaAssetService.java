package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.MediaAssetDto;
import com.girasol.restaurant.entity.MediaAsset;
import com.girasol.restaurant.entity.MenuItem;
import com.girasol.restaurant.exception.ImageInUseException;
import com.girasol.restaurant.exception.NotFoundException;
import com.girasol.restaurant.repository.MediaAssetRepository;
import com.girasol.restaurant.repository.MenuItemRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MediaAssetService {
    private static final long MAX_IMAGE_SIZE = 5L * 1024L * 1024L;
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final MediaAssetRepository repository;
    private final MenuItemRepository menuItemRepository;

    @Value("${app.upload-dir:uploads/dishes}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public List<MediaAssetDto> findAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public MediaAssetDto upload(MultipartFile file) {
        validate(file);
        String original = cleanOriginalName(file.getOriginalFilename());
        String extension = extensionFor(file.getContentType(), original);
        String baseName = slugify(original.replaceFirst("\\.[^.]+$", ""));
        String fileName = baseName + "-" + UUID.randomUUID() + extension;
        Path folder = Path.of(uploadDir).toAbsolutePath().normalize();
        Path target = folder.resolve(fileName).normalize();

        if (!target.startsWith(folder)) {
            throw new IllegalArgumentException("Nombre de archivo no valido.");
        }

        try {
            Files.createDirectories(folder);
            file.transferTo(target);
        } catch (IOException ex) {
            throw new IllegalArgumentException("No se pudo subir la imagen.");
        }

        MediaAsset asset = new MediaAsset();
        asset.setFileName(fileName);
        asset.setOriginalFileName(original);
        asset.setContentType(file.getContentType());
        asset.setSize(file.getSize());
        asset.setUrl("/uploads/dishes/" + fileName);
        return toDto(repository.save(asset));
    }

    @Transactional
    public void delete(Long id) {
        MediaAsset asset = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Imagen no encontrada: " + id));
        Set<String> usedBy = new LinkedHashSet<>();
        menuItemRepository.findByImageAsset_Id(asset.getId()).stream().map(MenuItem::getName).forEach(usedBy::add);
        menuItemRepository.findByImageUrl(asset.getUrl()).stream().map(MenuItem::getName).forEach(usedBy::add);
        if (!usedBy.isEmpty()) {
            throw new ImageInUseException(usedBy.stream().sorted().toList());
        }

        try {
            Files.deleteIfExists(Path.of(uploadDir).toAbsolutePath().normalize().resolve(asset.getFileName()).normalize());
        } catch (IOException ex) {
            throw new IllegalArgumentException("No se pudo borrar el archivo de la imagen.");
        }
        repository.delete(asset);
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen para subir.");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("La imagen no puede superar 5 MB.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Formato no permitido. Usa JPG, JPEG, PNG o WEBP.");
        }
    }

    private String extensionFor(String contentType, String original) {
        String lower = original.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
        if (lower.endsWith(".png")) return ".png";
        if (lower.endsWith(".webp")) return ".webp";
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    private String cleanOriginalName(String original) {
        String value = original == null || original.isBlank() ? "imagen" : Path.of(original).getFileName().toString();
        return value.replaceAll("[\\\\/:*?\"<>|]", "-");
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "imagen" : normalized;
    }

    private MediaAssetDto toDto(MediaAsset asset) {
        return new MediaAssetDto(asset.getId(), asset.getFileName(), asset.getOriginalFileName(),
                asset.getContentType(), asset.getSize(), asset.getUrl(), asset.getCreatedAt());
    }
}
