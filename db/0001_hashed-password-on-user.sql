ALTER TABLE "users" RENAME COLUMN "password" TO "hashedPassword";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_password_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hashedPassword_unique" UNIQUE("hashedPassword");