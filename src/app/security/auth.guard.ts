import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard{
  constructor(
    protected override router: Router,
    protected override keycloakAngular: KeycloakService
  ) {
    super(router, keycloakAngular);
    console.log('oui');
  }

  isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('yes');
    return new Promise(async (resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        return;
      }
      console.log(
        'role restriction given at app-routing.module for this route',
        route.data['roles']
      );
      console.log('User roles coming after login from keycloak :', this.roles);
      const requiredRoles = route.data['roles'];
      let granted = false;
      if (!requiredRoles || requiredRoles.length === 0) {
        granted = true;
      } else {
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }
      }

      if (granted === false) {
        this.router.navigate(['/']);
      }
      resolve(granted);
    });
  }
}