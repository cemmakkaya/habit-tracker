import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page {
  stats = [
    { name: 'Lesen', progress: 85, color: '#4CAF50' },
    { name: 'Sport', progress: 70, color: '#2196F3' },
    { name: 'Meditation', progress: 60, color: '#9C27B0' }
  ];
}
