insert into allergen_tags (code, name, icon, type) values
('GLUTEN', 'Cereales con gluten', '🌾', 'ALLERGEN'),
('CRUSTACEOS', 'Crustáceos', '🦐', 'ALLERGEN'),
('HUEVOS', 'Huevos', '🥚', 'ALLERGEN'),
('PESCADO', 'Pescado', '🐟', 'ALLERGEN'),
('CACAHUETES', 'Cacahuetes', '🥜', 'ALLERGEN'),
('SOJA', 'Soja', '🌱', 'ALLERGEN'),
('LECHE', 'Leche', '🥛', 'ALLERGEN'),
('FRUTOS_CASCARA', 'Frutos de cáscara', '🌰', 'ALLERGEN'),
('APIO', 'Apio', '🥬', 'ALLERGEN'),
('MOSTAZA', 'Mostaza', '🌭', 'ALLERGEN'),
('SESAMO', 'Sésamo', '⚪', 'ALLERGEN'),
('SULFITOS', 'Sulfitos', '🍷', 'ALLERGEN'),
('ALTRAMUCES', 'Altramuces', '🫘', 'ALLERGEN'),
('MOLUSCOS', 'Moluscos', '🦑', 'ALLERGEN')
on conflict (code) do update set
    name = excluded.name,
    icon = excluded.icon,
    type = excluded.type;

with aliases(old_code, new_code) as (
    values
        ('MARISCO', 'CRUSTACEOS'),
        ('FRUTOS_SECOS', 'FRUTOS_CASCARA'),
        ('HUEVO', 'HUEVOS'),
        ('LACTEOS', 'LECHE')
),
pairs as (
    select old_tag.id as old_id, new_tag.id as new_id
    from aliases
    join allergen_tags old_tag on old_tag.code = aliases.old_code
    join allergen_tags new_tag on new_tag.code = aliases.new_code
    where old_tag.id <> new_tag.id
)
insert into menu_item_tags (menu_item_id, tag_id)
select mit.menu_item_id, pairs.new_id
from menu_item_tags mit
join pairs on pairs.old_id = mit.tag_id
on conflict do nothing;

with aliases(old_code, new_code) as (
    values
        ('MARISCO', 'CRUSTACEOS'),
        ('FRUTOS_SECOS', 'FRUTOS_CASCARA'),
        ('HUEVO', 'HUEVOS'),
        ('LACTEOS', 'LECHE')
),
pairs as (
    select old_tag.id as old_id
    from aliases
    join allergen_tags old_tag on old_tag.code = aliases.old_code
    join allergen_tags new_tag on new_tag.code = aliases.new_code
    where old_tag.id <> new_tag.id
)
delete from menu_item_tags mit
using pairs
where mit.tag_id = pairs.old_id;

with aliases(old_code, new_code) as (
    values
        ('MARISCO', 'CRUSTACEOS'),
        ('FRUTOS_SECOS', 'FRUTOS_CASCARA'),
        ('HUEVO', 'HUEVOS'),
        ('LACTEOS', 'LECHE')
),
pairs as (
    select old_tag.id as old_id
    from aliases
    join allergen_tags old_tag on old_tag.code = aliases.old_code
    join allergen_tags new_tag on new_tag.code = aliases.new_code
    where old_tag.id <> new_tag.id
)
delete from content_translations ct
using pairs
where ct.entity_type = 'TAG'
  and ct.entity_id = pairs.old_id;

with aliases(old_code, new_code) as (
    values
        ('MARISCO', 'CRUSTACEOS'),
        ('FRUTOS_SECOS', 'FRUTOS_CASCARA'),
        ('HUEVO', 'HUEVOS'),
        ('LACTEOS', 'LECHE')
)
delete from allergen_tags old_tag
using aliases, allergen_tags new_tag
where old_tag.code = aliases.old_code
  and new_tag.code = aliases.new_code
  and old_tag.id <> new_tag.id;

with test_tags as (
    select id
    from allergen_tags
    where lower(code) in ('qwe', 'wqwe')
       or lower(name) in ('qwe', 'wqwe')
)
delete from menu_item_tags mit
using test_tags
where mit.tag_id = test_tags.id;

