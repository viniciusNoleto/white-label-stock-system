CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"abbreviation" varchar(20) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "item_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"color_hex" varchar(7) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" numeric(15, 4) DEFAULT '0' NOT NULL,
	"unit_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_item_has_category" (
	"inventory_item_id" integer NOT NULL,
	"item_category_id" integer NOT NULL,
	"created_at" timestamp,
	CONSTRAINT "inventory_item_has_category_inventory_item_id_item_category_id_pk" PRIMARY KEY("inventory_item_id","item_category_id")
);
--> statement-breakpoint
CREATE TABLE "inventory_item_has_component" (
	"inventory_item_id" integer NOT NULL,
	"component_inventory_item_id" integer NOT NULL,
	"quantity_required" numeric(15, 4) NOT NULL,
	"created_at" timestamp,
	CONSTRAINT "inventory_item_has_component_inventory_item_id_component_inventory_item_id_pk" PRIMARY KEY("inventory_item_id","component_inventory_item_id")
);
--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item_has_category" ADD CONSTRAINT "inventory_item_has_category_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item_has_category" ADD CONSTRAINT "inventory_item_has_category_item_category_id_item_categories_id_fk" FOREIGN KEY ("item_category_id") REFERENCES "public"."item_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item_has_component" ADD CONSTRAINT "inventory_item_has_component_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item_has_component" ADD CONSTRAINT "inventory_item_has_component_component_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("component_inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;