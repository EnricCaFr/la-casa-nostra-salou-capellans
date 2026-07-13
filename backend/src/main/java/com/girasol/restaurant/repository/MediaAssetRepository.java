package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.MediaAsset;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    Optional<MediaAsset> findByUrl(String url);
}
