CREATE TABLE "urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(155) NOT NULL,
	"target_url" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "urls_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;