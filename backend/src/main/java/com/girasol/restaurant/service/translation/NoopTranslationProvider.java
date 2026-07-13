package com.girasol.restaurant.service.translation;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "translation.provider", havingValue = "none", matchIfMissing = true)
public class NoopTranslationProvider implements TranslationProvider {
    @Override
    public String translate(String text, String sourceLanguage, String targetLanguage) {
        return text;
    }
}
