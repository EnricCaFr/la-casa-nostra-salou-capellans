package com.girasol.restaurant.service.translation;

public interface TranslationProvider {
    String translate(String text, String sourceLanguage, String targetLanguage);
}
