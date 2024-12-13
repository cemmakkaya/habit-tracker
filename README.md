# HabitTracker - Ionic Angular App

[![Ionic Version](https://img.shields.io/badge/Ionic-7.0.0-blue.svg)](http://ionicframework.com/)
[![Angular Version](https://img.shields.io/badge/Angular-17.0.0-red.svg)](https://angular.io/)
[![Capacitor Version](https://img.shields.io/badge/Capacitor-5.0.0-blue.svg)](https://capacitorjs.com/)

## 📱 Über das Projekt

HabitTracker ist eine von Cem Akkaya mobile Applikation, welche es einem erleichtert leichter durchs Leben zu kommen. Mit dem MyHabitTracker, lassen sich Gewohnheiten einfach und diszipliniert regelmässig ausführen.

## ✨ Features

- 📋 Erstellen und Verwalten von Gewohnheiten
- 🏷️ Kategorisierung von Gewohnheiten
- 📊 Fortschrittsverfolgung
- 🔔 Tägliche Erinnerungen
- 📈 Detaillierte Statistiken
- 🌓 Dark Mode
- 💾 Lokale Datenspeicherung

## 🛠️ Voraussetzungen

- Node.js (Version 16 oder höher)
- npm (kommt mit Node.js)
- Ionic CLI
- Angular CLI
- Code-Editor (empfohlen: Visual Studio Code)

## 🚀 Installation & Setup

### Node.js und npm installieren
```bash
# Version überprüfen
node --version
npm --version
```

### Ionic CLI installieren
```bash
npm install -g @ionic/cli
```

### Projekt klonen und installieren
```bash
git clone [repository-url]
cd habit-tracker
npm install
```

### Capacitor einrichten
```bash
npm install @capacitor/core
npm install @capacitor/cli --save-dev
npx cap init
```

### Erforderliche Plugins installieren
```bash
npm install @capacitor/preferences
npm install @capacitor/camera
npm install capacitor-voice-recorder
npx cap sync
```

## 🏃‍♂️ Projekt starten

### Entwicklungsserver
```bash
ionic serve
```

### Native Builds

```bash
# Android
ionic build
npx cap add android
npx cap open android

# iOS
ionic build
npx cap add ios
npx cap open ios
```

## 🔧 Troubleshooting

### Weißer Bildschirm nach Start
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Capacitor Plugin Synchronisation
```bash
npx cap sync
```

## 📁 Projektstruktur

```
habit-tracker/
├── src/
│   ├── app/
│   │   ├── modals/
│   │   ├── services/
│   │   └── tabs/
│   ├── assets/
│   └── theme/
├── www/
├── android/
├── ios/
└── capacitor.config.ts
```

## 📱 App Icons & Splash Screens

1. Platziere die Bilder in `resources/`:
   - `icon.png` (1024x1024px)
   - `splash.png` (2732x2732px)

2. Generiere Assets:
```bash
npm install @capacitor/assets
npx @capacitor/assets generate
```

## 🛡️ Umgebungsvariablen

Environment Variablen:
```
supabaseUrl: 'https://akkiiqzddncczhwxnagl.supabase.co',
supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFra2lpcXpkZG5jY3pod3huYWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMDY3NzIsImV4cCI6MjA0OTU4Mjc3Mn0.oqwxR2pR75fMHFhURTgMw4mizWgRfxd0GVcxOUqfMrE',
```

## 📦 Abhängigkeiten

Hauptabhängigkeiten:
- @ionic/angular
- @capacitor/core
- @capacitor/preferences
- @capacitor/camera
- capacitor-voice-recorder

## Ersteller

Cem Akkaya - cem.akkaya@bbzbl-it.ch

Projekt Link: https://github.com/cemmakkaya/habit-tracker


