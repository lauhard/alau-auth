DROP INDEX `organization_webapp_slug_uidx`;--> statement-breakpoint
DROP INDEX `organization_webapp_id_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_uidx` ON `organization` (`slug`);--> statement-breakpoint
DROP INDEX `user_webappId_idx`;