# Programm Analyse 2025

Dieses Projekt analysiert und visualisiert Textdaten politischer Parteien und deren offiziellen Programme 2025, zu diesem Zeitpunkt umfasst es die folgenden: AfD, Union, SPD, die Gruenen, FDP. Es verwendet Python für die Datenverarbeitung und TypeScript/React für die Frontend-Visualisierung.

## Komponenten

### 1. classes.py
Enthält grundlegende Klassen und Modelle, die für die Verarbeitung und Analyse der Daten verwendet werden.

### 2. main.py
Der Einstiegspunkt für die Datenverarbeitung. Hier werden die Daten aus combined_data.json geladen, analysiert und für das Frontend vorbereitet.

### 3. combined_data.json
Eine JSON-Datei mit aggregierten Daten zu politischen Parteien. Enthält Informationen wie Textlänge, Sentiment-Analyse, Lesbarkeitsmetriken und Schlagwörter.

### 4. PartyDashboard.tsx
Ein React-Komponenten-Dashboard zur Visualisierung der analysierten Daten. Zeigt wichtige Statistiken und Diagramme an, die aus den JSON-Daten generiert wurden.

## Beispielhaft: Features

- **Sentiment-Analyse**: Durchschnittliche, maximale und minimale Sentiment-Werte für jede Partei.
- **Lesbarkeitsmetriken**: Durchschnittliche Satzlänge, Wortlänge und Silbenanzahl.
- **Vokabular-Analyse**: Einzigartige Wörter, Typ-Token-Verhältnis und Hapaxlegomena.
- **Politikfokus**: Prozentuale Verteilung auf Themen wie Wirtschaft, Umwelt, Soziales, Bildung und Sicherheit.
- **Interaktives Dashboard**: Visualisiert Daten mit React und TypeScript.

## Installation und Start

### Frontend-Installation

1. Stelle sicher, dass Node.js und npm auf deinem System installiert sind. Du kannst dies überprüfen mit:
```bash
node --version
npm --version
```
2. Navigiere in das Projektverzeichnis:
```bash
cd wahl2025
```

3. Installiere alle notwendigen Dependencies:
```bash
npm install
```

### Start

Durch das folgende kannst du das Projekt dann lokal starten:
```bash
npm run dev
```