create table media_assets (
    id bigserial primary key,
    file_name varchar(255) not null unique,
    original_file_name varchar(255) not null,
    content_type varchar(120) not null,
    size bigint not null,
    url text not null unique,
    created_at timestamp not null default now()
);

alter table menu_items add column image_asset_id bigint references media_assets(id);

insert into media_assets (file_name, original_file_name, content_type, size, url) values
('dish-placeholder-entrante.jpg', 'Entrante local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-entrante.jpg'),
('dish-placeholder-pizza.jpg', 'Pizza local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-pizza.jpg'),
('dish-placeholder-pasta.jpg', 'Pasta local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-pasta.jpg'),
('dish-placeholder-pescado.jpg', 'Pescado local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-pescado.jpg'),
('dish-placeholder-carne.jpg', 'Carne local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-carne.jpg'),
('dish-placeholder-ensalada.jpg', 'Ensalada local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-ensalada.jpg'),
('dish-placeholder-arroz.jpg', 'Arroz local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-arroz.jpg'),
('dish-placeholder-general.jpg', 'Plato local de ejemplo', 'image/jpeg', 1, '/uploads/dishes/dish-placeholder-general.jpg')
on conflict (url) do nothing;

update menu_items mi
set image_url = case c.slug
    when 'pizzas-artesanales' then '/uploads/dishes/dish-placeholder-pizza.jpg'
    when 'calzones-y-pinsas-artesanales' then '/uploads/dishes/dish-placeholder-pizza.jpg'
    when 'pasta' then '/uploads/dishes/dish-placeholder-pasta.jpg'
    when 'pescado' then '/uploads/dishes/dish-placeholder-pescado.jpg'
    when 'carnes-a-la-brasa' then '/uploads/dishes/dish-placeholder-carne.jpg'
    when 'hamburguesas' then '/uploads/dishes/dish-placeholder-carne.jpg'
    when 'ensaladas' then '/uploads/dishes/dish-placeholder-ensalada.jpg'
    when 'arroces-y-risottos' then '/uploads/dishes/dish-placeholder-arroz.jpg'
    else '/uploads/dishes/dish-placeholder-entrante.jpg'
end
from categories c
where mi.category_id = c.id
  and (mi.image_url is null or mi.image_url like 'http%');

update menu_items mi
set image_asset_id = ma.id
from media_assets ma
where mi.image_url = ma.url;
