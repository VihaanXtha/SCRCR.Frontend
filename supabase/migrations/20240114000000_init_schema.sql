
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('video', 'image')) DEFAULT 'video',
  img TEXT,
  video_url TEXT,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  img TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  img TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  popup BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  media_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  popup BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Create Public Read Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_items' AND policyname = 'Public Read Gallery') THEN
        CREATE POLICY "Public Read Gallery" ON gallery_items FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'members' AND policyname = 'Public Read Members') THEN
        CREATE POLICY "Public Read Members" ON members FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Public Read News') THEN
        CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notices' AND policyname = 'Public Read Notices') THEN
        CREATE POLICY "Public Read Notices" ON notices FOR SELECT USING (true);
    END IF;
END
$$;

-- Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('scrc-uploads', 'scrc-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- We need to handle potential policy existence to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'scrc-uploads');
    END IF;

    -- Allowing upload for Service Role is implicit, but if we want anon upload (not recommended but maybe needed if using anon key for upload)
    -- Since we use Service Role in backend, we don't strictly need an INSERT policy for RLS, but let's add one for good measure if we switch to client-side upload later.
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Upload') THEN
        CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'scrc-uploads');
    END IF;
    
    -- Allow Delete for Service Role (Implicit) or authenticated
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Delete') THEN
        CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'scrc-uploads');
    END IF;
END
$$;
