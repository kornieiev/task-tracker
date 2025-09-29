-- Делаем поле image необязательным (nullable)
ALTER TABLE users 
ALTER COLUMN image DROP NOT NULL;

-- Устанавливаем дефолтное значение для новых записей
ALTER TABLE users 
ALTER COLUMN image SET DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

-- Обновляем существующие записи с NULL image
UPDATE users 
SET image = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || LOWER(REPLACE(name, ' ', ''))
WHERE image IS NULL;