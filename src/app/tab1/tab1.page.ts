import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
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

  constructor(private modalCtrl: ModalController) {
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
        return this.habits.filter(habit => !habit.todayDone);
      case 'completed':
        return this.habits.filter(habit => habit.todayDone);
      default:
        return this.habits;
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

  async toggleTodayDone(habit: Habit, event: Event) {
    try {
      event.stopPropagation();
      
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
        this.habits.push({
          name: data.name,
          category: data.category,
          progress: 0,
          streak: 0,
          color: data.color, 
          todayDone: false,
          entries: []
        });
        await this.saveHabits();
      }
    } catch (error) {
      console.error('Error opening add habit modal:', error);
    }
  }

  async updateHabitProgress(habit: Habit) {
    try {
      const today = new Date();
      const recentEntries = habit.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === today.toDateString();
      });
      
      habit.progress = recentEntries.length > 0 ? 100 : 0;
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
