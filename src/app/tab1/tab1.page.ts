import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddHabitPage } from '../modals/add-habit/add-habit.page';

interface Habit {
  name: string;
  category: string;
  progress: number;
  streak: number;
  color: string;
  todayDone: boolean;  // Hinzugefügt
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page {
  selectedSegment = 'all';
  
  habits: Habit[] = [
    { 
      name: 'Lesen', 
      category: 'Bildung', 
      progress: 60, 
      streak: 5,
      color: '#4CAF50',
      todayDone: false
    },
    { 
      name: 'Sport', 
      category: 'Gesundheit', 
      progress: 80, 
      streak: 12,
      color: '#2196F3',
      todayDone: false
    }
  ];

  constructor(private modalCtrl: ModalController) {}

  toggleTodayDone(habit: Habit, event: Event) {
    event.stopPropagation();
    habit.todayDone = !habit.todayDone;
    if (habit.todayDone) {
      habit.streak++;
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }
  }

  async openAddHabitModal() {
    const modal = await this.modalCtrl.create({
      component: AddHabitPage,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      this.habits.push({
        name: data.name,
        category: data.category,
        progress: 0,
        streak: 0,
        color: this.getCategoryColor(data.category),
        todayDone: false
      });
    }
  }

  getCategoryColor(categoryName: string): string {
    const categories: Record<string, string> = {
      'Bildung': '#4CAF50',
      'Sport': '#2196F3',
      'Wellness': '#9C27B0'
    };
    return categories[categoryName] || '#9e9e9e';
  }
}