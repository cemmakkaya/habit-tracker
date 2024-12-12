import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
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
import { Preferences } from '@capacitor/preferences';

interface HabitEntry {
  date: Date;
  type: 'text' | 'image' | 'audio';
  content: string;
}

interface Habit {
  name: string;
  category: string;
  progress: number;
  streak: number;
  color: string;
  todayDone: boolean;
  entries: HabitEntry[];
  isCompleted?: boolean;
  
  // Neue Eigenschaften
  duration?: number;
  frequency?: 'daily' | 'weekly' | 'custom';
  customFrequency?: number;
  notifications?: boolean;
  notificationTime?: string;
}

interface DocumentationData {
  type: 'text' | 'image' | 'audio';
  content?: string;
  imagePath?: string;
  audioPath?: string;
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
  selectedSegment = 'all';
  
  habits: Habit[] = [
    { 
      name: 'Lesen', 
      category: 'Bildung', 
      progress: 60, 
      streak: 5,
      color: '#4CAF50',
      todayDone: false,
      entries: []
    },
    { 
      name: 'Sport', 
      category: 'Gesundheit', 
      progress: 80, 
      streak: 12,
      color: '#2196F3',
      todayDone: false,
      entries: []
    }
  ];

  constructor(private modalCtrl: ModalController, private alertController: AlertController) {
    
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
    await this.loadHabits();
  }

  async loadHabits() {
    try {
      const storedHabits = await Preferences.get({ key: 'habits' });
      if (storedHabits.value) {
        this.habits = JSON.parse(storedHabits.value);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  }

  async saveHabits() {
    try {
      await Preferences.set({
        key: 'habits',
        value: JSON.stringify(this.habits)
      });
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }

  getFilteredHabits(): Habit[] {
    switch(this.selectedSegment) {
      case 'inProgress':
        return this.habits.filter(habit => !habit.todayDone && !habit.isCompleted);
      case 'completed':
        return this.habits.filter(habit => habit.isCompleted);
      default:
        return this.habits.filter(habit => !habit.isCompleted);
    }
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
      console.error('Error opening habit details:', error);
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
            habit.isCompleted = true;
            await this.saveHabits();
          }
        }
      ]
    });
    await alert.present();
  }

  async toggleTodayDone(habit: Habit, event: Event) {
    try {
      event.stopPropagation();
  
      if (habit.todayDone) {
        // Bereits erledigt: Lösch-Bestätigung
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
                habit.todayDone = false;
                habit.streak = Math.max(0, habit.streak - 1);
                
                // Lösche den Eintrag für heute
                const today = new Date().toDateString();
                habit.entries = habit.entries.filter(entry => 
                  new Date(entry.date).toDateString() !== today
                );
                
                // Reduziere den Fortschritt um einen Schritt
                const progressStep = 100 / (habit.duration || 30);
                habit.progress = Math.round(Math.max(0, habit.progress - progressStep));
  
                await this.saveHabits();
              }
            }
          ]
        });
        await alert.present();
        return;
      }
      
      // Modal für Dokumentation öffnen
      const modal = await this.modalCtrl.create({
        component: HabitDocumentationPage,
        componentProps: {
          habit: habit
        },
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.5
      });
  
      await modal.present();
      const { data, role } = await modal.onWillDismiss<DocumentationData>();
  
      if (role === 'confirm' && data) {
        habit.todayDone = true;
        habit.streak++;
        
        if (!habit.entries) {
          habit.entries = [];
        }
        
        habit.entries.unshift({
          date: new Date(),
          type: data.type,
          content: data.type === 'text' ? data.content! : 
                  data.type === 'image' ? data.imagePath! :
                  data.audioPath!
        });
  
        // Rufe updateHabitProgress auf, um den Fortschritt schrittweise zu aktualisieren
        await this.updateHabitProgress(habit);
        await this.saveHabits();
      }
    } catch (error) {
      console.error('Error in toggleTodayDone:', error);
    }
  }

  async openAddHabitModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: AddHabitPage,
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.5
      });
  
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      
      if (role === 'confirm' && data) {
        const newHabit = {
          name: data.name,
          category: data.category,
          progress: 0,
          streak: 0,
          color: data.color, 
          todayDone: false,
          entries: [],
          isCompleted: false,
          duration: data.duration,
          frequency: data.frequency,
          customFrequency: data.customFrequency,
          notifications: data.notifications,
          notificationTime: data.notificationTime
        };
  
        // Fortschrittsberechnung basierend auf Dauer und Häufigkeit
        this.calculateInitialProgress(newHabit);
  
        this.habits.push(newHabit);
        await this.saveHabits();
      }
    } catch (error) {
      console.error('Error opening add habit modal:', error);
    }
  }

  calculateInitialProgress(habit: Habit) {
    switch(habit.frequency) {
      case 'daily':
        habit.progress = 0;
        break;
      case 'weekly':
        habit.progress = habit.customFrequency 
          ? Math.round((habit.customFrequency / 7) * 100)
          : 0;
        break;
      case 'custom':
        habit.progress = habit.customFrequency && habit.duration
          ? Math.round((habit.customFrequency / habit.duration) * 100)
          : 0;
        break;
      default:
        habit.progress = 0;
    }
  }

  async updateHabitProgress(habit: Habit) {
    try {
      // Überprüfen, ob die Gewohnheit eine Dauer hat
      if (!habit.duration) {
        habit.duration = 30; // Standardwert, falls nicht definiert
      }
  
      // Schrittweise Fortschrittsberechnung
      const progressStep = 100 / habit.duration;
      
      // Zähle die Einträge für den aktuellen Tag
      const today = new Date().toDateString();
      const todayEntries = habit.entries.filter(entry => 
        new Date(entry.date).toDateString() === today
      );
  
      // Erhöhe den Fortschritt um einen Schritt, wenn ein Eintrag existiert
      if (todayEntries.length > 0) {
        habit.progress = Math.round(Math.min(100, habit.progress + progressStep));
      }
  
      await this.saveHabits();
    } catch (error) {
      console.error('Error updating habit progress:', error);
    }
  }

  getCategoryColor(categoryName: string): string {
    const categories: Record<string, string> = {
      'Bildung': '#4CAF50',
      'Sport': '#2196F3',
      'Wellness': '#9C27B0'
    };
    return categories[categoryName] || '#000000';
  }
}
