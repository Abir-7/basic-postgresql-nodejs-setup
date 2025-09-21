CREATE TABLE "user_authentication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exp_date" timestamp,
	"otp" varchar,
	"token" varchar,
	"user_id" uuid NOT NULL,
	CONSTRAINT "user_authentication_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"role" "roles" DEFAULT 'USER',
	"password" varchar NOT NULL,
	"is_verified" boolean DEFAULT false,
	"need_to_reset_pass" boolean DEFAULT false,
	"is_blocked" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"date_of_birth" date,
	"phone" varchar,
	"address" varchar,
	"image" varchar,
	"is_deleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP TABLE "UserAuthentication" CASCADE;--> statement-breakpoint
DROP TABLE "User" CASCADE;--> statement-breakpoint
DROP TABLE "UserProfile" CASCADE;--> statement-breakpoint
ALTER TABLE "user_authentication" ADD CONSTRAINT "user_authentication_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_authentication_user_id_idx" ON "user_authentication" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "user_profile" USING btree ("user_id");