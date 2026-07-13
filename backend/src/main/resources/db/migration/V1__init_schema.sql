create table categories (
    id bigserial primary key,
    name varchar(160) not null unique,
    slug varchar(180) not null unique,
    description text,
    display_order integer not null default 0,
    active boolean not null default true
);

create table allergen_tags (
    id bigserial primary key,
    code varchar(60) not null unique,
    name varchar(120) not null,
    icon varchar(20) not null,
    type varchar(40) not null
);

create table menu_items (
    id bigserial primary key,
    name varchar(180) not null,
    slug varchar(220) not null unique,
    description text not null,
    price numeric(10, 2) not null check (price >= 0),
    image_url text,
    highlighted boolean not null default false,
    active boolean not null default true,
    display_order integer not null default 0,
    category_id bigint not null references categories(id)
);

create table menu_item_tags (
    menu_item_id bigint not null references menu_items(id) on delete cascade,
    tag_id bigint not null references allergen_tags(id) on delete cascade,
    primary key (menu_item_id, tag_id)
);

create table reservation_requests (
    id bigserial primary key,
    name varchar(160) not null,
    phone varchar(60) not null,
    email varchar(180),
    reservation_date date not null,
    reservation_time time not null,
    people integer not null check (people > 0),
    message text,
    status varchar(40) not null default 'NEW',
    created_at timestamp not null default now()
);

create table restaurant_info (
    id bigserial primary key,
    name varchar(160),
    claim varchar(240),
    description text,
    address varchar(240),
    phone varchar(80),
    email varchar(180),
    whatsapp varchar(80),
    opening_hours text,
    instagram_url varchar(240),
    google_maps_url text
);

create index idx_menu_items_category on menu_items(category_id);
create index idx_menu_items_active on menu_items(active);
create index idx_menu_items_slug on menu_items(slug);
