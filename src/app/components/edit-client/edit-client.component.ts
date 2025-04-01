import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDateForInput } from '../../utils/utils';
import { ClientService } from '../../services/client/client.service';
@Component({
  selector: 'app-edit-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent {
  client: any = {};

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');

    if (clientId) {
      this.clientService.getClientById(clientId).subscribe(
        (data) => {
          this.client = {
            ...data,
            datenaissance: formatDateForInput(data.datenaissance), // Formatage ici
          };
        },
        (error) => {
          console.error('Erreur lors du chargement des données', error);
        }
      );
    }
  }

  updateClient(): void {
    this.clientService.updateClient(this.client._id, this.client).subscribe(
      (response) => {
        alert('Client mis à jour avec succès');
        this.router.navigate(['/client']);
      },
      (error) => {
        alert('Erreur lors de la mise à jour');
      }
    );
  }

  cancelEdit(): void {
    this.router.navigate(['/client']);
  }
}
