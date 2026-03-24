CREATE TABLE IF NOT EXISTS "upi_methods" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "upi_id" text NOT NULL,
  "display_name" text,
  "is_active" text DEFAULT 'true',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "apk_files" (
  "id" serial PRIMARY KEY NOT NULL,
  "filename" text NOT NULL,
  "filepath" text NOT NULL,
  "filesize" text,
  "version_code" text,
  "version_name" text,
  "is_active" text DEFAULT 'true',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
