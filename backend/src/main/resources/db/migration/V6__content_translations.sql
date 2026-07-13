create table content_translations (
    id bigserial primary key,
    entity_type varchar(40) not null,
    entity_id bigint not null,
    field_name varchar(60) not null,
    language varchar(10) not null,
    translated_text text not null,
    source_text_hash varchar(64) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    constraint uk_content_translation unique (entity_type, entity_id, field_name, language)
);

create index idx_content_translations_lookup
    on content_translations(entity_type, entity_id, field_name, language);
