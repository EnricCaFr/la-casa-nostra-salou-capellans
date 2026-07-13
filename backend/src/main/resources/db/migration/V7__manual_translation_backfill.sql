insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'CATEGORY', c.id, 'name', langs.language, c.name, 'manual'
from categories c
cross join (values ('es'), ('ca'), ('en'), ('fr'), ('de'), ('it'), ('pt'), ('nl'), ('ru')) as langs(language)
on conflict (entity_type, entity_id, field_name, language) do nothing;

insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'CATEGORY', c.id, 'description', langs.language, coalesce(c.description, ''), 'manual'
from categories c
cross join (values ('es'), ('ca'), ('en'), ('fr'), ('de'), ('it'), ('pt'), ('nl'), ('ru')) as langs(language)
on conflict (entity_type, entity_id, field_name, language) do nothing;

insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'TAG', t.id, 'name', langs.language, t.name, 'manual'
from allergen_tags t
cross join (values ('es'), ('ca'), ('en'), ('fr'), ('de'), ('it'), ('pt'), ('nl'), ('ru')) as langs(language)
on conflict (entity_type, entity_id, field_name, language) do nothing;

insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'MENU_ITEM', m.id, 'name', langs.language, m.name, 'manual'
from menu_items m
cross join (values ('es'), ('ca'), ('en'), ('fr'), ('de'), ('it'), ('pt'), ('nl'), ('ru')) as langs(language)
on conflict (entity_type, entity_id, field_name, language) do nothing;

insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'MENU_ITEM', m.id, 'description', langs.language, m.description, 'manual'
from menu_items m
cross join (values ('es'), ('ca'), ('en'), ('fr'), ('de'), ('it'), ('pt'), ('nl'), ('ru')) as langs(language)
on conflict (entity_type, entity_id, field_name, language) do nothing;
