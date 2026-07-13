package com.girasol.restaurant.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI restaurantOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Restaurante Girasol API")
                        .version("1.0.0")
                        .description("API REST para carta digital, reservas y administracion."));
    }
}
