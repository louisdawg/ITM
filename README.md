Esercito Italiano - Dienstgrad Organigramm
==========================================

Eine moderne Webanwendung zur Visualisierung der Dienstgradhierarchie des italienischen Heeres. Das Projekt zeigt ein interaktives Organigramm mit PostgreSQL Backend und React Frontend.

🎯 Über das Projekt
-------------------

Dieses ITM-Projekt demonstriert eine vollständige Full-Stack Webanwendung mit:

*   Backend: Node.js/Express Server mit PostgreSQL Datenbank
    
*   Frontend: React mit TypeScript und modernem UI-Design
    
*   Datenbank: PostgreSQL mit hierarchischen Abfragen (WITH RECURSIVE)
    
*   Design: Italienisches Farbschema und responsive Benutzeroberfläche

🛠️ Technologien
----------------

### Backend

*   Node.js - JavaScript Runtime
    
*   Express.js - Web Framework
    
*   PostgreSQL - Datenbank
    
*   pg - PostgreSQL Client für Node.js
    
*   CORS - Cross-Origin Resource Sharing
    

### Frontend

*   React 18 - UI Library
    
*   TypeScript - Typensichere Entwicklung
    
*   Vite - Build Tool und Development Server
    
*   Axios - HTTP Client
    
*   CSS3 - Moderne Styling mit Grid und Flexbox
    

🚀 Installation
---------------

### Voraussetzungen

*   Node.js 18 oder höher
    
*   PostgreSQL 15 oder höher
    
*   pgAdmin 4 (empfohlen)
    

### 1. Repository klonen

```bash
git clone https://github.com/louisdawg/ITM
cd ITM
```

### 2. Datenbank einrichten

# Datenbank erstellen und Schema importieren
```bash
psql -U postgres -c "CREATE DATABASE italienisches_heer;" && psql -U postgres -d italienisches_heer -f schema.sql
```
    

### 3. Backend einrichten

```bash
cd backend
npm install
```

### 4. Frontend einrichten

```bash
cd frontend
npm install
```

### 5. Umgebungsvariablen konfigurieren

Backend `server.js` anpassen:

```javascript

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'italienisches_heer',
    password: '123', // Hier bitte ändern
    port: 5432,
});
```

💻 Verwendung
-------------

### Entwicklung starten

```bash

# Terminal 1 - Backend starten
cd backend
node server.js

# Terminal 2 - Frontend starten 
cd frontend
npm run build
```

### Produktions-Build

```bash
# Frontend builden
cd frontend
npm run build

# Backend starten
cd backend
npm start
```

### URLs

*   Frontend: [http://localhost:3000](http://localhost:3000/)
    
*   Backend API: [http://localhost:5000/api](http://localhost:5000/api)
    

📁 Projektstruktur
------------------

```

ITM/
├── backend/
│   ├── server.js          # Express Server
│   ├── package.json       # Backend Abhängigkeiten
│   └── schema.sql       # Datenbank Schema & Daten
├── frontend/
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── services/      # API Services
│   │   ├── types/         # TypeScript Definitionen
│   │   └── App.tsx        # Hauptkomponente
│   ├── public/            # Statische Assets
│   └── package.json       # Frontend Abhängigkeiten
└── README.md
```

🔌 API Endpoints
----------------

### GET /api/health

Health Check für Backend und Datenbank

```json

{
  "success": true,
  "message": "Backend und PostgreSQL sind online",
  "timestamp": "2023-11-15T10:30:00.000Z"
}

```

### GET /api/hierarchie

Hierarchische Dienstgrad-Daten

```json

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

```

### GET /api/statistiken

Statistiken nach Dienstgrad-Kategorien

```json

{
  "success": true,
  "data": [
    {
      "rang_kategorie": "Generale",
      "anzahl": 4
    }
  ]
}
```

🛠️ Entwicklung
---------------

### Backend Development

```bash
cd backend
npm run dev  \# Startet mit nodemon (Auto-Reload)
```

### Frontend Development

```bash
cd frontend  
npm run dev  \# Vite Development Server
```

### Code Quality

```bash
\# Frontend Linting
cd frontend
npm run lint

\# TypeScript Compilation
npm run build
```


### Coding Standards

*   TypeScript für type safety
    
*   ESLint für code quality
    
*   Responsive Design Patterns
    
*   Accessibility best practices
    

📄 Lizenz
---------

Dieses Projekt ist für Bildungszwecke im Rahmen des ITM-Unterrichts erstellt worden.

👥 Autor
--------

*   Louis und Emil
    
*   Projekt-Link: [https://github.com/louisdawg/ITM](https://github.com/louisdawg/ITM)
