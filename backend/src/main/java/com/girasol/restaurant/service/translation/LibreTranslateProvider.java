package com.girasol.restaurant.service.translation;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@ConditionalOnProperty(name = "translation.provider", havingValue = "libretranslate")
public class LibreTranslateProvider implements TranslationProvider {
    private final RestClient restClient;
    private final String apiKey;

    public LibreTranslateProvider(
            @Value("${translation.libretranslate.url:https://libretranslate.com}") String baseUrl,
            @Value("${translation.api-key:}") String apiKey) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    @Override
    @SuppressWarnings("unchecked")
    public String translate(String text, String sourceLanguage, String targetLanguage) {
        Map<String, Object> body = Map.of(
                "q", text,
                "source", sourceLanguage,
                "target", targetLanguage,
                "format", "text",
                "api_key", apiKey);
        Map<String, Object> response = restClient.post()
                .uri("/translate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
        Object translated = response == null ? null : response.get("translatedText");
        return translated == null ? text : translated.toString();
    }
}
