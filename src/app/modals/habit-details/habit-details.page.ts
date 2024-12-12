import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  flame, 
  musicalNote, 
  play,
  ellipsisHorizontal,
  trash,
  create
} from 'ionicons/icons';

@Component({
  selector: 'app-habit-details',
  templateUrl: './habit-details.page.html',
  styleUrls: ['./habit-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HabitDetailsPage implements OnInit {
  @Input() habit: any;
  
  selectedSegment: 'entries' | 'stats' = 'entries';
  entries: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      flame,
      'musical-note': musicalNote,
      play,
      'ellipsis-horizontal': ellipsisHorizontal,
      trash,
      create
    });
  }

  async ngOnInit() {
    if (this.habit && this.habit.id) {
      await this.loadEntries();
    } else {
      console.error('Keine Habit-ID gefunden');
    }
  }

  async loadEntries() {
    try {
      this.entries = await this.supabaseService.getHabitEntries(this.habit.id);
      console.log('Geladene Einträge:', this.entries);
    } catch (error) {
      console.error('Fehler beim Laden der Einträge:', error);
      // Optional: Zeigen Sie eine Fehlermeldung an
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getProgressColor(): string {
    if (this.habit.progress < 30) return 'danger';
    if (this.habit.progress < 70) return 'warning';
    return 'success';
  }

  async editEntry(entry: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Eintrag bearbeiten',
      inputs: [
        {
          name: 'content',
          type: 'text',
          value: entry.content,
          placeholder: 'Eintrag'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Speichern',
          handler: async (data) => {
            try {
              entry.content = data.content;
              await this.saveEntries();
              this.loadEntries();
            } catch (error) {
              console.error('Fehler beim Bearbeiten des Eintrags:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteEntry(entry: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Eintrag löschen',
      message: 'Möchten Sie diesen Eintrag wirklich löschen?',
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
              const index = this.entries.indexOf(entry);
              if (index > -1) {
                this.entries.splice(index, 1);
              }
              await this.saveEntries();
              this.loadEntries();
            } catch (error) {
              console.error('Fehler beim Löschen des Eintrags:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async saveEntries() {
    // Implementieren Sie hier die Speicherlogik
  }
}
