// tab3/tab3.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page {
  settings = {
    notifications: true,
    darkMode: false,
    haptics: true,
    reminderTime: '09:00',
    language: 'de'
  };

  appInfo = {
    version: '',
    name: ''
  };

  constructor() {
    this.loadSettings();
    this.getAppInfo();
  }

  async toggleNotifications(event: any) {
    const permitted = await LocalNotifications.requestPermissions();
    if (permitted) {
      this.settings.notifications = event.detail.checked;
      await this.saveSettings();
      this.triggerHaptic();
    }
  }

  async toggleHaptics(event: any) {
    this.settings.haptics = event.detail.checked;
    await this.saveSettings();
    if (this.settings.haptics) {
      await this.triggerHaptic();
    }
  }

  async triggerHaptic() {
    if (this.settings.haptics) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  async getAppInfo() {
    const info = await App.getInfo();
    this.appInfo = info;
  }

  async loadSettings() {
    const settings = await Storage.get({ key: 'settings' });
    if (settings.value) {
      this.settings = JSON.parse(settings.value);
    }
  }

  async saveSettings() {
    await Storage.set({
      key: 'settings',
      value: JSON.stringify(this.settings)
    });
  }

  async resetApp() {
    await Storage.clear();
    this.settings = {
      notifications: true,
      darkMode: false,
      haptics: true,
      reminderTime: '09:00',
      language: 'de'
    };
    await this.saveSettings();
    this.triggerHaptic();
  }
}
