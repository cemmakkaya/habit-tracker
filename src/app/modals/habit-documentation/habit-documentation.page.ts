// src/app/modals/habit-documentation/habit-documentation.page.ts
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { VoiceRecorder } from 'capacitor-voice-recorder';

@Component({
  selector: 'app-habit-documentation',
  templateUrl: './habit-documentation.page.html',
  styleUrls: ['./habit-documentation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HabitDocumentationPage {
  @Input() habit: any;
  selectedType: 'text' | 'photo' | 'audio' = 'text';
  isRecording = false;
  audioRecorded = false;
  
  entry = {
    text: '',
    photoPath: '',
    audioUrl: ''
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    let data = null;
    
    switch(this.selectedType) {
      case 'text':
        data = { type: 'text', content: this.entry.text };
        break;
      case 'photo':
        data = { type: 'photo', content: this.entry.photoPath };
        break;
      case 'audio':
        data = { type: 'audio', content: this.entry.audioUrl };
        break;
    }
    
    if (data) {
      this.modalCtrl.dismiss(data, 'confirm');
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      
      if (image.base64String) {
        this.entry.photoPath = 'data:image/jpeg;base64,' + image.base64String;
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }

  async toggleRecording() {
    try {
      if (!this.isRecording) {
        const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
        if (!hasPermission) {
          await VoiceRecorder.requestAudioRecordingPermission();
        }
        await VoiceRecorder.startRecording();
        this.isRecording = true;
      } else {
        const recording = await VoiceRecorder.stopRecording();
        this.audioRecorded = true;
        this.entry.audioUrl = recording.value.recordDataBase64;
        this.isRecording = false;
      }
    } catch (error) {
      console.error('Error recording:', error);
      this.isRecording = false;
    }
  }

  canConfirm(): boolean {
    switch (this.selectedType) {
      case 'text':
        return this.entry.text.trim().length > 0;
      case 'photo':
        return !!this.entry.photoPath;
      case 'audio':
        return this.audioRecorded;
      default:
        return false;
    }
  }
}
