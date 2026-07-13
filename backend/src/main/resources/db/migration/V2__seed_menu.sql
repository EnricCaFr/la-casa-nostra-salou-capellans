insert into restaurant_info (name, claim, description, address, phone, email, whatsapp, opening_hours, instagram_url, google_maps_url) values
('Restaurante Girasol', 'Cocina mediterranea, italiana y de brasa frente al mar', 'Un restaurante luminoso junto a la playa con carta mediterranea, pizzas artesanales, arroces, pescados frescos y carnes a la brasa.', 'Carrer de Brussel.les, zona Capellans, Salou', '+34 977 00 00 00', 'hola@restaurantegirasol.test', '+34600000000', 'Lunes a domingo: 12:00 - 23:30', 'https://instagram.com/', 'https://maps.google.com/?q=Salou+Capellans');

insert into categories (name, slug, description, display_order, active) values
('Entrantes', 'entrantes', 'Para compartir al centro de la mesa.', 1, true),
('Antipasti', 'antipasti', 'Bocados italianos con producto cuidado.', 2, true),
('Ensaladas', 'ensaladas', 'Frescas, completas y mediterraneas.', 3, true),
('Carnes a la brasa', 'carnes-a-la-brasa', 'Cortes de carne y parrilla.', 4, true),
('Hamburguesas', 'hamburguesas', 'Burgers con patatas y salsas.', 5, true),
('Pescado', 'pescado', 'Pescados y mariscos a la plancha.', 6, true),
('Arroces y risottos', 'arroces-y-risottos', 'Arroces para compartir y risottos cremosos.', 7, true),
('Menu de ninos', 'menu-de-ninos', 'Para menores de 12 anos. Bebida incluida.', 8, true),
('Pizzas artesanales', 'pizzas-artesanales', 'Masa artesanal y horno caliente.', 9, true),
('Calzones y pinsas artesanales', 'calzones-y-pinsas-artesanales', 'Especialidades artesanas al estilo italiano.', 10, true),
('Pasta', 'pasta', 'Base editable de pastas clasicas.', 11, true);

insert into allergen_tags (code, name, icon, type) values
('GLUTEN', 'Gluten', 'ðŸŒ¾', 'ALLERGEN'),
('HUEVO', 'Huevo', 'ðŸ¥š', 'ALLERGEN'),
('LACTEOS', 'Lacteos', 'ðŸ¥›', 'ALLERGEN'),
('PESCADO', 'Pescado', 'ðŸŸ', 'ALLERGEN'),
('MARISCO', 'Marisco / crustaceos', 'ðŸ¦', 'ALLERGEN'),
('MOLUSCOS', 'Moluscos', 'ðŸ¦‘', 'ALLERGEN'),
('FRUTOS_SECOS', 'Frutos secos', 'ðŸ¥œ', 'ALLERGEN'),
('CARNE', 'Carne', 'ðŸ¥©', 'DIET'),
('POLLO', 'Pollo', 'ðŸ—', 'DIET'),
('CERDO', 'Cerdo', 'ðŸ¥“', 'DIET'),
('HALAL', 'Halal', 'â˜ª', 'DIET'),
('VEGETARIANO', 'Vegetariano', 'ðŸ¥¬', 'DIET');

