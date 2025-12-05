CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"location" varchar(255),
	"favorite_bikes" varchar(255)[],
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
