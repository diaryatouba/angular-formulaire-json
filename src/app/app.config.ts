import {APP_INITIALIZER, ApplicationConfig, Inject, PLATFORM_ID} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import { AuthGuard } from './security/auth.guard';
import { KeycloakInterceptor } from './security/keycloak.interceptor';
import {initializer} from "./provider/app-init";
import { isPlatformBrowser } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import {platform} from "node:os";
function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      // const { keycloakConfig } = environment;
      try {
        await keycloak.init({
          config: {
            url: 'http://localhost:8080', // Assure-toi que l'URL est correcte
            realm: 'BANKBPM',
            clientId: 'angular',
          },
          initOptions: {
            onLoad: 'login-required', // Force l'authentification
            checkLoginIframe: false, // Désactive l'iframe si nécessaire
          },
          enableBearerInterceptor: true, // Intercepteur des requêtes HTTP
          bearerExcludedUrls: ['/assets', '/public'] // Exclure certaines routes
        });
        resolve(keycloak);
      } catch (error) {
        reject(error);
      }
    });
  };

}

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    KeycloakService,
    KeycloakAngularModule,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer, // Utiliser la fonction d'initialisation Keycloak
      multi: true,
      deps: [KeycloakService, Platform], // Injecter KeycloakService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptor,
      multi: true
    },
    AuthGuard
  ],
};