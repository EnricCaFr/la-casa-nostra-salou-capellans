insert into allergen_tags (code, name, icon, type) values
('CACAHUETES', 'Cacahuetes', '🥜', 'ALLERGEN'),
('SOJA', 'Soja', '🫘', 'ALLERGEN'),
('APIO', 'Apio', '🥬', 'ALLERGEN'),
('MOSTAZA', 'Mostaza', '🌭', 'ALLERGEN'),
('SESAMO', 'Sesamo', '⚪', 'ALLERGEN'),
('SULFITOS', 'Sulfitos', '🍷', 'ALLERGEN'),
('ALTRAMUCES', 'Altramuces', '🫘', 'ALLERGEN')
on conflict (code) do nothing;
