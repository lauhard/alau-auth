import { relations } from "drizzle-orm";
import { webapp } from "./webapp";
import { organization, user } from "./auth";

export const webappRelations = relations(webapp, ({ many }) => ({
    users: many(user),
    organizations: many(organization),
}))