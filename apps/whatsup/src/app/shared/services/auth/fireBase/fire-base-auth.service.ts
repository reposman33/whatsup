import { inject, Injectable } from '@angular/core';

import {
  Auth,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { createUserWithEmailAndPassword, setPersistence } from 'firebase/auth';

import { Contact } from '@models/contact';
import { from, Observable } from 'rxjs';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FireBaseAuthService {

  private firebaseAuth = inject(Auth)
  private firestore = inject(Firestore)
  public user$: Observable<User | null> = user(this.firebaseAuth);

  constructor() {
    this.setSessionStoragePersistence();
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<User> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((user) => {
      return user.user;
    })
    .catch((error) => {
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
  
  // login(email: string, password: string): Contact | undefined {
  //   return undefined
  // }
  
  // logout(): undefined {
  //   return undefined
  // }
  
  async register(contact: Contact & Pick<{password: string}, 'password'>): Promise<void> {
    const userCredentials = await createUserWithEmailAndPassword(this.firebaseAuth, contact.email, contact.password)
    .catch((error) => {
      console.log('Error in createUserWithEmailAndPassword(): ', error);;
    })

    if(userCredentials) {
      // update the user's profile with additional information
      const _contact = {
        id: userCredentials.user.uid, // <===
        email: contact.email,
        name: contact.name,
        registrationTimestamp: new Date().getTime(), // <==
      };
      
      // add user to firestore database
      try {
        await setDoc(doc(this.firestore, 'contacts', _contact.id), _contact);
      } catch (error) {
        console.error('Error adding user to firestore:', error);
      }
    }
  }
}
