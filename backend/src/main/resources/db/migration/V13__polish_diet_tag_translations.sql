update allergen_tags
set name = case code
  when 'CARNE' then 'Carne'
  when 'CERDO' then 'Cerdo'
  when 'POLLO' then 'Pollo'
  when 'HALAL' then 'Halal'
  when 'VEGETARIANO' then 'Vegetariano'
  else name
end
where code in ('CARNE', 'CERDO', 'POLLO', 'HALAL', 'VEGETARIANO');

with tag_names(code, lang, translated_name) as (
  values
    ('CARNE', 'es', 'Carne'),
    ('CARNE', 'ca', 'Carn'),
    ('CARNE', 'en', 'Meat'),
    ('CARNE', 'fr', 'Viande'),
    ('CARNE', 'de', 'Fleisch'),
    ('CARNE', 'it', 'Carne'),
    ('CARNE', 'pt', 'Carne'),
    ('CARNE', 'nl', 'Vlees'),
    ('CARNE', 'ru', 'Мясо'),

    ('CERDO', 'es', 'Cerdo'),
    ('CERDO', 'ca', 'Porc'),
    ('CERDO', 'en', 'Pork'),
    ('CERDO', 'fr', 'Porc'),
    ('CERDO', 'de', 'Schwein'),
    ('CERDO', 'it', 'Maiale'),
    ('CERDO', 'pt', 'Porco'),
    ('CERDO', 'nl', 'Varken'),
    ('CERDO', 'ru', 'Свинина'),

    ('POLLO', 'es', 'Pollo'),
    ('POLLO', 'ca', 'Pollastre'),
    ('POLLO', 'en', 'Chicken'),
    ('POLLO', 'fr', 'Poulet'),
    ('POLLO', 'de', 'Hähnchen'),
    ('POLLO', 'it', 'Pollo'),
    ('POLLO', 'pt', 'Frango'),
    ('POLLO', 'nl', 'Kip'),
    ('POLLO', 'ru', 'Курица'),

    ('HALAL', 'es', 'Halal'),
    ('HALAL', 'ca', 'Halal'),
    ('HALAL', 'en', 'Halal'),
    ('HALAL', 'fr', 'Halal'),
    ('HALAL', 'de', 'Halal'),
    ('HALAL', 'it', 'Halal'),
    ('HALAL', 'pt', 'Halal'),
    ('HALAL', 'nl', 'Halal'),
    ('HALAL', 'ru', 'Халяль'),

    ('VEGETARIANO', 'es', 'Vegetariano'),
    ('VEGETARIANO', 'ca', 'Vegetarià'),
    ('VEGETARIANO', 'en', 'Vegetarian'),
    ('VEGETARIANO', 'fr', 'Végétarien'),
    ('VEGETARIANO', 'de', 'Vegetarisch'),
    ('VEGETARIANO', 'it', 'Vegetariano'),
    ('VEGETARIANO', 'pt', 'Vegetariano'),
    ('VEGETARIANO', 'nl', 'Vegetarisch'),
    ('VEGETARIANO', 'ru', 'Вегетарианское')
)
insert into content_translations (entity_type, entity_id, language, field_name, translated_text, source_text_hash)
select 'TAG', t.id, tag_names.lang, 'name', tag_names.translated_name, 'manual-diet-tags-polish'
from tag_names
join allergen_tags t on t.code = tag_names.code
on conflict (entity_type, entity_id, language, field_name)
do update set
  translated_text = excluded.translated_text,
  source_text_hash = excluded.source_text_hash,
  updated_at = now();
