import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-habit-documentation',
  templateUrl: './habit-documentation.page.html',
  styleUrls: ['./habit-documentation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HabitDocumentationPage {
  @Input() habit: any;
  
  selectedType: 'text' | 'image' | 'audio' = 'text';
  
  entry = {
    text: '',
    imagePath: '',
  };

  constructor(private modalCtrl: ModalController) {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      
      this.entry.imagePath = image.base64String 
        ? `data:image/jpeg;base64,${image.base64String}` 
        : '';
    } catch (error) {
      console.error('Fehler beim Aufnehmen des Fotos:', error);
    }
  }

  canConfirm(): boolean {
    switch(this.selectedType) {
      case 'text':
        return !!this.entry.text.trim();
      case 'image':
        return !!this.entry.imagePath;
      case 'audio':
        return false; // Implementieren Sie Audio-Aufnahme
      default:
        return false;
    }
  }

  confirm() {
    if (this.canConfirm()) {
      const data = {
        type: this.selectedType,
        content: this.selectedType === 'text' ? this.entry.text :
                 this.selectedType === 'image' ? this.entry.imagePath :
                 this.entry.audioPath
      };
      
      this.modalCtrl.dismiss(data, 'confirm');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
