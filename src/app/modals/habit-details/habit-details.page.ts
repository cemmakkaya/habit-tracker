import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

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
    private supabaseService: SupabaseService
  ) {}

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
}
