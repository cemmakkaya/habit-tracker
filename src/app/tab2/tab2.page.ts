import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

interface Habit {
  name: string;
  category: string;
  color: string;
  progress: number;
  streak: number;
  entries: any[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit {
  habits: Habit[] = [];
  overallStats: {
    totalHabits: number;
    avgProgress: number;
    maxStreak: number;
    completedHabits: number;
  } = {
    totalHabits: 0,
    avgProgress: 0,
    maxStreak: 0,
    completedHabits: 0,
  };

  weeklyProgress: {
    name: string;
    progress: number;
    weeklyRate: number;
    color: string;
    trend: number;
  }[] = [];

  async ngOnInit() {
    await this.loadHabits();
    this.calculateStats();   
  }

  async loadHabits() {
    try {
      const { value } = await Preferences.get({ key: 'habits' });
      if (value) {
        this.habits = JSON.parse(value);
        this.calculateStats();
      }
    } catch (error) {
      console.error('Fehler beim Laden der Gewohnheiten:', error);
    }
  }

  calculateStats() {
    this.overallStats.totalHabits = this.habits.length;
    this.overallStats.avgProgress = Math.round(
      this.habits.reduce((sum, habit) => sum + habit.progress, 0) / this.habits.length
    );
    this.overallStats.maxStreak = Math.max(
      ...this.habits.map(habit => habit.streak)
    );
    this.overallStats.completedHabits = this.habits.filter(
      habit => habit.progress === 100
    ).length;

    this.weeklyProgress = this.habits.map(habit => {
      const lastWeekEntries = habit.entries?.filter(entry => {
        const entryDate = new Date(entry.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
      });

      const weeklySuccess = lastWeekEntries?.length || 0;
      const weeklyRate = Math.round((weeklySuccess / 7) * 100);

      return {
        name: habit.name,
        progress: habit.progress,
        weeklyRate,
        color: habit.color,
        trend: weeklyRate - habit.progress 
      };
    });
  }
}
