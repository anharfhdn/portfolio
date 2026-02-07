ALTER TABLE IF EXISTS posts
  ADD COLUMN IF NOT EXISTS owner text;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_select" ON posts
  FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "auth_insert_own" ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = owner);

CREATE POLICY IF NOT EXISTS "auth_update_own" ON posts
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid() = owner);

CREATE POLICY IF NOT EXISTS "auth_delete_own" ON posts
  FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.uid() = owner);