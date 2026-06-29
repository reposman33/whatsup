import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { FireBaseService } from '@services/fire-base/fire-base.service';
import { AppConfig } from './environment';
import { StorageService } from '@services/storage/storage.service';

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
