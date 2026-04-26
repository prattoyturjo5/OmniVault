-- file: stats_patch_v2.sql
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS email TEXT;
