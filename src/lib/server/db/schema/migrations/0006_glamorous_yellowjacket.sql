PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer` (
	`id` text PRIMARY KEY NOT NULL,
	`legal_name` text NOT NULL,
	`display_name` text NOT NULL,
	`contact_name` text,
	`contact_email` text,
	`country` text NOT NULL,
	`registration_number` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond')* 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond')* 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_customer`("id", "legal_name", "display_name", "contact_name", "contact_email", "country", "registration_number", "plan", "is_active", "metadata", "created_at", "updated_at") SELECT "id", "legal_name", "display_name", "contact_name", "contact_email", "country", "registration_number", "plan", "is_active", "metadata", "created_at", "updated_at" FROM `customer`;--> statement-breakpoint
DROP TABLE `customer`;--> statement-breakpoint
ALTER TABLE `__new_customer` RENAME TO `customer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `customer_name_idx` ON `customer` (`display_name`);--> statement-breakpoint
CREATE INDEX `customer_country_idx` ON `customer` (`country`);--> statement-breakpoint
CREATE INDEX `customer_plan_idx` ON `customer` (`plan`);