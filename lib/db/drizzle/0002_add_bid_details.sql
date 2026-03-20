ALTER TABLE "bids" ADD COLUMN "market_name" text NOT NULL DEFAULT '';
ALTER TABLE "bids" ADD COLUMN "open_time" text NOT NULL DEFAULT '';
ALTER TABLE "bids" ADD COLUMN "close_time" text NOT NULL DEFAULT '';
ALTER TABLE "bids" ADD COLUMN "current_time" timestamp NOT NULL DEFAULT now();
-- Status column already exists, ensure default is set
ALTER TABLE "bids" ALTER COLUMN "status" SET DEFAULT 'pending';
