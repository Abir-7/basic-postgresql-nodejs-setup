CREATE TYPE "public"."roles" AS ENUM('SUPERADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "user_authentication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expDate" timestamp,
	"otp" varchar,
	"token" varchar,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"role" "roles" DEFAULT 'USER',
	"password" varchar,
	"isVerified" boolean DEFAULT false,
	"needToResetPass" boolean DEFAULT false,
	"isBlocked" boolean DEFAULT false,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullName" varchar NOT NULL,
	"dateOfBirth" date,
	"phone" varchar,
	"address" varchar,
	"image" varchar,
	"isDeleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_authentication" ADD CONSTRAINT "user_authentication_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_authentication_user_id_idx" ON "user_authentication" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "userId_idx" ON "user_profiles" USING btree ("userId");