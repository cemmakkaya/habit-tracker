// src/app/tab1/tab1.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Habit {
  name: string;
  category: string;
  streak: number;
  color: string;
  todayDone: boolean;
  target: string;
  history: boolean[];
  progress: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Tab1Page {
  habits: Habit[] = [
    { 
      name: 'Exercise',
      category: 'Health',
      streak: 5, 
      color: '#4CAF50',
      todayDone: false,
      target: '30 Minuten',
      history: [true, false, true, true, true],
      progress: 50
    }
  ];

  selectedSegment = 'all';
  
  updateProgress(habit: Habit, increase: boolean) {
    const change = increase ? 10 : -10;
    habit.progress = Math.min(Math.max(0, habit.progress + change), 100);
  }

  toggleTodayDone(habit: Habit, event: Event) {
    event.stopPropagation();
    habit.todayDone = !habit.todayDone;
    if (habit.todayDone) {
      habit.streak++;
    } else {
      habit.streak--;
    }
  }
}
