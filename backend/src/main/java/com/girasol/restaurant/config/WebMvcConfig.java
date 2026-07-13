package com.girasol.restaurant.config;

import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Value("${app.upload-dir:uploads/dishes}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String fileLocation = Path.of(uploadDir).toAbsolutePath().normalize().toUri().toString();
        if (!fileLocation.endsWith("/")) {
            fileLocation += "/";
        }
        registry.addResourceHandler("/uploads/dishes/**")
                .addResourceLocations(fileLocation, "classpath:/static/uploads/dishes/");
    }
}
