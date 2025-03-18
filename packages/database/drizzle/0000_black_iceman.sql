CREATE TABLE "url_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" varchar(20) NOT NULL,
	"alias" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"click_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "url_links_short_code_unique" UNIQUE("short_code"),
	CONSTRAINT "url_links_alias_unique" UNIQUE("alias")
);
--> statement-breakpoint
CREATE TABLE "visit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"url_link_id" integer NOT NULL,
	"visitor_ip" varchar(45) NOT NULL,
	"visited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visit_logs" ADD CONSTRAINT "visit_logs_url_link_id_url_links_id_fk" FOREIGN KEY ("url_link_id") REFERENCES "public"."url_links"("id") ON DELETE cascade ON UPDATE no action;