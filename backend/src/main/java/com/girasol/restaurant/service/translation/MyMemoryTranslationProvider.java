package com.girasol.restaurant.service.translation;

import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@ConditionalOnProperty(name = "translation.provider", havingValue = "mymemory")
public class MyMemoryTranslationProvider implements TranslationProvider {
    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.mymemory.translated.net")
            .build();

    @Override
    @SuppressWarnings("unchecked")
    public String translate(String text, String sourceLanguage, String targetLanguage) {
        Map<String, Object> response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/get")
                        .queryParam("q", text)
                        .queryParam("langpair", sourceLanguage + "|" + targetLanguage)
                        .build())
                .retrieve()
                .body(Map.class);
        if (response == null) return text;

        Object responseData = response.get("responseData");
        if (!(responseData instanceof Map<?, ?> data)) return text;

        Object translated = data.get("translatedText");
        return translated == null ? text : translated.toString();
    }
}
