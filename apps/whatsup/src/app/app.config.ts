import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppConfig } from './environment';

import { StorageProvider } from './core/data-access/storage-provider';
import { LocalStorageService } from './core/data-access/local/local-storage.service';
import { FirestoreService } from './core/data-access/firestore/firestore.service';
import { AuthenticateService } from './features/auth/data-access/auth-provider';
import { FireBaseAuthService } from './features/auth/data-access/firebase/firebase-auth.service';
import { LocalAuthService } from './features/auth/data-access/local/local-auth.service';
import { UtilsService } from './shared/services/utils-service/utilsService';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    {
      provide: AuthenticateService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalAuthService : FireBaseAuthService
    },
    {
      provide: StorageProvider,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalStorageService : FirestoreService
    },
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(AppConfig.firebaseConfig!)),
    provideAuth(() => getAuth()),
    {
      provide: UtilsService,
      useClass: UtilsService
    }
  ]
};
