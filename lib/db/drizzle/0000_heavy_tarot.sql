CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"market_id" integer NOT NULL,
	"game_type" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"number" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text DEFAULT 'upi' NOT NULL,
	"transaction_id" text,
	"screenshot_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "game_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"single_digit" numeric(10, 2) DEFAULT '9' NOT NULL,
	"jodi_digit" numeric(10, 2) DEFAULT '90' NOT NULL,
	"single_panna" numeric(10, 2) DEFAULT '150' NOT NULL,
	"double_panna" numeric(10, 2) DEFAULT '300' NOT NULL,
	"triple_panna" numeric(10, 2) DEFAULT '600' NOT NULL,
	"half_sangam" numeric(10, 2) DEFAULT '1500' NOT NULL,
	"full_sangam" numeric(10, 2) DEFAULT '3000' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "markets" (
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
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" integer NOT NULL,
	"result_date" text NOT NULL,
	"open_result" text,
	"close_result" text,
	"jodi_result" text,
	"panna_result" text,
	"declared_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scraper_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" integer,
	"market_name" text,
	"source_url" text,
	"success" boolean NOT NULL,
	"open_result" text,
	"close_result" text,
	"jodi_result" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_name" text DEFAULT 'Matka Admin' NOT NULL,
	"logo_url" text,
	"support_phone" text,
	"upi_id" text,
	"bank_name" text,
	"bank_account_number" text,
	"bank_ifsc_code" text,
	"qr_code_url" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"wallet_balance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"bank_name" text,
	"account_number" text,
	"ifsc_code" text,
	"upi_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scraper_logs" ADD CONSTRAINT "scraper_logs_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;