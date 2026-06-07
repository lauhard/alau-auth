CREATE TABLE `webapp` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`domain` text NOT NULL,
	`auth_base_path` text DEFAULT '/auth' NOT NULL,
	`callback_url` text NOT NULL,
	`settings` text DEFAULT '{}' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webapp_slug_uidx` ON `webapp` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `webapp_domain_uidx` ON `webapp` (`domain`);--> statement-breakpoint
DROP INDEX `organization_slug_unique`;--> statement-breakpoint
DROP INDEX `organization_slug_uidx`;--> statement-breakpoint
ALTER TABLE `organization` ADD `webapp_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_webapp_slug_uidx` ON `organization` (`webapp_id`,`slug`);--> statement-breakpoint
CREATE INDEX `organization_webapp_id_idx` ON `organization` (`webapp_id`);--> statement-breakpoint
CREATE INDEX `user_webappId_idx` ON `user` (`webapp_id`);