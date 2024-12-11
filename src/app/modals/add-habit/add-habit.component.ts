import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.component.html',
  styleUrls: ['./add-habit.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddHabitComponent {
  habit = {
    name: '',
    category: '',
    target: ''
  };

  categories = [
    { name: 'Bildung', color: '#4CAF50' },
    { name: 'Sport', color: '#2196F3' },
    { name: 'Wellness', color: '#9C27B0' }
  ];

  dismiss() {
    // Modal schließen
  }

  confirm() {
    // Habit hinzufügen
  }
}