ALTER TABLE "user_authentications" RENAME TO "UserAuthentication";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "User";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME TO "UserProfile";--> statement-breakpoint
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "user_authentications_user_id_unique";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "UserProfile" DROP CONSTRAINT "user_profiles_user_id_unique";--> statement-breakpoint
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "user_authentications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "UserProfile" DROP CONSTRAINT "user_profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_unique" UNIQUE("user_id");