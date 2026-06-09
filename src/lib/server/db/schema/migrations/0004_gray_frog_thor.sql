DROP INDEX `organization_slug_unique`;--> statement-breakpoint
DROP INDEX `organization_slug_uidx`;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_webapp_slug_uidx` ON `organization` (`webapp_id`,`slug`);--> statement-breakpoint
CREATE INDEX `organization_webapp_id_idx` ON `organization` (`webapp_id`);--> statement-breakpoint
CREATE INDEX `user_webappId_idx` ON `user` (`webapp_id`);