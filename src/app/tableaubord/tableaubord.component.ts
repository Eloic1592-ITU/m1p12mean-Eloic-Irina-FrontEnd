import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartOptions, TooltipItem } from 'chart.js';

@Component({
  selector: 'app-tableaubord',
  standalone: false,
  templateUrl: './tableaubord.component.html',
  styleUrls: ['./tableaubord.component.css']  // Correction: 'styleUrl' doit être 'styleUrls'
})
export class TableaubordComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    // Code d'initialisation si nécessaire
  }

  ngAfterViewInit(): void {
    // Données pour le graphique (Chiffre d'Affaires par semaine du mois)
    const chiffreAffaireData = {
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
      datasets: [{
        label: 'Chiffre d\'Affaires (en MGA)',  // Modification ici pour l'Ariary
        data: [15000, 20000, 18000, 22000], // Chiffre d'affaires de chaque semaine
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Couleur de remplissage
        borderColor: 'rgba(54, 162, 235, 1)', // Couleur de bordure
        borderWidth: 1
      }]
    };

    // Options du graphique (typé avec ChartOptions)
    const options: ChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            // Définir correctement le type pour tooltipItem
            label: function(tooltipItem: TooltipItem<'bar'>) {
              return tooltipItem.raw + ' MGA'; // Affiche le montant en Ariary (MGA)
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // Création du graphique
    const ctx = document.getElementById('chiffreAffaireChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar', // Type de graphique (ici un graphique à barres)
      data: chiffreAffaireData,
      options: options
    });
  }
}
