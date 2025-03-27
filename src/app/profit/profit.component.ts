import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-profit',
  standalone: false,
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css'] // Correction : styleUrls au lieu de styleUrl
})
export class ProfitComponent implements OnInit {

  // Données des services avec réduction et promotion
  services = [
    { name: 'Service 1', revenue: 50000, discount: 5000 },
    { name: 'Service 2', revenue: 30000, discount: 3000 },
    { name: 'Service 3', revenue: 20000, discount: 2000 },
    { name: 'Service 4', revenue: 40000, discount: 4000 }
  ];

  // Informations générales
  totalRevenue: number = 0;
  totalDiscount: number = 0; // Calcul du total des réductions
  totalAfterDiscount: number = 0; // Total après réduction
  topServices = { name: 'Service 1' };
  seasonVariation: string = 'Hiver - Forte demande';
  totalIncome: number = 150000;
  totalExpenses: number = 50000;

  chart: any;

  constructor() {}

  ngOnInit(): void {
    this.calculateTotals(); // Calculer les totaux dès le départ
    this.createChart('month'); // Initial chart with monthly data
  }

  // Calculer les totaux (revenue, réduction, total après réduction)
  calculateTotals(): void {
    // Total avant réduction
    this.totalRevenue = this.services.reduce((total, service) => total + service.revenue, 0);

    // Total des réductions
    this.totalDiscount = this.services.reduce((total, service) => total + service.discount, 0);

    // Total après réduction
    this.totalAfterDiscount = this.totalRevenue - this.totalDiscount;
  }

  // Créer un graphique en fonction de la période sélectionnée (jour, mois, année)
  createChart(period: string): void {
    const data = this.getDataForPeriod(period);

    if (this.chart) {
      this.chart.destroy(); // Détruire l'ancien graphique avant de le recréer
    }

    // Création du graphique avec Chart.js
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Chiffre d\'affaires',
          data: data.revenue,
          borderColor: '#4CAF50',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: period === 'day' ? 'Jours' : period === 'month' ? 'Mois' : 'Années' }
          },
          y: {
            title: { display: true, text: 'Chiffre d\'affaires (Ariary)' },
            beginAtZero: true
          }
        }
      }
    });
  }

  // Simuler les données de chiffre d'affaires selon la période (jour, mois, année)
  getDataForPeriod(period: string) {
    let labels: string[] = []; // Type explicite pour labels
    let revenue: number[] = []; // Type explicite pour revenue

    if (period === 'day') {
      labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      revenue = [12000, 15000, 18000, 13000, 20000, 25000, 22000];
    } else if (period === 'month') {
      labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      revenue = [100000, 120000, 140000, 130000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000];
    } else if (period === 'year') {
      labels = ['2021', '2022', '2023'];
      revenue = [1000000, 1200000, 1500000];
    }

    return { labels, revenue };
  }

  // Gérer le changement de période
  onDateChange(event: any): void {
    this.createChart(event.target.value);
  }
}
