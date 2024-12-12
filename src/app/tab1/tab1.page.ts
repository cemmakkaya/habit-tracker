import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddHabitPage } from '../modals/add-habit/add-habit.page';
import { HabitDetailsPage } from '../modals/habit-details/habit-details.page';
import { HabitDocumentationPage } from '../modals/habit-documentation/habit-documentation.page';
import { addIcons } from 'ionicons';
import { 
  add, 
  checkmarkCircleOutline, 
  createOutline, 
  flame, 
  micOutline, 
  cameraOutline, 
  checkmark, 
  trophyOutline 
} from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';
import { Preferences } from '@capacitor/preferences';

interface Habit {
  id?: string;
  name: string;
  category: string;
  color: string;
  progress: number;
  streak: number;
  today_done: boolean;
  is_completed: boolean;
  duration: number;
  entries: any[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    HabitDetailsPage,
    HabitDocumentationPage
  ]
})
export class Tab1Page implements OnInit {
  currentDate: Date = new Date();
  selectedSegment = 'all';
  habits: Habit[] = [];
  categories: any[] = [];
  streakDays: number = 0;
  todayCompletionPercentage: number = 0;

  constructor(
    private modalCtrl: ModalController, 
    private alertController: AlertController,
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {
    addIcons({
      add,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'create-outline': createOutline,
      flame,
      'mic-outline': micOutline,
      'camera-outline': cameraOutline,
      checkmark,
      'trophy-outline': trophyOutline
    });
  }

  async ngOnInit() {
    await this.loadCategories();
    await this.loadHabits();
    this.updateDashboardStats();
  }

  async loadCategories() {
    try {
      this.categories = await this.getCategories();
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  }

  async getCategories(): Promise<any[]> {
    try {
      const { value } = await Preferences.get({ key: 'categories' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
      return [];
    }
  }

  async loadHabits() {
    try {
      this.habits = await this.getHabits();
    } catch (error) {
      console.error('Fehler beim Laden der Gewohnheiten:', error);
    }
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const { value } = await Preferences.get({ key: 'habits' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Fehler beim Laden der Gewohnheiten:', error);
      return [];
    }
  }

  async saveHabits() {
    try {
      await Preferences.set({
        key: 'habits',
        value: JSON.stringify(this.habits)
      });
      this.updateDashboardStats();
    } catch (error) {
      console.error('Fehler beim Speichern der Gewohnheiten:', error);
    }
  }

  getFilteredHabits(): Habit[] {
    const habits = this.selectedSegment === 'completed' 
      ? this.habits.filter(habit => habit.is_completed)
      : this.habits.filter(habit => !habit.is_completed);
  
    // Sortiere die Habits: erledigte nach unten
    return habits.sort((a, b) => {
      if (a.today_done === b.today_done) return 0;
      return a.today_done ? 1 : -1;
    });
  }

  async openHabitDetails(habit: Habit) {
    try {
      const modal = await this.modalCtrl.create({
        component: HabitDetailsPage,
        componentProps: {
          habit: habit
        }
      });
      await modal.present();
    } catch (error) {
      console.error('Fehler beim Öffnen der Habit-Details:', error);
    }
  }

  async completeHabit(habit: Habit, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Gewohnheit abschließen',
      message: 'Möchtest du diese Gewohnheit wirklich als abgeschlossen markieren?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Abschließen',
          handler: async () => {
            try {
              habit.is_completed = true;
              await this.saveHabits();
            } catch (error) {
              console.error('Fehler beim Abschließen der Gewohnheit:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async toggleTodayDone(habit: Habit, event: Event) {
    try {
      event.stopPropagation();
  
      if (habit.today_done) {
        const alert = await this.alertController.create({
          header: 'Eintrag löschen',
          message: 'Möchtest du den heutigen Eintrag wirklich löschen?',
          buttons: [
            {
              text: 'Abbrechen',
              role: 'cancel'
            },
            {
              text: 'Löschen',
              role: 'destructive',
              handler: async () => {
                try {
                  const progressStep = Math.floor(100 / habit.duration);
                  habit.today_done = false;
                  habit.streak = Math.max(0, habit.streak - 1);
                  habit.progress = Math.max(0, Math.floor(habit.progress - progressStep));
                  await this.saveHabits();
                } catch (error) {
                  console.error('Fehler beim Löschen des Eintrags:', error);
                }
              }
            }
          ]
        });
        await alert.present();
        return;
      }
  
      const modal = await this.modalCtrl.create({
        component: HabitDocumentationPage,
        componentProps: { habit },
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.5
      });
  
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm' && data) {
        try {
          const progressStep = Math.floor(100 / habit.duration);
          habit.today_done = true;
          habit.streak++;
          habit.progress = Math.min(100, Math.floor(habit.progress + progressStep));
          
          if (!habit.entries) {
            habit.entries = [];
          }
          habit.entries.push({
            date: new Date(),
            type: data.type,
            content: data.content
          });
          
          await this.saveHabits();
        } catch (error) {
          console.error('Fehler beim Erstellen des Eintrags:', error);
        }
      }
    } catch (error) {
      console.error('Fehler in toggleTodayDone:', error);
    }
  }

  async updateHabitProgress(habit: Habit) {
    try {
      if (!habit.duration) {
        habit.duration = 30; // Standardwert, falls nicht definiert
      }

      const totalEntries = habit.entries.length;
      const todayEntries = habit.entries.filter(entry => 
        new Date(entry.date).toDateString() === new Date().toDateString()
      ).length;

      habit.progress = Math.round((todayEntries / habit.duration) * 100);
      habit.progress = Math.min(100, Math.max(0, habit.progress));
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Fortschritts:', error);
    }
  }

  async openAddHabitModal() {
    const modal = await this.modalCtrl.create({
      component: AddHabitPage,
      componentProps: {
        categories: this.categories
      }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.habits.push({
        ...data,
        id: crypto.randomUUID(),
        progress: 0,
        streak: 0,
        today_done: false,
        is_completed: false,
        entries: []
      });
      await this.saveHabits();
    }
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#000000';
  }

  updateDashboardStats() {
    this.streakDays = this.calculateMaxStreak();
    this.todayCompletionPercentage = this.calculateTodayProgress();
  }

  calculateMaxStreak(): number {
    if (!this.habits || this.habits.length === 0) return 0;
    return Math.max(...this.habits.map(habit => habit.streak || 0));
  }

  calculateTodayProgress(): number {
    if (!this.habits || this.habits.length === 0) return 0;
    
    const activeHabits = this.habits.filter(habit => !habit.is_completed);
    if (activeHabits.length === 0) return 0;

    const completedToday = activeHabits.filter(habit => habit.today_done).length;
    return Math.floor((completedToday / activeHabits.length) * 100);
  }
}