with test_tags as (
    select id
    from allergen_tags
    where lower(code) in ('qwe', 'wqwe')
       or lower(name) in ('qwe', 'wqwe')
)
delete from content_translations ct
using test_tags
where ct.entity_type = 'TAG'
  and ct.entity_id = test_tags.id;

delete from allergen_tags
where lower(code) in ('qwe', 'wqwe')
   or lower(name) in ('qwe', 'wqwe');

with translations(code, language, name, description) as (
    values
    ('GLUTEN', 'es', 'Cereales con gluten', 'Cereales con gluten: trigo, centeno, cebada, avena, espelta y kamut.'),
    ('GLUTEN', 'ca', 'Cereals amb gluten', 'Cereals amb gluten: blat, sègol, ordi, civada, espelta i kamut.'),
    ('GLUTEN', 'en', 'Cereals containing gluten', 'Cereals containing gluten: wheat, rye, barley, oats, spelt and kamut.'),
    ('GLUTEN', 'fr', 'Céréales contenant du gluten', 'Céréales contenant du gluten : blé, seigle, orge, avoine, épeautre et kamut.'),
    ('GLUTEN', 'de', 'Glutenhaltiges Getreide', 'Glutenhaltiges Getreide: Weizen, Roggen, Gerste, Hafer, Dinkel und Kamut.'),
    ('GLUTEN', 'it', 'Cereali con glutine', 'Cereali con glutine: grano, segale, orzo, avena, farro e kamut.'),
    ('GLUTEN', 'pt', 'Cereais com glúten', 'Cereais com glúten: trigo, centeio, cevada, aveia, espelta e kamut.'),
    ('GLUTEN', 'nl', 'Glutenbevattende granen', 'Glutenbevattende granen: tarwe, rogge, gerst, haver, spelt en kamut.'),
    ('GLUTEN', 'ru', 'Злаки с глютеном', 'Злаки с глютеном: пшеница, рожь, ячмень, овес, спельта и камут.'),

    ('CRUSTACEOS', 'es', 'Crustáceos', 'Gambas, langostinos, cangrejos y otros crustáceos.'),
    ('CRUSTACEOS', 'ca', 'Crustacis', 'Gambes, llagostins, crancs i altres crustacis.'),
    ('CRUSTACEOS', 'en', 'Crustaceans', 'Prawns, shrimps, crabs and other crustaceans.'),
    ('CRUSTACEOS', 'fr', 'Crustacés', 'Crevettes, langoustines, crabes et autres crustacés.'),
    ('CRUSTACEOS', 'de', 'Krebstiere', 'Garnelen, Langusten, Krabben und andere Krebstiere.'),
    ('CRUSTACEOS', 'it', 'Crostacei', 'Gamberi, scampi, granchi e altri crostacei.'),
    ('CRUSTACEOS', 'pt', 'Crustáceos', 'Gambas, camarões, caranguejos e outros crustáceos.'),
    ('CRUSTACEOS', 'nl', 'Schaaldieren', 'Garnalen, langoustines, krabben en andere schaaldieren.'),
    ('CRUSTACEOS', 'ru', 'Ракообразные', 'Креветки, лангусты, крабы и другие ракообразные.'),

    ('HUEVOS', 'es', 'Huevos', 'Huevos y ovoproductos.'),
    ('HUEVOS', 'ca', 'Ous', 'Ous i ovoproductes.'),
    ('HUEVOS', 'en', 'Eggs', 'Eggs and egg products.'),
    ('HUEVOS', 'fr', 'Œufs', 'Œufs et ovoproduits.'),
    ('HUEVOS', 'de', 'Eier', 'Eier und Eierzeugnisse.'),
    ('HUEVOS', 'it', 'Uova', 'Uova e ovoprodotti.'),
    ('HUEVOS', 'pt', 'Ovos', 'Ovos e ovoprodutos.'),
    ('HUEVOS', 'nl', 'Eieren', 'Eieren en eiproducten.'),
    ('HUEVOS', 'ru', 'Яйца', 'Яйца и яичные продукты.'),

    ('PESCADO', 'es', 'Pescado', 'Pescado.'),
    ('PESCADO', 'ca', 'Peix', 'Peix.'),
    ('PESCADO', 'en', 'Fish', 'Fish.'),
    ('PESCADO', 'fr', 'Poisson', 'Poisson.'),
    ('PESCADO', 'de', 'Fisch', 'Fisch.'),
    ('PESCADO', 'it', 'Pesce', 'Pesce.'),
    ('PESCADO', 'pt', 'Peixe', 'Peixe.'),
    ('PESCADO', 'nl', 'Vis', 'Vis.'),
    ('PESCADO', 'ru', 'Рыба', 'Рыба.'),

    ('CACAHUETES', 'es', 'Cacahuetes', 'Cacahuetes y productos derivados.'),
    ('CACAHUETES', 'ca', 'Cacauets', 'Cacauets i productes derivats.'),
    ('CACAHUETES', 'en', 'Peanuts', 'Peanuts and derived products.'),
    ('CACAHUETES', 'fr', 'Arachides', 'Arachides et produits dérivés.'),
    ('CACAHUETES', 'de', 'Erdnüsse', 'Erdnüsse und daraus hergestellte Erzeugnisse.'),
    ('CACAHUETES', 'it', 'Arachidi', 'Arachidi e prodotti derivati.'),
    ('CACAHUETES', 'pt', 'Amendoins', 'Amendoins e produtos derivados.'),
    ('CACAHUETES', 'nl', 'Pinda’s', 'Pinda’s en daarvan afgeleide producten.'),
    ('CACAHUETES', 'ru', 'Арахис', 'Арахис и продукты из него.'),

    ('SOJA', 'es', 'Soja', 'Soja y derivados.'),
    ('SOJA', 'ca', 'Soja', 'Soja i derivats.'),
    ('SOJA', 'en', 'Soy', 'Soy and derived products.'),
    ('SOJA', 'fr', 'Soja', 'Soja et produits dérivés.'),
    ('SOJA', 'de', 'Soja', 'Soja und daraus hergestellte Erzeugnisse.'),
    ('SOJA', 'it', 'Soia', 'Soia e derivati.'),
    ('SOJA', 'pt', 'Soja', 'Soja e derivados.'),
    ('SOJA', 'nl', 'Soja', 'Soja en daarvan afgeleide producten.'),
    ('SOJA', 'ru', 'Соя', 'Соя и продукты из нее.'),

    ('LECHE', 'es', 'Leche', 'Leche y derivados, incluida la lactosa.'),
    ('LECHE', 'ca', 'Llet', 'Llet i derivats, inclosa la lactosa.'),
    ('LECHE', 'en', 'Milk', 'Milk and derived products, including lactose.'),
    ('LECHE', 'fr', 'Lait', 'Lait et produits dérivés, y compris le lactose.'),
    ('LECHE', 'de', 'Milch', 'Milch und Milcherzeugnisse, einschließlich Laktose.'),
    ('LECHE', 'it', 'Latte', 'Latte e derivati, incluso il lattosio.'),
    ('LECHE', 'pt', 'Leite', 'Leite e derivados, incluindo lactose.'),
    ('LECHE', 'nl', 'Melk', 'Melk en melkproducten, inclusief lactose.'),
    ('LECHE', 'ru', 'Молоко', 'Молоко и молочные продукты, включая лактозу.'),

    ('FRUTOS_CASCARA', 'es', 'Frutos de cáscara', 'Almendras, avellanas, nueces, anacardos, pistachos y otros frutos de cáscara.'),
    ('FRUTOS_CASCARA', 'ca', 'Fruits de closca', 'Ametlles, avellanes, nous, anacards, festucs i altres fruits de closca.'),
    ('FRUTOS_CASCARA', 'en', 'Tree nuts', 'Almonds, hazelnuts, walnuts, cashews, pistachios and other tree nuts.'),
    ('FRUTOS_CASCARA', 'fr', 'Fruits à coque', 'Amandes, noisettes, noix, noix de cajou, pistaches et autres fruits à coque.'),
    ('FRUTOS_CASCARA', 'de', 'Schalenfrüchte', 'Mandeln, Haselnüsse, Walnüsse, Cashewkerne, Pistazien und andere Schalenfrüchte.'),
    ('FRUTOS_CASCARA', 'it', 'Frutta a guscio', 'Mandorle, nocciole, noci, anacardi, pistacchi e altra frutta a guscio.'),
    ('FRUTOS_CASCARA', 'pt', 'Frutos de casca rija', 'Amêndoas, avelãs, nozes, cajus, pistácios e outros frutos de casca rija.'),
    ('FRUTOS_CASCARA', 'nl', 'Noten', 'Amandelen, hazelnoten, walnoten, cashewnoten, pistachenoten en andere noten.'),
    ('FRUTOS_CASCARA', 'ru', 'Орехи', 'Миндаль, фундук, грецкие орехи, кешью, фисташки и другие орехи.'),

    ('APIO', 'es', 'Apio', 'Apio y derivados.'),
    ('APIO', 'ca', 'Api', 'Api i derivats.'),
    ('APIO', 'en', 'Celery', 'Celery and derived products.'),
    ('APIO', 'fr', 'Céleri', 'Céleri et produits dérivés.'),
    ('APIO', 'de', 'Sellerie', 'Sellerie und daraus hergestellte Erzeugnisse.'),
    ('APIO', 'it', 'Sedano', 'Sedano e derivati.'),
    ('APIO', 'pt', 'Aipo', 'Aipo e derivados.'),
    ('APIO', 'nl', 'Selderij', 'Selderij en daarvan afgeleide producten.'),
    ('APIO', 'ru', 'Сельдерей', 'Сельдерей и продукты из него.'),

    ('MOSTAZA', 'es', 'Mostaza', 'Mostaza y derivados.'),
    ('MOSTAZA', 'ca', 'Mostassa', 'Mostassa i derivats.'),
    ('MOSTAZA', 'en', 'Mustard', 'Mustard and derived products.'),
    ('MOSTAZA', 'fr', 'Moutarde', 'Moutarde et produits dérivés.'),
    ('MOSTAZA', 'de', 'Senf', 'Senf und daraus hergestellte Erzeugnisse.'),
    ('MOSTAZA', 'it', 'Senape', 'Senape e derivati.'),
    ('MOSTAZA', 'pt', 'Mostarda', 'Mostarda e derivados.'),
    ('MOSTAZA', 'nl', 'Mosterd', 'Mosterd en daarvan afgeleide producten.'),
    ('MOSTAZA', 'ru', 'Горчица', 'Горчица и продукты из нее.'),

    ('SESAMO', 'es', 'Sésamo', 'Granos de sésamo y productos a base de sésamo.'),
    ('SESAMO', 'ca', 'Sèsam', 'Llavors de sèsam i productes a base de sèsam.'),
    ('SESAMO', 'en', 'Sesame', 'Sesame seeds and sesame-based products.'),
    ('SESAMO', 'fr', 'Sésame', 'Graines de sésame et produits à base de sésame.'),
    ('SESAMO', 'de', 'Sesam', 'Sesamsamen und Erzeugnisse auf Sesambasis.'),
    ('SESAMO', 'it', 'Sesamo', 'Semi di sesamo e prodotti a base di sesamo.'),
    ('SESAMO', 'pt', 'Sésamo', 'Sementes de sésamo e produtos à base de sésamo.'),
    ('SESAMO', 'nl', 'Sesam', 'Sesamzaad en producten op basis van sesam.'),
    ('SESAMO', 'ru', 'Кунжут', 'Семена кунжута и продукты на основе кунжута.'),

    ('SULFITOS', 'es', 'Sulfitos', 'Dióxido de azufre y sulfitos, presentes en vinos, mariscos y conservas.'),
    ('SULFITOS', 'ca', 'Sulfits', 'Diòxid de sofre i sulfits, presents en vins, marisc i conserves.'),
    ('SULFITOS', 'en', 'Sulphites', 'Sulphur dioxide and sulphites, found in wines, seafood and preserves.'),
    ('SULFITOS', 'fr', 'Sulfites', 'Dioxyde de soufre et sulfites, présents dans les vins, fruits de mer et conserves.'),
    ('SULFITOS', 'de', 'Sulfite', 'Schwefeldioxid und Sulfite, enthalten in Wein, Meeresfrüchten und Konserven.'),
    ('SULFITOS', 'it', 'Solfiti', 'Anidride solforosa e solfiti, presenti in vini, frutti di mare e conserve.'),
    ('SULFITOS', 'pt', 'Sulfitos', 'Dióxido de enxofre e sulfitos, presentes em vinhos, marisco e conservas.'),
    ('SULFITOS', 'nl', 'Sulfieten', 'Zwaveldioxide en sulfieten, aanwezig in wijn, zeevruchten en conserven.'),
    ('SULFITOS', 'ru', 'Сульфиты', 'Диоксид серы и сульфиты, встречаются в винах, морепродуктах и консервах.'),

    ('ALTRAMUCES', 'es', 'Altramuces', 'Altramuces y productos a base de altramuces.'),
    ('ALTRAMUCES', 'ca', 'Tramussos', 'Tramussos i productes a base de tramussos.'),
    ('ALTRAMUCES', 'en', 'Lupin', 'Lupin and lupin-based products.'),
    ('ALTRAMUCES', 'fr', 'Lupin', 'Lupin et produits à base de lupin.'),
    ('ALTRAMUCES', 'de', 'Lupinen', 'Lupinen und Erzeugnisse auf Lupinenbasis.'),
    ('ALTRAMUCES', 'it', 'Lupini', 'Lupini e prodotti a base di lupini.'),
    ('ALTRAMUCES', 'pt', 'Tremoços', 'Tremoços e produtos à base de tremoços.'),
    ('ALTRAMUCES', 'nl', 'Lupine', 'Lupine en producten op basis van lupine.'),
    ('ALTRAMUCES', 'ru', 'Люпин', 'Люпин и продукты на его основе.'),

    ('MOLUSCOS', 'es', 'Moluscos', 'Moluscos y derivados: mejillones, almejas, calamares y similares.'),
    ('MOLUSCOS', 'ca', 'Mol·luscs', 'Mol·luscs i derivats: musclos, cloïsses, calamars i similars.'),
    ('MOLUSCOS', 'en', 'Molluscs', 'Molluscs and derived products: mussels, clams, squid and similar.'),
    ('MOLUSCOS', 'fr', 'Mollusques', 'Mollusques et produits dérivés : moules, palourdes, calamars et similaires.'),
    ('MOLUSCOS', 'de', 'Weichtiere', 'Weichtiere und daraus hergestellte Erzeugnisse: Muscheln, Venusmuscheln, Tintenfisch und ähnliche.'),
    ('MOLUSCOS', 'it', 'Molluschi', 'Molluschi e derivati: cozze, vongole, calamari e simili.'),
    ('MOLUSCOS', 'pt', 'Moluscos', 'Moluscos e derivados: mexilhões, amêijoas, lulas e similares.'),
    ('MOLUSCOS', 'nl', 'Weekdieren', 'Weekdieren en afgeleide producten: mosselen, kokkels, inktvis en dergelijke.'),
    ('MOLUSCOS', 'ru', 'Моллюски', 'Моллюски и продукты из них: мидии, моллюски, кальмары и похожие продукты.')
)
insert into content_translations (entity_type, entity_id, field_name, language, translated_text, source_text_hash)
select 'TAG', t.id, field_name, translations.language, field_value, 'manual-official-allergens'
from translations
join allergen_tags t on t.code = translations.code
cross join lateral (
    values
        ('name', translations.name),
        ('description', translations.description)
) fields(field_name, field_value)
on conflict (entity_type, entity_id, field_name, language) do update set
    translated_text = excluded.translated_text,
    source_text_hash = excluded.source_text_hash,
    updated_at = now();
