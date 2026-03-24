CREATE TABLE "company" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"businessId" integer,
	"email" text NOT NULL,
	"industry" text,
	CONSTRAINT "company_businessId_unique" UNIQUE("businessId")
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"description" text,
	"company_id" integer NOT NULL
);

--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
