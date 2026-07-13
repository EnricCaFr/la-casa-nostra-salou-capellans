package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.AllergenTag;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllergenTagRepository extends JpaRepository<AllergenTag, Long> {
    List<AllergenTag> findByCodeIn(Collection<String> codes);
    Optional<AllergenTag> findByCode(String code);
    boolean existsByCode(String code);
}
