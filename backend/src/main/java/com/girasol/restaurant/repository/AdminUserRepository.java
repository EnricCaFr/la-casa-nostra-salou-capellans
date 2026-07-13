package com.girasol.restaurant.repository;

import com.girasol.restaurant.entity.AdminUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsernameAndActiveTrue(String username);
}
