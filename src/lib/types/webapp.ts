import type { Result } from "./result";

export interface WebappSettings {
  primaryColor?: string;  // Hex color, e.g. "#4f46e5"
  logoUrl?: string;       // URL to company logo (client-side rendering only)
  appName?: string;       // Display name override for login page
  footerText?: string;    // Custom footer text
}

export interface Webapp {
  id: string;
  name: string;
  slug: string;
  domain: string;
  authBasePath: string;
  callbackUrl: string;
  settings: WebappSettings;
  isActive: boolean;
  createdAt: Date; // timestamp in ms
  updatedAt: Date; // timestamp in ms
}

export interface WebappListItem {
  id: string;
  name: string;
  slug: string;
  domain: string;
  isActive: boolean;
  createdAt: Date; // timestamp in ms
}

export type WebappError = 'NOT_FOUND' | 'DUPLICATE' | 'VALIDATION';
export type WebappResult<T> = Result<T, WebappError>;