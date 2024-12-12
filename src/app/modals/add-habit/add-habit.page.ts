import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.page.html',
  styleUrls: ['./add-habit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddHabitPage implements OnInit {
  categories: any[] = []; 
  selectedCategory: any; 
  
  habitName: string = '';
  color: string = '#4CAF50';
  
  duration: number = 30;
  frequency: 'daily' | 'weekly' | 'custom' = 'daily';
  customFrequency: number = 1;
  
  notifications: boolean = false;
  notificationTime: string = '08:00';

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadCategories();
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
                const newCategory = {
                  name: data.categoryName,
                  color: this.generateRandomColor()
                };
                
                await this.storeCategories([...this.categories, newCategory]);
                this.selectCategory(newCategory);
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

  async storeCategories(categories: any[]) {
    try {
      await Preferences.set({
        key: 'categories',
        value: JSON.stringify(categories)
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorien:', error);
    }
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

  async confirm() {
    if (this.isFormValid()) {
      const habitData = {
        name: this.habitName,
        category: this.selectedCategory.name,
        color: this.color,
        duration: this.duration,
        frequency: this.frequency,
        customFrequency: this.customFrequency,
        notifications: this.notifications,
        notificationTime: this.notifications ? this.notificationTime : null
      };

      this.modalCtrl.dismiss(habitData, 'confirm');
    } else {
      this.showValidationError();
    }
  }

  private async showValidationError() {
    const toast = await this.toastController.create({
      message: 'Bitte füllen Sie alle erforderlichen Felder aus.',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
