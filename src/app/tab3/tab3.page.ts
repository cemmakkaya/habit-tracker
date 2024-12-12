import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements OnInit {
  settings = {
    notifications: true,
    darkMode: false,
    haptics: true,
    reminderTime: '09:00',
    language: 'de'
  };

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadSettings();
    this.applyDarkMode();
  }

  async toggleNotifications(event: any) {
    this.settings.notifications = event.detail.checked;
    await this.saveSettings();
  }

  async toggleHaptics(event: any) {
    this.settings.haptics = event.detail.checked;
    await this.saveSettings();
  }

  applyDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }  

  async toggleDarkMode(event: any) {
    this.settings.darkMode = event.detail.checked;
    this.applyDarkMode(); 
    await this.saveSettings();
  }

  async resetApp() {
    const alert = await this.alertController.create({
      header: 'App zurücksetzen',
      message: 'Möchten Sie wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Zurücksetzen',
          role: 'destructive',
          handler: async () => {
            try {
              await Preferences.clear();
              
              this.settings = {
                notifications: true,
                darkMode: false,
                haptics: true,
                reminderTime: '09:00',
                language: 'de'
              };
              
              await this.saveSettings();
         
              const toast = await this.toastController.create({
                message: 'App wurde erfolgreich zurückgesetzt',
                duration: 2000,
                color: 'success'
              });
              await toast.present();

              window.location.reload();
            } catch (error) {
              console.error('Fehler beim Zurücksetzen:', error);
              const errorToast = await this.toastController.create({
                message: 'Fehler beim Zurücksetzen der App',
                duration: 2000,
                color: 'danger'
              });
              await errorToast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async saveSettings() {
    await Preferences.set({
      key: 'settings',
      value: JSON.stringify(this.settings)
    });
  }

  async loadSettings() {
    const { value } = await Preferences.get({ key: 'settings' });
    if (value) {
      this.settings = JSON.parse(value);
    }
  }
}
