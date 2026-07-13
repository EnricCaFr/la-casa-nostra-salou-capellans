create table admin_users (
  id bigserial primary key,
  username varchar(100) not null unique,
  password_hash varchar(100) not null,
  role varchar(50) not null,
  active boolean not null default true,
  created_at timestamp not null default now()
);

insert into admin_users (username, password_hash, role, active)
values ('pastel', '$2a$10$AgRuW9Ucb7Clo9fBjAoZpe0DlkDlXo6fNM0gAl2tKDkYtsPTYs2sm', 'ADMIN', true);
