-- FUTURE: Generic trigger function for auto-updating updated_at columns
--
-- Currently, updated_at is handled by Drizzle's $onUpdate() in the schema.
-- When ready to move to database-level triggers, use this pattern:
--
-- STEP 1: Create the trigger function (add to a migration):
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$ language 'plpgsql';
--
-- STEP 2: For each table with updated_at, add a trigger:
-- DROP TRIGGER IF EXISTS update_<table_name>_updated_at ON "<table_name>";
-- CREATE TRIGGER update_<table_name>_updated_at BEFORE UPDATE ON "<table_name>"
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--
-- Example for a "comments" table:
-- DROP TRIGGER IF EXISTS update_comments_updated_at ON "comments";
-- CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON "comments"
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--
-- NOTE: Once triggers are added, you can remove $onUpdate() from the Drizzle schema


