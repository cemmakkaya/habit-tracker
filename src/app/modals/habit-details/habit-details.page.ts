// src/app/modals/habit-details/habit-details.page.ts
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-habit-details',
  templateUrl: './habit-details.page.html',
  styleUrls: ['./habit-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HabitDetailsPage {
  @Input() habit: any;
  selectedSegment = 'entries'; // Für Tab-Navigation

  constructor(private modalCtrl: ModalController) {
    addIcons({
      'arrow-back-outline': arrowBackOutline
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}