insert into menu_items (name, slug, description, price, image_url, highlighted, active, display_order, category_id) values
('Tiras de pollo', 'tiras-de-pollo', 'Chicken strips', 11.50, '/uploads/dishes/dish-placeholder-entrante.jpg', true, true, 1, (select id from categories where slug='entrantes')),
('Croquetas de pollo o jamon, 6 uds.', 'croquetas-de-pollo-o-jamon-6-uds', 'Croquetas de pollo o jamon', 7.90, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 2, (select id from categories where slug='entrantes')),
('Patatas bravas', 'patatas-bravas', 'Patatas gajo fritas con salsa brava', 8.90, '/uploads/dishes/dish-placeholder-entrante.jpg', true, true, 3, (select id from categories where slug='entrantes')),
('Patatas fritas', 'patatas-fritas', 'French fries', 5.70, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 4, (select id from categories where slug='entrantes')),
('Nachos con queso / carne / guacamole', 'nachos-con-queso-carne-guacamole', 'Nachos con queso, carne o guacamole', 11.50, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 5, (select id from categories where slug='entrantes')),
('Calamar a la Andaluza', 'calamar-a-la-andaluza', 'Calamar frito estilo andaluz', 12.90, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 6, (select id from categories where slug='entrantes')),
('Chipirones fritos', 'chipirones-fritos', 'Chipirones fritos', 12.90, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 7, (select id from categories where slug='entrantes')),
('Mejillones a la marinera', 'mejillones-a-la-marinera', 'Mejillones con salsa de tomate', 12.50, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 8, (select id from categories where slug='entrantes')),
('Tabla de jamon iberico', 'tabla-de-jamon-iberico', 'Jamon iberico', 17.90, '/uploads/dishes/dish-placeholder-entrante.jpg', true, true, 9, (select id from categories where slug='entrantes')),
('Pan de ajo', 'pan-de-ajo', 'Garlic bread', 6.50, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 10, (select id from categories where slug='entrantes')),
('Pan', 'pan', 'Bread', 2.00, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 11, (select id from categories where slug='entrantes')),
('Pan de la casa, 6 uds.', 'pan-de-la-casa-6-uds', 'Pan especial de la casa', 6.75, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 12, (select id from categories where slug='entrantes')),
('Carpaccio de ternera', 'carpaccio-de-ternera', 'Carpaccio de ternera', 16.90, '/uploads/dishes/dish-placeholder-entrante.jpg', true, true, 1, (select id from categories where slug='antipasti')),
('Carpaccio de bacalao', 'carpaccio-de-bacalao', 'Carpaccio de bacalao', 18.50, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 2, (select id from categories where slug='antipasti')),
('Carpaccio de berenjenas', 'carpaccio-de-berenjenas', 'Berenjenas asadas, anchoas, stracciatella, tomate rallado, pistacho y aceite de albahaca', 16.90, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 3, (select id from categories where slug='antipasti')),
('Burrata Girasol', 'burrata-girasol', 'Burrata, oliva negra, tomate confitado, cherry, almendras y picatostes', 13.90, '/uploads/dishes/dish-placeholder-entrante.jpg', true, true, 4, (select id from categories where slug='antipasti')),
('Ensalada Cesar', 'ensalada-cesar', 'Lechuga, tomate, pollo halal, crostones y salsa Cesar', 14.50, '/uploads/dishes/dish-placeholder-ensalada.jpg', false, true, 1, (select id from categories where slug='ensaladas')),
('Ensalada Rulo de Cabra', 'ensalada-rulo-de-cabra', 'Lechuga, queso de cabra, crema balsamica, maiz, frutos secos y tomate', 14.50, '/uploads/dishes/dish-placeholder-ensalada.jpg', false, true, 2, (select id from categories where slug='ensaladas')),
('Ensalada Girasol', 'ensalada-girasol', 'Lechuga, salmon, bacalao, langostinos, picadillo, anchoas y tomate', 15.50, '/uploads/dishes/dish-placeholder-ensalada.jpg', true, true, 3, (select id from categories where slug='ensaladas')),
('Lomo al Pepo', 'lomo-al-pepo', 'Filete de cerdo con salsa Pepo', 16.90, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 1, (select id from categories where slug='carnes-a-la-brasa')),
('Entrecot de ternera', 'entrecot-de-ternera', 'Entrecot de ternera', 22.90, '/uploads/dishes/dish-placeholder-carne.jpg', true, true, 2, (select id from categories where slug='carnes-a-la-brasa')),
('Solomillo de ternera', 'solomillo-de-ternera', 'Sirloin steak', 25.50, '/uploads/dishes/dish-placeholder-carne.jpg', true, true, 3, (select id from categories where slug='carnes-a-la-brasa')),
('Costillas de cerdo', 'costillas-de-cerdo', 'Costillas de cerdo con salsa barbacoa', 17.90, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 4, (select id from categories where slug='carnes-a-la-brasa')),
('Costillas de cordero', 'costillas-de-cordero', 'Rack of lamb', 24.90, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 5, (select id from categories where slug='carnes-a-la-brasa')),
('1/2 pollo al horno', 'medio-pollo-al-horno', 'Medio pollo al horno', 11.90, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 6, (select id from categories where slug='carnes-a-la-brasa')),
('Lasana de carne con verduras', 'lasana-de-carne-con-verduras', 'Lasana de carne y verduras', 15.50, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 7, (select id from categories where slug='carnes-a-la-brasa')),
('Hamburguesa Black Angus', 'hamburguesa-black-angus', 'Pepino, lechuga, tomate, cheddar, cebolla, salsa Emmy y patatas', 16.90, '/uploads/dishes/dish-placeholder-carne.jpg', true, true, 1, (select id from categories where slug='hamburguesas')),
('Hamburguesa de Pollo Crispy', 'hamburguesa-de-pollo-crispy', 'Pepino, lechuga, tomate, cheddar, cebolla, salsa Emmy y patatas', 14.90, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 2, (select id from categories where slug='hamburguesas')),
('Hamburguesa Pulled Pork', 'hamburguesa-pulled-pork', 'Patatas fritas, lechuga, tomate, cebolla, queso cheddar, pepino y salsa Emmy', 14.50, '/uploads/dishes/dish-placeholder-carne.jpg', false, true, 3, (select id from categories where slug='hamburguesas')),
('Salmon a la plancha', 'salmon-a-la-plancha', 'Salmon con guarnicion', 18.70, '/uploads/dishes/dish-placeholder-pescado.jpg', true, true, 1, (select id from categories where slug='pescado')),
('Sepia a la plancha', 'sepia-a-la-plancha', 'Sepia a la plancha', 18.70, '/uploads/dishes/dish-placeholder-pescado.jpg', false, true, 2, (select id from categories where slug='pescado')),
('Dorada a la plancha', 'dorada-a-la-plancha', 'Dorada a la plancha', 18.70, '/uploads/dishes/dish-placeholder-pescado.jpg', false, true, 3, (select id from categories where slug='pescado')),
('Pulpo a la Gallega', 'pulpo-a-la-gallega', 'Pulpo a la gallega', 20.50, '/uploads/dishes/dish-placeholder-pescado.jpg', false, true, 4, (select id from categories where slug='pescado')),
('Pulpo a la brasa con guarnicion', 'pulpo-a-la-brasa-con-guarnicion', 'Pulpo a la brasa con guarnicion', 20.30, '/uploads/dishes/dish-placeholder-pescado.jpg', false, true, 5, (select id from categories where slug='pescado')),
('Gambas a la plancha, 6 uds.', 'gambas-a-la-plancha-6-uds', 'Gambas a la plancha', 18.90, '/uploads/dishes/dish-placeholder-pescado.jpg', true, true, 6, (select id from categories where slug='pescado')),
('Paella marinera / arroz negro, 2 personas', 'paella-marinera-arroz-negro-2-personas', 'Paella marinera o arroz negro para 2 personas', 38.00, '/uploads/dishes/dish-placeholder-arroz.jpg', true, true, 1, (select id from categories where slug='arroces-y-risottos')),
('Paella marinera / arroz negro, 3 personas', 'paella-marinera-arroz-negro-3-personas', 'Paella marinera o arroz negro para 3 personas', 57.00, '/uploads/dishes/dish-placeholder-arroz.jpg', false, true, 2, (select id from categories where slug='arroces-y-risottos')),
('Paella marinera / arroz negro, 4 personas', 'paella-marinera-arroz-negro-4-personas', 'Paella marinera o arroz negro para 4 personas', 76.00, '/uploads/dishes/dish-placeholder-arroz.jpg', false, true, 3, (select id from categories where slug='arroces-y-risottos')),
('Risotto Carbonara', 'risotto-carbonara', 'Nata, panceta, parmesano, huevo y cebolla', 15.90, '/uploads/dishes/dish-placeholder-arroz.jpg', false, true, 4, (select id from categories where slug='arroces-y-risottos')),
('Risotto di Funghi Porcini', 'risotto-di-funghi-porcini', 'Champinones, setas porcini, cebolla y ajo', 15.90, '/uploads/dishes/dish-placeholder-arroz.jpg', false, true, 5, (select id from categories where slug='arroces-y-risottos')),
('Risotto al Tartufo', 'risotto-al-tartufo', 'Champinones, trufa, aceite de oliva, aceitunas y huevo frito', 15.90, '/uploads/dishes/dish-placeholder-arroz.jpg', false, true, 6, (select id from categories where slug='arroces-y-risottos')),
('Nuggets de pollo con patatas', 'nuggets-de-pollo-con-patatas', 'Nuggets de pollo con patatas fritas', 12.95, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 1, (select id from categories where slug='menu-de-ninos')),
('Macarrones bolonesa', 'macarrones-bolonesa', 'Macarrones con salsa bolonesa', 12.95, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 2, (select id from categories where slug='menu-de-ninos')),
('Mini pizza con mozzarella y jamon', 'mini-pizza-con-mozzarella-y-jamon', 'Mini pizza con mozzarella y jamon', 12.95, '/uploads/dishes/dish-placeholder-entrante.jpg', false, true, 3, (select id from categories where slug='menu-de-ninos')),
('Margarita', 'margarita', 'Tomate y mozzarella', 12.50, '/uploads/dishes/dish-placeholder-pizza.jpg', true, true, 1, (select id from categories where slug='pizzas-artesanales')),
('Garda', 'garda', 'Tomate, mozzarella, jamon dulce y champinones', 13.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 2, (select id from categories where slug='pizzas-artesanales')),
('Prosciutto', 'prosciutto', 'Tomate, mozzarella y jamon dulce', 13.80, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 3, (select id from categories where slug='pizzas-artesanales')),
('Pizza Girasol', 'pizza-girasol', 'Pesto, mozzarella, cebolla, pimiento asado, espinacas, bacon y champinones', 15.90, '/uploads/dishes/dish-placeholder-pizza.jpg', true, true, 4, (select id from categories where slug='pizzas-artesanales')),
('Cuatro Stagioni', 'cuatro-stagioni', 'Tomate, mozzarella, champinones, gambas, pimiento asado y jamon dulce', 14.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 5, (select id from categories where slug='pizzas-artesanales')),
('Cuatro Quesos', 'cuatro-quesos', 'Tomate, mozzarella, gorgonzola, parmesano y emmental', 15.50, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 6, (select id from categories where slug='pizzas-artesanales')),
('Pizza di Mare', 'pizza-di-mare', 'Tomate, mozzarella, langostinos, gambas peladas y anchoas', 16.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 7, (select id from categories where slug='pizzas-artesanales')),
('Pizza Iberica', 'pizza-iberica', 'Tomate, parmesano, olivas, tomate natural y jamon iberico', 17.50, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 8, (select id from categories where slug='pizzas-artesanales')),
('Pepperoni', 'pepperoni', 'Tomate, mozzarella, pepperoni y huevo', 14.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 9, (select id from categories where slug='pizzas-artesanales')),
('Pizza Barbacoa', 'pizza-barbacoa', 'Tomate, mozzarella, pollo BBQ y pimiento asado', 15.50, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 10, (select id from categories where slug='pizzas-artesanales')),
('La Favonia', 'la-favonia', 'Tomate, mozzarella, berenjena, virutas de parmesano y miel', 14.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 11, (select id from categories where slug='pizzas-artesanales')),
('La Fantastica', 'la-fantastica', 'Tomate, mozzarella, jamon, bacon, cebolla, parmesano y miel', 14.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 12, (select id from categories where slug='pizzas-artesanales')),
('Tono', 'tono', 'Tomate, mozzarella, atun y cebolla', 13.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 13, (select id from categories where slug='pizzas-artesanales')),
('Calzone Tradicional', 'calzone-tradicional', 'Pesto, mozzarella, parmesano, emmental y champinones', 16.00, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 1, (select id from categories where slug='calzones-y-pinsas-artesanales')),
('Calzone Francesa', 'calzone-francesa', 'Tomate, mozzarella, jamon, cebolla y huevo cocido', 15.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 2, (select id from categories where slug='calzones-y-pinsas-artesanales')),
('Pinsa Calabria', 'pinsa-calabria', 'Calabresa, mozzarella, patatas y parmesano', 16.30, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 3, (select id from categories where slug='calzones-y-pinsas-artesanales')),
('Pinsa Toscana', 'pinsa-toscana', 'Bacon, trufa y mozzarella', 16.90, '/uploads/dishes/dish-placeholder-pizza.jpg', false, true, 4, (select id from categories where slug='calzones-y-pinsas-artesanales')),
('Pasta bolonesa', 'pasta-bolonesa', 'Pasta con salsa de tomate y carne picada', 11.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 1, (select id from categories where slug='pasta')),
('Pasta carbonara', 'pasta-carbonara', 'Pasta con nata, bacon y huevo', 12.90, '/uploads/dishes/dish-placeholder-pasta.jpg', true, true, 2, (select id from categories where slug='pasta')),
('Pasta al pesto', 'pasta-al-pesto', 'Pasta con albahaca, parmesano, ajo y frutos secos', 9.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 3, (select id from categories where slug='pasta')),
('Pasta crema de boletus y setas', 'pasta-crema-de-boletus-y-setas', 'Pasta con salsa cremosa de boletus y setas', 13.50, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 4, (select id from categories where slug='pasta')),
('Pasta esparragos y gambas', 'pasta-esparragos-y-gambas', 'Pasta con esparragos y gambas', 14.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 5, (select id from categories where slug='pasta')),
('Pasta arrabiata', 'pasta-arrabiata', 'Pasta con salsa de tomate picante', 13.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 6, (select id from categories where slug='pasta')),
('Pasta cuatro quesos', 'pasta-cuatro-quesos', 'Pasta con salsa de cuatro quesos', 14.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 7, (select id from categories where slug='pasta')),
('Pasta marinera', 'pasta-marinera', 'Pasta con marisco y pescado', 15.90, '/uploads/dishes/dish-placeholder-pasta.jpg', false, true, 8, (select id from categories where slug='pasta'));

