ALTER TABLE users ADD COLUMN IF NOT EXISTS wants_gift boolean;
UPDATE users SET wants_gift = false WHERE wants_gift IS NULL;
ALTER TABLE users ALTER COLUMN wants_gift SET DEFAULT false;
ALTER TABLE users ALTER COLUMN wants_gift SET NOT NULL;
