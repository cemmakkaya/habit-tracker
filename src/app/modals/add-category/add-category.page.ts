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
    color: ''
  };

  colors = [
    '#F3FF33', // Gelb
    '#FF8C33', // Orange
    '#ee2c2c', // Rot
    '#FF33FF', // Magenta
    '#FF33A8', // Pink
    '#8A33FF', // Lila
    '#3357FF', // Blau
    '#33FFF3', // Türkis
    '#33FF57', // Grün
    '#8AFF33', // Hellgrün
  ];

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.category.name.trim()) {
      this.modalCtrl.dismiss(this.category, 'confirm');
    }
  }

  selectColor(color: string) {

    this.category.color = color;

  }
}