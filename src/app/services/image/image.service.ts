// src/app/core/services/image-utils.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponible dans toute l'application
})
export class ImageUtilsService {
  
  constructor() { }

  async compressImage(file: File, maxWidth: number, quality: number = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target!.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          resolve(canvas.toDataURL('image/jpeg', quality)); // Retourne en Base64
        };
      };
      reader.readAsDataURL(file);
    });
  }

}