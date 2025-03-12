import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'dynamic-form';
  isLoggedIn = false;
  keycloak: any;
  firstName: any;
  lastName: any;

  constructor(private keycloakService: KeycloakService) {}

    ngOnInit() {

    this.keycloakService.loadUserProfile().then((user) => {
      console.log(user);
      this.firstName = user?.firstName?.charAt(0).toUpperCase()
      this.lastName = user?.lastName?.charAt(0).toUpperCase()
    });
    // this.isLoggedIn = await this.keycloak.isLoggedIn();
    console.log('Utilisateur connecté ?', this.firstName);
    

  }
}
