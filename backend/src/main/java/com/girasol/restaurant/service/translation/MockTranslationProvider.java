package com.girasol.restaurant.service.translation;

import java.util.Locale;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "translation.provider", havingValue = "mock")
public class MockTranslationProvider implements TranslationProvider {
    private static final Map<String, Map<String, String>> EN = Map.ofEntries(
            Map.entry("mesa", Map.of("en", "table", "ca", "taula", "fr", "table", "de", "tisch", "it", "tavolo", "pt", "mesa")),
            Map.entry("plato de prueba con pollo y queso", Map.of("en", "test dish with chicken and cheese", "ca", "plat de prova amb pollastre i formatge", "fr", "plat de test avec poulet et fromage", "de", "testgericht mit huhn und kase", "it", "piatto di prova con pollo e formaggio", "pt", "prato de teste com frango e queijo")),
            Map.entry("pollo", Map.of("en", "chicken", "ca", "pollastre", "fr", "poulet", "de", "huhn", "it", "pollo", "pt", "frango")),
            Map.entry("queso", Map.of("en", "cheese", "ca", "formatge", "fr", "fromage", "de", "kase", "it", "formaggio", "pt", "queijo")),
            Map.entry("pescado", Map.of("en", "fish", "ca", "peix", "fr", "poisson", "de", "fisch", "it", "pesce", "pt", "peixe")),
            Map.entry("carne", Map.of("en", "meat", "ca", "carn", "fr", "viande", "de", "fleisch", "it", "carne", "pt", "carne"))
    );

    @Override
    public String translate(String text, String sourceLanguage, String targetLanguage) {
        if (text == null || text.isBlank()) return text;
        String normalized = text.trim().toLowerCase(Locale.ROOT);
        String exact = EN.getOrDefault(normalized, Map.of()).get(targetLanguage);
        if (exact != null) return preserveFirstUppercase(text, exact);

        String translated = text;
        for (Map.Entry<String, Map<String, String>> entry : EN.entrySet()) {
            String replacement = entry.getValue().get(targetLanguage);
            if (replacement != null) {
                translated = translated.replaceAll("(?i)\\b" + java.util.regex.Pattern.quote(entry.getKey()) + "\\b", replacement);
            }
        }
        return translated;
    }

    private String preserveFirstUppercase(String source, String translated) {
        if (source.isEmpty() || translated.isEmpty() || !Character.isUpperCase(source.charAt(0))) return translated;
        return Character.toUpperCase(translated.charAt(0)) + translated.substring(1);
    }
}
