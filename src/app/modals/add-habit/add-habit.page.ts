import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCategoryPage } from '../add-category/add-category.page';

@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.page.html',
  styleUrls: ['./add-habit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddHabitPage {
  habit = {
    name: '',
    category: '',
    target: ''
  };

  categories = [
    { name: 'Bildung', color: '#4CAF50' },
    { name: 'Sport', color: '#2196F3' },
    { name: 'Wellness', color: '#9C27B0' }
  ];

  constructor(private modalCtrl: ModalController) {}

  async openCategoryModal() {
    if (this.habit.category === 'new') {
      const modal = await this.modalCtrl.create({
        component: AddCategoryPage,
        breakpoints: [0, 0.5, 0.8],
        initialBreakpoint: 0.5
      });
  
      await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm' && data) {
        this.categories.push(data);
        this.habit.category = data.name;
      }
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.modalCtrl.dismiss(this.habit, 'confirm');
  }
}
