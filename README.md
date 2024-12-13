Habit Tracker - Ionic Angular App

Projektbeschreibung
Eine mobile Anwendung zur Verfolgung und Verwaltung von Gewohnheiten, entwickelt mit Ionic und Angular. Die App ermöglicht es Benutzern, Gewohnheiten zu erstellen, zu verfolgen und deren Fortschritt zu überwachen.
Funktionen

Erstellen und Verwalten von Gewohnheiten
Kategorisierung von Gewohnheiten
Fortschrittsverfolgung
Tägliche Erinnerungen
Detaillierte Statistiken
Dark Mode
Lokale Datenspeicherung

Voraussetzungen

Node.js (Version 16 oder höher)
npm (kommt mit Node.js)
Ionic CLI
Angular CLI
Ein Code-Editor (z.B. Visual Studio Code)

Installation

Node.js und npm installieren

Lade Node.js von nodejs.org herunter und installiere es
Überprüfe die Installation:
bashCopynode --version
npm --version



Ionic CLI installieren
bashCopynpm install -g @ionic/cli

Projekt klonen
bashCopygit clone [repository-url]
cd habit-tracker

Abhängigkeiten installieren
bashCopynpm install

Capacitor installieren und einrichten
bashCopynpm install @capacitor/core
npm install @capacitor/cli --save-dev
npx cap init

Erforderliche Capacitor-Plugins installieren
bashCopynpm install @capacitor/preferences
npm install @capacitor/camera
npm install capacitor-voice-recorder
npx cap sync


Projekt starten
Entwicklungsserver
bashCopyionic serve
Native Builds
Android
bashCopyionic build
npx cap add android
npx cap open android
iOS
bashCopyionic build
npx cap add ios
npx cap open ios
Bekannte Probleme und Lösungen
Problem: Weiße Seite nach dem Start
Lösung: Cache und node_modules löschen und neu installieren
bashCopyrm -rf node_modules
npm cache clean --force
npm install
Problem: Capacitor Plugins nicht gefunden
Lösung: Plugins neu synchronisieren
bashCopynpx cap sync
Projektstruktur
Copyhabit-tracker/
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
Entwicklungshinweise
Lokale Datenbank
Die App verwendet Capacitor Preferences für die lokale Datenspeicherung. Stellen Sie sicher, dass die entsprechenden Berechtigungen vorhanden sind.
Icons und Splash Screens
Platzieren Sie Ihre Icons im resources/ Ordner:

icon.png (mindestens 1024x1024px)
splash.png (mindestens 2732x2732px)

Generieren Sie die Assets mit:
bashCopynpm install @capacitor/assets
npx @capacitor/assets generate