insert into menu_item_tags (menu_item_id, tag_id)
select mi.id, at.id from menu_items mi
join lateral unnest(case mi.slug
    when 'tiras-de-pollo' then array['POLLO','GLUTEN','HALAL']
    when 'croquetas-de-pollo-o-jamon-6-uds' then array['GLUTEN','LACTEOS','HUEVO','POLLO','CARNE']
    when 'patatas-bravas' then array['GLUTEN']
    when 'patatas-fritas' then array['VEGETARIANO']
    when 'nachos-con-queso-carne-guacamole' then array['GLUTEN','LACTEOS','CARNE']
    when 'calamar-a-la-andaluza' then array['GLUTEN','MOLUSCOS']
    when 'chipirones-fritos' then array['GLUTEN','MOLUSCOS']
    when 'mejillones-a-la-marinera' then array['MOLUSCOS']
    when 'tabla-de-jamon-iberico' then array['CERDO']
    when 'pan-de-ajo' then array['GLUTEN','LACTEOS']
    when 'pan' then array['GLUTEN']
    when 'pan-de-la-casa-6-uds' then array['GLUTEN']
    when 'carpaccio-de-ternera' then array['CARNE']
    when 'carpaccio-de-bacalao' then array['PESCADO']
    when 'carpaccio-de-berenjenas' then array['PESCADO','LACTEOS','FRUTOS_SECOS']
    when 'burrata-girasol' then array['LACTEOS','FRUTOS_SECOS','GLUTEN','VEGETARIANO']
    when 'ensalada-cesar' then array['POLLO','HALAL','GLUTEN','HUEVO','LACTEOS']
    when 'ensalada-rulo-de-cabra' then array['LACTEOS','FRUTOS_SECOS','VEGETARIANO']
    when 'ensalada-girasol' then array['PESCADO','MARISCO']
    when 'lomo-al-pepo' then array['CERDO','CARNE']
    when 'entrecot-de-ternera' then array['CARNE']
    when 'solomillo-de-ternera' then array['CARNE']
    when 'costillas-de-cerdo' then array['CERDO','CARNE']
    when 'costillas-de-cordero' then array['CARNE']
    when 'medio-pollo-al-horno' then array['POLLO']
    when 'lasana-de-carne-con-verduras' then array['GLUTEN','LACTEOS','CARNE']
    when 'hamburguesa-black-angus' then array['CARNE','GLUTEN','LACTEOS']
    when 'hamburguesa-de-pollo-crispy' then array['POLLO','GLUTEN','LACTEOS']
    when 'hamburguesa-pulled-pork' then array['CERDO','GLUTEN','LACTEOS']
    when 'salmon-a-la-plancha' then array['PESCADO']
    when 'sepia-a-la-plancha' then array['MOLUSCOS']
    when 'dorada-a-la-plancha' then array['PESCADO']
    when 'pulpo-a-la-gallega' then array['MOLUSCOS']
    when 'pulpo-a-la-brasa-con-guarnicion' then array['MOLUSCOS']
    when 'gambas-a-la-plancha-6-uds' then array['MARISCO']
    when 'paella-marinera-arroz-negro-2-personas' then array['PESCADO','MARISCO','MOLUSCOS']
    when 'paella-marinera-arroz-negro-3-personas' then array['PESCADO','MARISCO','MOLUSCOS']
    when 'paella-marinera-arroz-negro-4-personas' then array['PESCADO','MARISCO','MOLUSCOS']
    when 'risotto-carbonara' then array['LACTEOS','HUEVO','CERDO']
    when 'risotto-di-funghi-porcini' then array['VEGETARIANO']
    when 'risotto-al-tartufo' then array['HUEVO','VEGETARIANO']
    when 'nuggets-de-pollo-con-patatas' then array['POLLO','GLUTEN']
    when 'macarrones-bolonesa' then array['GLUTEN','CARNE']
    when 'mini-pizza-con-mozzarella-y-jamon' then array['GLUTEN','LACTEOS','CERDO']
    when 'margarita' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'garda' then array['GLUTEN','LACTEOS','CERDO']
    when 'prosciutto' then array['GLUTEN','LACTEOS','CERDO']
    when 'pizza-girasol' then array['GLUTEN','LACTEOS','CERDO']
    when 'cuatro-stagioni' then array['GLUTEN','LACTEOS','MARISCO','CERDO']
    when 'cuatro-quesos' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'pizza-di-mare' then array['GLUTEN','LACTEOS','PESCADO','MARISCO']
    when 'pizza-iberica' then array['GLUTEN','LACTEOS','CERDO']
    when 'pepperoni' then array['GLUTEN','LACTEOS','HUEVO','CARNE']
    when 'pizza-barbacoa' then array['GLUTEN','LACTEOS','POLLO']
    when 'la-favonia' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'la-fantastica' then array['GLUTEN','LACTEOS','CERDO']
    when 'tono' then array['GLUTEN','LACTEOS','PESCADO']
    when 'calzone-tradicional' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'calzone-francesa' then array['GLUTEN','LACTEOS','HUEVO','CERDO']
    when 'pinsa-calabria' then array['GLUTEN','LACTEOS','CARNE','CERDO']
    when 'pinsa-toscana' then array['GLUTEN','LACTEOS','CERDO']
    when 'pasta-bolonesa' then array['GLUTEN','CARNE']
    when 'pasta-carbonara' then array['GLUTEN','LACTEOS','HUEVO','CERDO']
    when 'pasta-al-pesto' then array['GLUTEN','LACTEOS','FRUTOS_SECOS','VEGETARIANO']
    when 'pasta-crema-de-boletus-y-setas' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'pasta-esparragos-y-gambas' then array['GLUTEN','MARISCO']
    when 'pasta-arrabiata' then array['GLUTEN','VEGETARIANO']
    when 'pasta-cuatro-quesos' then array['GLUTEN','LACTEOS','VEGETARIANO']
    when 'pasta-marinera' then array['GLUTEN','PESCADO','MARISCO','MOLUSCOS']
    else array[]::text[]
end) codes(code) on true
join allergen_tags at on at.code = codes.code;
