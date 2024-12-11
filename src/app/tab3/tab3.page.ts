// src/app/tab3/tab3.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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

  async ngOnInit() {
    await this.loadSettings();
    document.body.classList.toggle('dark', this.settings.darkMode);
  }

  async toggleNotifications(event: any) {
    this.settings.notifications = event.detail.checked;
    await this.saveSettings();
  }

  async toggleHaptics(event: any) {
    this.settings.haptics = event.detail.checked;
    await this.saveSettings();
  }

  async toggleDarkMode(event: any) {
    const isDark = event.detail.checked;
    document.body.classList.toggle('dark', isDark);
    this.settings.darkMode = isDark;
    await this.saveSettings();
  }

  async resetApp() {
    await Preferences.clear();
    this.settings = {
      notifications: true,
      darkMode: false,
      haptics: true,
      reminderTime: '09:00',
      language: 'de'
    };
    await this.saveSettings();
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