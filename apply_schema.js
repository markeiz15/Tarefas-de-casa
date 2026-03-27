import pg from 'pg';
const { Client } = pg;

// URL encode the password to safely handle special characters like @
const dbUrl = 'postgresql://postgres:Router%40agt58@db.wdmcbfyzblvclckizjly.supabase.co:5432/postgres';

const client = new Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

const schema = `
  -- Enable UUID
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Users Profile Table
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'performer'
  );

  -- Tasks Table
  CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    day TEXT NOT NULL,
    type TEXT NOT NULL,
    recurring_days TEXT[],
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Task Assignments
  CREATE TABLE IF NOT EXISTS public.task_assignments (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
  );

  -- Task Completions
  CREATE TABLE IF NOT EXISTS public.task_completions (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (task_id, user_id)
  );

  -- Drop existing policies if they exist before recreating
  DO $$ 
  BEGIN
      DROP POLICY IF EXISTS "Enable everything for everyone" ON public.users;
      DROP POLICY IF EXISTS "Enable everything for everyone" ON public.tasks;
      DROP POLICY IF EXISTS "Enable everything for everyone" ON public.task_assignments;
      DROP POLICY IF EXISTS "Enable everything for everyone" ON public.task_completions;
  EXCEPTION
      WHEN undefined_object THEN null;
  END $$;

  -- Setup Row Level Security
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;

  -- For simplicity in this household app, authenticated users have full access,
  -- and we allow public insert/read on users so sign ups work easily without edge functions.
  CREATE POLICY "Enable everything for everyone" ON public.users FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Enable everything for everyone" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Enable everything for everyone" ON public.task_assignments FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Enable everything for everyone" ON public.task_completions FOR ALL USING (true) WITH CHECK (true);
`;

async function applySchema() {
  try {
    await client.connect();
    console.log('Connected to database.');
    
    await client.query(schema);
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error applying schema:', error);
  } finally {
    await client.end();
  }
}

applySchema();
