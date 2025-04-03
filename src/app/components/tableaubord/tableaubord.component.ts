import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { ServiceService } from '../../services/service/service.service';
import { ClientService } from '../../services/client/client.service';
import { RendezvousService } from '../../services/rendezvous/rendezvous.service';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);

@Component({
  selector: 'app-tableaubord',
  imports:[FormsModule,CommonModule,MatIconModule],
  templateUrl: './tableaubord.component.html',
  styleUrls: ['./tableaubord.component.css']
})
export class TableaubordComponent implements OnInit {
  currentMonthProfits: number[] = [];  // Contiendra [0, 0, 200000, 0, 0]
  previousMonthProfits: number[] = []; // Contiendra [0, 0, 0, 200000, 80]
  currentPopularservices: any[]=[];
  weekLabels: string[] = [];   
  clientIntention:any[]=[];
  rententionrate=0;
  totalClients=0;
  compairs={revenueGrowth:0,percentageGrowth:0,};
  currentappointmentrate={total:0,cancelled:0,cancellationrate:0};
  previousappointmentrate={total:0,cancelled:0,cancellationrate:0};
  compairsappointment={totalVariation:0,rateVariation:0};
  interventionstat={
    total:0,
    completed:0,
    inProgress:4,
    completionRate:"",
    averageDuration:"",
    statusBreakdown: [
      {
          _id: "",
          count: 0
      }
    ]
  };
  constructor(
    private serviceService:ServiceService,
    private clientService:ClientService,
    private rendezvousService:RendezvousService,
  ){

  }
  ngOnInit(): void {
    this.loadRevenue();
    // this.createProfitChart();
    this.loadPopularServices();
    this.loadClientRetention();
    this.loadAppointment();
    this.loadInterventionStat();
  }

  loadRevenue(): void {
    this.serviceService.getRevenueWeekly().subscribe({
      next: (response) => {
        this.currentMonthProfits = response.data.currentMonth.weeks.map((week: any) => week.revenue);
        this.previousMonthProfits = response.data.previousMonth.weeks.map((week :any) => week.revenue);
        this.weekLabels = response.data.currentMonth.weeks.map((week :any) => `S${week.weekNumber}`);
        this.compairs=response.data.comparison;
        this.createProfitChart();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadPopularServices(): void {
    this.serviceService.getServicePopular().subscribe({
      next: (response) => {
          this.currentPopularservices=response.data.currentMonth.services;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadClientRetention(): void{
    this.clientService.getClientRetention().subscribe({
      next: (response) => {
          this.clientIntention=response.data.data.topLoyalClients;
          this.totalClients=response.data.data.totalClients;
          this.rententionrate=response.data.data.rentention;
          // console.log("Profit actuel:"+this.clientIntention);
          // console.log("Profit dernier:"+this.totalClients);
          // console.log("Semaine dernier:"+this.rententionrate);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadAppointment(): void {
    this.rendezvousService.getRendezvousStat().subscribe({
      next: (response) => {
          this.currentappointmentrate=response.currentMonth;
          this.previousappointmentrate=response.previousMonth;
          this.compairsappointment=response.comparison;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadInterventionStat(): void {
    this.serviceService.getInterventionStat().subscribe({
      next: (response) => {
        this.interventionstat=response;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  createProfitChart(): void {
    const ctx = document.getElementById('profitChart') as HTMLCanvasElement;
    
    const data = {
      labels: this.weekLabels,
      datasets: [
        {
          label: 'Mois en cours (MGA)',
          data: this.currentMonthProfits,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Mois précédent (MGA)',
          data: this.previousMonthProfits,
          borderColor: '#9E9E9E',
          backgroundColor: 'rgba(158, 158, 158, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} MGA`;
            }
          }
        },
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Évolution des bénéfices par semaine'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Montant (MGA)'
          },
          ticks: {
            callback: (value) => {
              return `${Number(value).toLocaleString()} MGA`;
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Semaines du mois'
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'line',
      data,
      options
    });
  }

  // Calcul du pourcentage de croissance
  getGrowthPercentage(): number {
    const currentTotal = this.currentMonthProfits.reduce((a, b) => a + b, 0);
    const prevTotal = this.previousMonthProfits.reduce((a, b) => a + b, 0);
    return ((currentTotal - prevTotal) / prevTotal) * 100;
  }
}