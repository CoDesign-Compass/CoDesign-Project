ALTER TABLE users ADD COLUMN IF NOT EXISTS wants_gift boolean;
UPDATE users SET wants_gift = false WHERE wants_gift IS NULL;
ALTER TABLE users ALTER COLUMN wants_gift SET DEFAULT false;
ALTER TABLE users ALTER COLUMN wants_gift SET NOT NULL;

-- Added by commit a480f43: why_responses and how_responses gained a submissionId field
-- but the DB migration was missing. Column is nullable to accommodate pre-migration rows.
ALTER TABLE why_responses ADD COLUMN IF NOT EXISTS submission_id BIGINT;
ALTER TABLE how_responses ADD COLUMN IF NOT EXISTS submission_id BIGINT;
