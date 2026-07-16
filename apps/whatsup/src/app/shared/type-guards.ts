
import { Contact } from "../models/contact.model";

// is dit duck typing?
export const isContact = (obj: Record<string, unknown>): obj is Contact & Pick<{password: string}, 'password'> =>
  typeof obj['email'] === 'string'
&&
  typeof obj['password'] === 'string'
&&
typeof obj['name'] === 'string'
&&
typeof obj['registrationTime'] === 'number';