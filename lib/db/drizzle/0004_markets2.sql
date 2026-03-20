CREATE TABLE "markets2" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"open_time" text NOT NULL,
	"close_time" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"open_result" text,
	"close_result" text,
	"jodi_result" text,
	"auto_update" boolean DEFAULT false NOT NULL,
	"source_url" text,
	"last_fetched_at" timestamp,
	"fetch_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
