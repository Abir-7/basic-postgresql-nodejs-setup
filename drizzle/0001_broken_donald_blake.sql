ALTER TABLE "user_authentication" RENAME TO "user_authentications";--> statement-breakpoint
ALTER TABLE "user_authentications" RENAME COLUMN "expDate" TO "exp_date";--> statement-breakpoint
ALTER TABLE "user_authentications" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "isVerified" TO "is_verified";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "needToResetPass" TO "need_to_reset_pass";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "isBlocked" TO "is_blocked";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "fullName" TO "full_name";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "dateOfBirth" TO "date_of_birth";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_authentications" DROP CONSTRAINT "user_authentication_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX "user_authentication_user_id_idx";--> statement-breakpoint
DROP INDEX "userId_idx";--> statement-breakpoint
ALTER TABLE "user_authentications" ADD CONSTRAINT "user_authentications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_authentication_user_id_idx" ON "user_authentications" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "userId_idx" ON "user_profiles" USING btree ("user_id");