import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDateForInput } from '../../utils/utils';
import { ClientService } from '../../services/client/client.service';
import { ImageUtilsService } from '../../services/image/image.service';
@Component({
  selector: 'app-edit-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent {
  id: string | null = null;
  client: any = { 
    nom: '',
    datenaissance: '',
    contact: '',
    email: '',
    motdepasse: '',
    image: 'assets/img/defaultavatar.png' 
  };

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private imageService: ImageUtilsService
  ) {}

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.clientService.getClientById(this.id).subscribe(
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

  

 // Gestion des fichiers
 onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
    this.client.image = this.selectedFile.name;
  }
}


  async updateClient(): Promise<void> {
    if (this.selectedFile) {
      this.client.image = await this.imageService.compressImage(this.selectedFile, 800);
    }
    this.clientService.updateClient(this.id,this.client)
      .subscribe({
        next: () => {
          alert('Evenement ajouté avec succès');
          this.router.navigate(['/accueil']);
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  cancelEdit(): void {
    this.router.navigate(['/accueil']);
  }
}
