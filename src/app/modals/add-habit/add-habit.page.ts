import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.page.html',
  styleUrls: ['./add-habit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddHabitPage implements OnInit {
  categories: any[] = [];
  
  habitName: string = '';
  category: string = '';

  selectedCategory: any = null;
  color: string = '#4CAF50';
  
  duration: number = 30;
  frequency: 'daily' | 'weekly' | 'custom' = 'daily';
  customFrequency: number = 1;
  
  notifications: boolean = false;
  notificationTime: string = '08:00';

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.supabaseService.getCategories();
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  }

  openAddCategoryPage() {
    this.openNewCategoryModal();
  }

  async openNewCategoryModal() {
    const alert = await this.alertController.create({
      header: 'Neue Kategorie',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Kategorienname'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Erstellen',
          handler: async (data) => {
            if (data.categoryName) {
              try {
                const newCategory = await this.supabaseService.createCategory({
                  name: data.categoryName,
                  color: this.generateRandomColor()
                });
                this.categories.push(newCategory[0]);
                this.selectCategory(newCategory[0]);
              } catch (error) {
                console.error('Fehler beim Erstellen der Kategorie:', error);
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.color = category.color;
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  isFormValid(): boolean {
    return !!this.habitName && 
           !!this.selectedCategory && 
           this.duration > 0;
  }

  confirm() {
    if (this.isFormValid()) {
      const habitData = {
        name: this.habitName,
        category: this.selectedCategory.id,
        color: this.color,
        duration: this.duration,
        frequency: this.frequency,
        custom_frequency: this.customFrequency,
        notifications: this.notifications,
        notification_time: this.notifications ? this.notificationTime : null
      };
      
      this.modalCtrl.dismiss(habitData, 'confirm');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
