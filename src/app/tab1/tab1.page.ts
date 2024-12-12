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
import { SupabaseService } from '../../services/supabase.service'; // Importieren Sie den Supabase-Service

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
  habits: any[] = [];
  categories: any[] = [];

  constructor(
    private modalCtrl: ModalController, 
    private alertController: AlertController,
    private supabaseService: SupabaseService // Fügen Sie den Supabase-Service hinzu
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
    try {
      await this.loadCategories();
      await this.loadHabits();
    } catch (error) {
      console.error('Fehler beim Laden:', error);
    }
  }

  async loadCategories() {
    try {
      this.categories = await this.supabaseService.getCategories();
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  }

  async loadHabits() {
    try {
      this.habits = await this.supabaseService.getHabits();
    } catch (error) {
      console.error('Fehler beim Laden der Gewohnheiten:', error);
    }
  }

  getFilteredHabits(): any[] {
    switch(this.selectedSegment) {
      case 'inProgress':
        return this.habits.filter(habit => !habit.today_done && !habit.is_completed);
      case 'completed':
        return this.habits.filter(habit => habit.is_completed);
      default:
        return this.habits.filter(habit => !habit.is_completed);
    }
  }

  async openHabitDetails(habit: any) {
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

  async completeHabit(habit: any, event: Event) {
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
              await this.supabaseService.updateHabit(habit.id, { is_completed: true });
              
              // Lokale Liste aktualisieren
              const index = this.habits.findIndex(h => h.id === habit.id);
              if (index !== -1) {
                this.habits[index].is_completed = true;
              }
            } catch (error) {
              console.error('Fehler beim Abschließen der Gewohnheit:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async toggleTodayDone(habit: any, event: Event) {
    try {
      event.stopPropagation();
  
      if (habit.today_done) {
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
                try {
                  // Eintrag löschen und Habit aktualisieren
                  await this.supabaseService.createHabitEntry(habit.id);
                  
                  const updatedHabit = await this.supabaseService.updateHabit(habit.id, {
                    today_done: false,
                    streak: Math.max(0, habit.streak - 1),
                    progress: Math.max(0, habit.progress - (100 / (habit.duration || 30)))
                  });

                  // Lokale Liste aktualisieren
                  const index = this.habits.findIndex(h => h.id === habit.id);
                  if (index !== -1) {
                    this.habits[index] = updatedHabit[0];
                  }
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
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm' && data) {
        try {
          // Habit-Eintrag erstellen
          await this.supabaseService.createHabitEntry({
            habit_id: habit.id,
            type: data.type,
            content: data.type === 'text' ? data.content :
                    data.type === 'image' ? data.imagePath :
                    data.audioPath
          });

          // Habit aktualisieren
          const updatedHabit = await this.supabaseService.updateHabit(habit.id, {
            today_done: true,
            streak: (habit.streak || 0) + 1,
            progress: Math.min(100, (habit.progress || 0) + (100 / (habit.duration || 30)))
          });

          // Lokale Liste aktualisieren
          const index = this.habits.findIndex(h => h.id === habit.id);
          if (index !== -1) {
            this.habits[index] = updatedHabit[0];
          }
        } catch (error) {
          console.error('Fehler beim Erstellen des Eintrags:', error);
        }
      }
    } catch (error) {
      console.error('Fehler in toggleTodayDone:', error);
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
        try {
          // Neue Gewohnheit in Supabase erstellen
          const newHabit = await this.supabaseService.createHabit({
            name: data.name,
            category: data.category,
            color: data.color,
            duration: data.duration,
            frequency: data.frequency,
            custom_frequency: data.customFrequency,
            notifications: data.notifications,
            notification_time: data.notificationTime,
            progress: 0,
            streak: 0,
            today_done: false,
            is_completed: false
          });

          // Lokale Liste aktualisieren
          this.habits.push(newHabit[0]);
        } catch (error) {
          console.error('Fehler beim Erstellen der Gewohnheit:', error);
        }
      }
    } catch (error) {
      console.error('Fehler beim Öffnen des Habit-Modals:', error);
    }
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#000000';
  }
}
