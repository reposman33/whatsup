import { Contact } from "@models/contact";

export abstract class AuthenticateService {
  
  abstract login(email: string, password: string): Contact | undefined
  
  abstract logout(): undefined

  abstract register(contact: Contact): void

}
