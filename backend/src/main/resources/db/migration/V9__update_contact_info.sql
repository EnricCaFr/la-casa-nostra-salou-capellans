update restaurant_info
set phone = '+34 877 251 710',
    whatsapp = '34877251710',
    instagram_url = 'https://www.instagram.com/casanostra.capellans'
where id = (select id from restaurant_info order by id limit 1);
