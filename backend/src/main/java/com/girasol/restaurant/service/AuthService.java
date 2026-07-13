package com.girasol.restaurant.service;

import com.girasol.restaurant.dto.LoginRequest;
import com.girasol.restaurant.dto.LoginResponse;
import com.girasol.restaurant.entity.AdminUser;
import com.girasol.restaurant.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        AdminUser user = repository.findByUsernameAndActiveTrue(request.username())
                .orElseThrow(() -> new BadCredentialsException("Usuario o contrasena incorrectos."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Usuario o contrasena incorrectos.");
        }
        return new LoginResponse(jwtService.createToken(user), user.getUsername(), user.getRole());
    }
}
