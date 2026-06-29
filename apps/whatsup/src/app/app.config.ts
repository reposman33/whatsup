import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { LocalStorageService } from '@services/local-storage-service/local-storage.service';
import { FireBaseService } from '@services/fire-base.service/fire-base.service';
import { AppConfig } from './environment';
import { StorageService } from '@services/storage/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: StorageService,
      useClass: AppConfig.storageMethod === 'localStorage' ? LocalStorageService : FireBaseService
    }
  ]
};
