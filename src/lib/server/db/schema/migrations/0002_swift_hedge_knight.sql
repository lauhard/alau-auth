CREATE TABLE `customer` (
	`id` text PRIMARY KEY NOT NULL,
	`legal_name` text NOT NULL,
	`display_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`country` text NOT NULL,
	`registration_number` text NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond')* 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond')* 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customer_name_idx` ON `customer` (`display_name`);--> statement-breakpoint
CREATE INDEX `customer_country_idx` ON `customer` (`country`);--> statement-breakpoint
CREATE INDEX `customer_plan_idx` ON `customer` (`plan`);