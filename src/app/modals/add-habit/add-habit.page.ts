import { Component } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddCategoryPage } from '../add-category/add-category.page';

@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.page.html',
  styleUrls: ['./add-habit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddHabitPage {
  public habitName: string = '';
  public category: string = '';
  public color: string = '#4CAF50';
  
  public duration: number = 30;
  public frequency: 'daily' | 'weekly' | 'custom' = 'daily';
  public customFrequency: number = 1;
  
  public notifications: boolean = false;
  public notificationTime: string = '08:00';
  
  public categories = [
    { name: 'Bildung', color: '#4CAF50' },
    { name: 'Gesundheit', color: '#2196F3' },
    { name: 'Wellness', color: '#9C27B0' },
    { name: 'Produktivität', color: '#FF9800' }
  ];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router
  ) {}

  public selectCategory(cat: { name: string, color: string }): void {
    this.category = cat.name;
    this.color = cat.color;
  }

  public navigateToCategories() {
    this.modalCtrl.dismiss(); // Schließt das aktuelle Modal
    this.router.navigate(['/tabs/categories']); // Navigiert zur Kategorien-Seite
  }

  public async openNewCategoryModal() {
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
          handler: (data) => {
            if (data.categoryName) {
              this.createNewCategory(data.categoryName);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private createNewCategory(name: string) {
    const randomColor = this.generateRandomColor();
    
    const newCategory = { 
      name: name, 
      color: randomColor 
    };

    this.categories.push(newCategory);
    this.selectCategory(newCategory);
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public isFormValid(): boolean {
    return !!this.habitName && 
           !!this.category && 
           this.duration > 0;
  }

  public confirm(): void {
    if (this.isFormValid()) {
      const habitData = {
        name: this.habitName,
        category: this.category,
        color: this.color,
        duration: this.duration,
        frequency: this.frequency,
        customFrequency: this.customFrequency,
        notifications: this.notifications,
        notificationTime: this.notifications ? this.notificationTime : null
      };
      this.modalCtrl.dismiss(habitData, 'confirm');
    }
  }

  public dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  public openAddCategoryPage() {
    this.modalCtrl.dismiss(); // Schließt das aktuelle Modal
    this.modalCtrl.create({
      component: AddCategoryPage,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    }).then(modal => modal.present());
  }
}

