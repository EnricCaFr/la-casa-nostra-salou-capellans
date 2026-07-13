package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.MenuItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long>, JpaSpecificationExecutor<MenuItem> {
    Optional<MenuItem> findBySlug(String slug);
    Optional<MenuItem> findBySlugAndActiveTrueAndCategory_ActiveTrue(String slug);
    long countByCategoryId(Long categoryId);
    boolean existsByImageUrl(String imageUrl);
    List<MenuItem> findByImageUrl(String imageUrl);
    List<MenuItem> findByImageAsset_Id(Long imageAssetId);
    long countByTags_Id(Long tagId);
}
