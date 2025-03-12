import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { mergeMap, catchError, finalize } from 'rxjs/operators';

@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifier si l'URL ne doit pas être interceptée
    if (req.url.includes('/public')) {
      return next.handle(req); // Ne pas ajouter de token pour les requêtes publiques
    }

    return from(this.keycloakService.getToken()).pipe(
      mergeMap(token => {
        if (!token) {
          console.warn('KeycloakInterceptor: Aucun token disponible, envoi de la requête sans authentification.');
          return next.handle(req);
        }

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(cloned);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du token Keycloak:', error);
        return next.handle(req); // Retourner la requête originale en cas d'erreur
      })
    );
  }
    /*intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      return next.handle(request).pipe(
          finalize(
              () => {
          }
          )
      );
    }*/

}
