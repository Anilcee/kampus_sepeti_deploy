ALTER TABLE "order_items" ADD COLUMN "product_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_image_url" varchar;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_slug" varchar;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_description" text;