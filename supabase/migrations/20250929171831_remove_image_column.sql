-- Удаляем колонку image из таблицы users
ALTER TABLE users 
DROP COLUMN IF EXISTS image;