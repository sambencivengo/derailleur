CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp (3),
	"username" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"location" varchar(255),
	"favoriteBikes" varchar(255)[],
	CONSTRAINT "posts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"location" varchar(255),
	"favoriteBikes" varchar(255)[],
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
