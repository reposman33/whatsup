import { User } from "@models/user";

export const isUser = (obj: any): obj is User => typeof obj.email === 'string' && typeof obj.password === 'string';