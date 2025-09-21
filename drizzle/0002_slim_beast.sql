DROP INDEX "userId_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "user_profiles" USING btree ("user_id");