import { Contact } from "@models/contact";

export const isContact = (obj: Record<string, unknown>): obj is Contact => typeof obj['email'] === 'string' && typeof obj['password'] === 'string';