CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(55) NOT NULL,
	"last_name" varchar(55),
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
