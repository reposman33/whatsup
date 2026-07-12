import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppConfig } from './environment';

import { StorageService } from '@services/api/storage.service';
import { LocalStorageService } from '@services/api/local/local-storage.service';
import { FirestoreService } from '@services/api/firestore/firestore.service';
import { AuthenticateService } from '@services/auth/authenticate.service';
import { FireBaseAuthService } from '@services/auth/fireBase/fire-base-auth.service';
import { LocalAuthService } from '@services/auth/local/local-auth.service';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: AuthenticateService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalAuthService : FireBaseAuthService
    },
    {
      provide: StorageService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalStorageService : FirestoreService
    },
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(AppConfig.firebaseConfig!)),
    provideAuth(() => getAuth()),
  ]
};
