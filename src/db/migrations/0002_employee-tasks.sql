CREATE SEQUENCE customer_id_seq OWNED BY customer.id START 4; --> Account for previous customers before this migration
ALTER TABLE "customer"
ALTER COLUMN "id"
SET DEFAULT nextval('customer_id_seq');
--> statement-breakpoint

CREATE SEQUENCE company_id_seq OWNED BY company.id START 3; --> Account for previous companies before this migration
ALTER TABLE "company"
ALTER COLUMN "id"
SET DEFAULT nextval('company_id_seq');
--> statement-breakpoint

CREATE TABLE "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"company_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "state" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"state" integer NOT NULL,
	"company_id" integer NOT NULL,
	"assigned" integer
);
--> statement-breakpoint
CREATE TABLE "task_to_employee" (
	"task_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	CONSTRAINT "task_to_employee_task_id_employee_id_pk" PRIMARY KEY("task_id","employee_id")
);
--> statement-breakpoint

ALTER TABLE "customer" DROP CONSTRAINT "customer_company_id_company_id_fk"; --> Drop earlier constraint and replace it with on delete cascade
--> statement-breakpoint

ALTER TABLE "customer" ADD CONSTRAINT "customer_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "state" ADD CONSTRAINT "state_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_state_state_id_fk" FOREIGN KEY ("state") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_customer_id_fk" FOREIGN KEY ("assigned") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_to_employee" ADD CONSTRAINT "task_to_employee_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_to_employee" ADD CONSTRAINT "task_to_employee_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

INSERT INTO "state" ("name", "company_id")
SELECT s.name, c.id
FROM company c
CROSS JOIN (VALUES ('Open'), ('In Progress'), ('Done')) AS s(name);
