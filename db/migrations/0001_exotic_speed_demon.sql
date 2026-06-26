CREATE TABLE "storages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
