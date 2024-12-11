import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgxChartsModule]
})
export class Tab2Page {
  // Liniendiagramm Daten
  lineChartData = [
    {
      name: 'Lesen',
      series: [
        { name: 'Mo', value: 4 },
        { name: 'Di', value: 3 },
        { name: 'Mi', value: 5 },
        { name: 'Do', value: 2 },
        { name: 'Fr', value: 4 },
        { name: 'Sa', value: 3 },
        { name: 'So', value: 5 }
      ]
    },
    {
      name: 'Sport',
      series: [
        { name: 'Mo', value: 2 },
        { name: 'Di', value: 4 },
        { name: 'Mi', value: 3 },
        { name: 'Do', value: 5 },
        { name: 'Fr', value: 2 },
        { name: 'Sa', value: 4 },
        { name: 'So', value: 3 }
      ]
    }
  ];

  // Kreisdiagramm Daten
  pieChartData = [
    { name: 'Lesen', value: 85 },
    { name: 'Sport', value: 70 },
    { name: 'Meditation', value: 60 }
  ];
}
