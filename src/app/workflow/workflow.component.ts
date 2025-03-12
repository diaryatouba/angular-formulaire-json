import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-workflow',
  standalone: false,
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent {
  constructor(private apiService: ApiService) { }

  envoyerDonnees() {
    const donnees = { key: 'demande' };

    this.apiService.sendData(donnees).subscribe({
      next: response => console.log('Réponse du backend:', response),
      error: error => console.error('Erreur:', error)
    });
  }
}
