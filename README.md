Esercito Italiano - Dienstgrad Organigramm

Eine moderne Webanwendung zur Visualisierung der Dienstgradhierarchie des italienischen Heeres. Das Projekt zeigt ein interaktives Organigramm mit PostgreSQL Backend und React Frontend.

📋 Inhalt
Über das Projekt

Screenshots

Funktionen

Technologien

Installation

Verwendung

Projektstruktur

API Endpoints

Entwicklung

Mitwirken

Lizenz

🎯 Über das Projekt
Dieses ITM-Projekt demonstriert eine vollständige Full-Stack Webanwendung mit:

Backend: Node.js/Express Server mit PostgreSQL Datenbank

Frontend: React mit TypeScript und modernem UI-Design

Datenbank: PostgreSQL mit hierarchischen Abfragen (WITH RECURSIVE)

Design: Italienisches Farbschema und responsive Benutzeroberfläche

Die Anwendung visualisiert die komplette Befehlshierarchie des italienischen Heeres - vom Soldaten bis zum General.

🖼️ Screenshots
![italitapng] (..\ITM\ItaliaSeite.png)

✨ Funktionen
📊 Interaktives Organigramm - Hierarchische Darstellung aller Dienstgrade

🎨 Italienisches Design - Farbgebung inspiriert von der italienischen Flagge

📱 Responsive Layout - Optimiert für Desktop, Tablet und Mobile

🔄 Echtzeit-Daten - Live-Abfrage der PostgreSQL Datenbank

📈 Statistiken - Übersicht der Dienstgrade nach Kategorien

⚡ Moderne Technologien - React, TypeScript, Vite, Express

🛠️ Technologien
Backend
Node.js - JavaScript Runtime

Express.js - Web Framework

PostgreSQL - Datenbank

pg - PostgreSQL Client für Node.js

CORS - Cross-Origin Resource Sharing

Frontend
React 18 - UI Library

TypeScript - Typensichere Entwicklung

Vite - Build Tool und Development Server

Axios - HTTP Client

CSS3 - Moderne Styling mit Grid und Flexbox

🚀 Installation
Voraussetzungen
Node.js 18 oder höher

PostgreSQL 15 oder höher

pgAdmin 4 (empfohlen)

1. Repository klonen
bash
git clone https://github.com/username/italienisches-heer.git
cd italienisches-heer
2. Datenbank einrichten
PostgreSQL starten

pgAdmin4 öffnen

Neue Datenbank erstellen: italienisches_heer

SQL Query aus backend/database.sql ausführen

3. Backend einrichten
bash
cd backend
npm install
4. Frontend einrichten
bash
cd frontend
npm install
5. Umgebungsvariablen konfigurieren
Backend server.js anpassen:

javascript
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'italienisches_heer',
    password: 'dein_postgres_passwort', // Hier anpassen!
    port: 5432,
});
💻 Verwendung
Entwicklung starten
bash
# Terminal 1 - Backend starten
cd backend
npm run dev

# Terminal 2 - Frontend starten  
cd frontend
npm run dev
Produktions-Build
bash
# Frontend builden
cd frontend
npm run build

# Backend starten
cd backend
npm start
URLs
Frontend: http://localhost:3000

Backend API: http://localhost:5000/api

📁 Projektstruktur
text
ITM/
├── backend/
│   ├── server.js          # Express Server
│   ├── package.json       # Backend Abhängigkeiten
│   └── database.sql       # Datenbank Schema & Daten
├── frontend/
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── services/      # API Services
│   │   ├── types/         # TypeScript Definitionen
│   │   └── App.tsx        # Hauptkomponente
│   ├── public/            # Statische Assets
│   └── package.json       # Frontend Abhängigkeiten
└── README.md
🔌 API Endpoints
GET /api/health
Health Check für Backend und Datenbank

json
{
  "success": true,
  "message": "Backend und PostgreSQL sind online",
  "timestamp": "2023-11-15T10:30:00.000Z"
}
GET /api/hierarchie
Hierarchische Dienstgrad-Daten

json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rang_name": "Generale",
      "rang_kategorie": "Generale",
      "rang_code": "OF-9",
      "level": 0
    }
  ],
  "count": 24
}
GET /api/statistiken
Statistiken nach Dienstgrad-Kategorien

json
{
  "success": true,
  "data": [
    {
      "rang_kategorie": "Generale",
      "anzahl": 4
    }
  ]
}
🛠️ Entwicklung
Backend Development
bash
cd backend
npm run dev  # Startet mit nodemon (Auto-Reload)
Frontend Development
bash
cd frontend  
npm run dev  # Vite Development Server
Code Quality
bash
# Frontend Linting
cd frontend
npm run lint

# TypeScript Compilation
npm run build
🤝 Mitwirken
Beiträge sind willkommen! So können Sie mitwirken:

Repository forken

Feature-Branch erstellen (git checkout -b feature/AmazingFeature)

Änderungen committen (git commit -m 'Add some AmazingFeature')

Branch pushen (git push origin feature/AmazingFeature)

Pull Request erstellen

Coding Standards
TypeScript für type safety

ESLint für code quality

Responsive Design Patterns

Accessibility best practices

📄 Lizenz
Dieses Projekt ist für Bildungszwecke im Rahmen des ITM-Unterrichts erstellt worden.

👥 Autor
Dein Name

GitHub: @username

Projekt-Link: https://github.com/username/italienisches-heer

🙏 Danksagung
Italienisches Heer für die Dienstgrad-Informationen

React und PostgreSQL Communities

Vite Team für das exzellente Build-Tool

