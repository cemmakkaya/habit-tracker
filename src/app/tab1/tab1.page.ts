// src/app/tab1/tab1.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page {
  todayDate = new Date();

  habits = [
    { 
      id: 1,
      name: 'Lesen', 
      category: 'Bildung', 
      progress: 60, 
      streak: 16,
      color: '#4CAF50',
      todayDone: false,
      target: '30 Minuten',
      history: [true, true, true, false, true]
    },
    { 
      id: 2,
      name: 'Sport', 
      category: 'Gesundheit', 
      progress: 80, 
      streak: 12,
      color: '#2196F3',
      todayDone: true,
      target: '45 Minuten',
      history: [true, true, true, true, true]
    }
  ];

  getStreakIntensityColor(streak: number): string {
    if (streak >= 30) return '#9C27B0'; // Legendär
    if (streak >= 14) return '#F44336'; // Sehr heiß
    if (streak >= 7) return '#FF5722';  // Heiß
    if (streak >= 3) return '#FF9800';  // Warm
    return '#9e9e9e';                   // Normal
  }

  toggleTodayDone(habit: any, event: Event) {
    event.stopPropagation();
    habit.todayDone = !habit.todayDone;
    
    if (habit.todayDone) {
      habit.streak++;
      // Optional: Sound abspielen
      const audio = new Audio('/assets/sounds/success.mp3');
      audio.play().catch(() => {});
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }
  }
}