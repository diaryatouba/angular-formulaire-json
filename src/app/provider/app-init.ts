import { KeycloakService } from 'keycloak-angular';
import { Platform } from '@angular/cdk/platform';

export function initializer(keycloak: KeycloakService, platform: Platform): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (platform.isBrowser) {
        try {
          await keycloak.init({
            config: {
              url: 'http://localhost:8080',
              realm: 'BANKBPM',
              clientId: 'angular',
            },
            initOptions: {
              onLoad: 'login-required',
              checkLoginIframe: false,
            },
            enableBearerInterceptor: true,
            loadUserProfileAtStartUp: true,
            bearerExcludedUrls: [],
          });
          console.log('Keycloak initialized successfully');
          resolve(keycloak);
        } catch (error) {
          console.error('Keycloak initialization failed', error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  };
}