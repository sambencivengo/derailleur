CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"location" varchar(255),
	"favoriteBikes" varchar(255)[],
	CONSTRAINT "posts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_hashedPassword_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;