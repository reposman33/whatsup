import { Contact } from "@models/contact";

export const isContact = (obj: any): obj is Contact => typeof obj.email === 'string' && typeof obj.password === 'string';