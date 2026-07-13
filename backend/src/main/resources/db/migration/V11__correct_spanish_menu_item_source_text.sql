update menu_items m
set
    name = name_translation.translated_text,
    description = description_translation.translated_text
from content_translations name_translation
join content_translations description_translation
    on description_translation.entity_type = name_translation.entity_type
    and description_translation.entity_id = name_translation.entity_id
    and description_translation.language = name_translation.language
    and description_translation.field_name = 'description'
where name_translation.entity_type = 'MENU_ITEM'
  and name_translation.field_name = 'name'
  and name_translation.language = 'es'
  and name_translation.source_text_hash = 'manual-menu-v10'
  and description_translation.source_text_hash = 'manual-menu-v10'
  and m.id = name_translation.entity_id;
