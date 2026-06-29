import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppConfig } from './environment';
import { StorageService } from '@services/api/storage.service';
import { LocalStorageService } from '@services/api/local/local-storage.service';
import { FireBaseService } from '@services/api/firebase/fire-base.service';
import { AuthService } from '@services/auth/auth.service';
import { LocalAuthService } from '@services/auth/local/local-auth.service';
import { FireBaseAuthService } from '@services/auth/fireBase/fire-base-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: AuthService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalAuthService : FireBaseAuthService
    },
    {
      provide: StorageService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalStorageService : FireBaseService
    }
  ]
};
