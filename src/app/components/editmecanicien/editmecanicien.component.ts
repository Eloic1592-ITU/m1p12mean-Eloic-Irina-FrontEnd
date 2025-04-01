import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MecanicienService } from '../../services/mecanicien/mecanicien.service';
import { formatDateForInput } from '../../utils/utils';
@Component({
  selector: 'app-editmecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './editmecanicien.component.html',
  styleUrl: './editmecanicien.component.css'
})
export class EditmecanicienComponent {
  mecanicien:any={};

  constructor(
    private route: ActivatedRoute,
    private mecanicienService: MecanicienService,
    private router: Router,

) {}

ngOnInit(): void {
  const mecanicienId = this.route.snapshot.paramMap.get('id');

  if (mecanicienId) {
    this.mecanicienService.getMecanicienbyId(mecanicienId).subscribe(
      (data) => {
        this.mecanicien = {
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
updateMecanicien(): void {
  this.mecanicienService.updateMecanicien(this.mecanicien._id, this.mecanicien).subscribe(
      (response) => {
          alert('Mecanicien mis à jour avec succès');
          this.router.navigate(['/mecanicien']);
      },
      (error) => {
        alert('Erreur lors de la mise à jour');
      }
  );
}
cancelEdit(): void {
        this.router.navigate(['/mecanicien']);
}
}
