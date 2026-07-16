import { Contact } from "../../../models/contact.model";
import { Observable } from "rxjs";

export abstract class AuthenticateService {
  
  abstract login(email: string, password: string): Observable<Contact | undefined>
  
  abstract logout(): Observable<void>

  abstract register(contact: Contact): void

}
