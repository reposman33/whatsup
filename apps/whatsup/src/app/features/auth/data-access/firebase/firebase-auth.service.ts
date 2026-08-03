import { inject, Injectable } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';

import { Contact, RegistrationOptions } from '../../../../models';
import { from, Observable } from 'rxjs';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../../../../core/data-access/firestore/firestore.service';
import { Temporal } from 'temporal-polyfill';

@Injectable({
  providedIn: 'root',
})
export class FireBaseAuthService {

  private firebaseAuth = inject(Auth)
  private firestoreService = inject(FirestoreService)
  private firestore = inject(Firestore)
  public user$: Observable<User | null> = user(this.firebaseAuth);

  constructor() {
    this.setSessionStoragePersistence();
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<Contact | undefined> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email,password)
    .then(async (userCredential): Promise<Contact | undefined> => {
      
      const contact = await this.firestoreService.getContact(userCredential.user.uid);
      if (contact) {
        contact.lastSigninTime = userCredential.user.metadata.lastSignInTime;
        contact.id = userCredential.user.uid;
      }
      return contact;
    })
    .catch((error): never => { // catch returnType type = never want catch(e) geeft nooit een waarde terug
      throw error;
    });
    
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }
  
  async register(contact: RegistrationOptions): Promise<void> {
    const userCredentials = await createUserWithEmailAndPassword(this.firebaseAuth, contact.email, contact.password)
    .catch((error) => {
      console.log('Fout bij aanmaken nieue gebruiker:: ', error);;
    })

    if(userCredentials) {
      // update the user's profile with additional information
      const _contact = {
        email: contact.email,
        lastSigninTime: '',
        name: contact.name,
        registrationTime: Temporal.Now.zonedDateTimeISO().toString(),
      }; // geen type Contact want bevat geen id property 
      
      // add user to firestore 'contacts' collection'
      await setDoc(doc(this.firestore, 'contacts', userCredentials.user.uid), _contact)
      .catch(error => console.error('Error adding user to firestore:', error));
    }
  }
}
