// src/app/modals/add-category/add-category.page.ts
import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddCategoryPage {
  category = {
    name: '',
    color: '#4CAF50'
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.category.name.trim()) {
      this.modalCtrl.dismiss(this.category, 'confirm');
    }
  }
}