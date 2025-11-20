Esercito Italiano – Organigramm
===============================

Eine interaktive Visualisierung der Organisationsstruktur des Italienischen Heeres (Esercito Italiano) mit hierarchischem Baumdiagramm.

Inhaltsverzeichnis
------------------

*   Überblick
    
*   Screenshots
    
*   Installation
    
*   Verwendung
    
*   API-Referenz
    
*   Datenbank
    
*   Fehlerbehebung
    
*   Entwicklung
    
*   Mitwirken
    
*   Lizenz
    

Überblick
---------

Dieses Projekt zeigt die militärische Organisationsstruktur des Esercito Italiano in einer interaktiven React- und SVG-basierten Visualisierung. Die Daten werden aus einer PostgreSQL-Datenbank geladen und als zoombare, hierarchische Baumstruktur dargestellt.

Installation
------------

### Voraussetzungen

*   Node.js (v16 oder höher)
    
*   npm oder yarn
    
*   PostgreSQL (v12 oder höher)
    

### Schritt-für-Schritt Installation

1.  Repository klonen
    
    ```bash
    git clone https://github.com/louisdawg/ITM.git
    cd ITM
    ```
    
2.  PostgreSQL Datenbank einrichten
    
    Datenbank erstellen:
    
    Windows PowerShell:
    
    ```powershell
    # PostgreSQL Service starten (falls nicht läuft)
    Start-Service postgresql-x64-15
    
    # Datenbank erstellen
    createdb -U postgres italienisches_heer
    ```
    
    Windows CMD:
    
    ```cmd
    # PostgreSQL Service starten (falls nicht läuft)
    net start postgresql-x64-15
    
    # Datenbank erstellen
    createdb -U postgres italienisches_heer
    ```
    
    Linux/Mac Terminal:
    
    ```bash
    # PostgreSQL Service starten
    sudo systemctl start postgresql
    
    # Datenbank erstellen
    sudo -u postgres createdb italienisches_heer
    ```
    
3.  Datenbank-Schema einrichten
    
    Windows PowerShell:
    
    ```powershell
    psql -U postgres -d italienisches_heer -f backend/schema.sql
    ```
    
    Windows CMD:
    
    ```cmd
    psql -U postgres -d italienisches\_heer -f backend/schema.sql
    ```
    
    Linux/Mac Terminal:
    
    ```bash
    sudo -u postgres psql -d italienisches_heer -f backend/schema.sql
    ```
    
4.  Backend konfigurieren
    
    Die Datenbankverbindung kann in `backend/server.js` angepasst werden:
    
    ```javascript
    
    const pool \= new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'italienisches_heer',
      password: '123',  // Hier anpassen
      port: 5432,
    });
    ```
    
5.  Abhängigkeiten installieren
    
    Backend:
    
    ```bash
    cd backend
    npm install
    ```
    
    Frontend:
    
    ```bash
    cd frontend
    npm install
    ```
    
Verwendung
----------

### Entwicklungsumgebung starten

1.  Backend starten
    
    ```bash
    cd backend
    node server.js
    
    Server läuft auf `http://localhost:5000`
    ```
    
2.  Frontend starten
    
    ```bash
    cd frontend
    npm run dev
    
    Frontend ist erreichbar unter `http://localhost:3000`
    ```
    

### Produktions-Build erstellen

```bash
cd frontend
npm run build
```

API-Referenz
------------

### GET /api/organisation

Gibt die hierarchische Organisationsstruktur zurück.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Stato Maggiore dell'Esercito",
      "type": "Oberkommando",
      "level": 0,
      "branch_name": "Esercito Italiano",
      "personnel_count": 2,
      "location": "Rom"
    }
  ]
}
```

### GET /api/units

Gibt alle militärischen Einheiten zurück.

### GET /api/branches

Gibt alle Teilstreitkräfte zurück.

### GET /api/personnel/:unitId

Gibt das Personal einer bestimmten Einheit zurück.

### GET /api/health

Health-Check der API.

Datenbank
---------

### Schema

Die PostgreSQL-Datenbank enthält drei Haupttabellen:

#### Branch

Speichert die Teilstreitkräfte.

```sql
CREATE TABLE Branch (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);
```

#### Unit

Speichert die militärischen Einheiten mit hierarchischer Struktur.

```sql
CREATE TABLE Unit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    parent_unit_id INTEGER,
    branch_id INTEGER NOT NULL,
    location VARCHAR(255),
    founded_year INTEGER,
    FOREIGN KEY (parent_unit_id) REFERENCES Unit(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES Branch(id) ON DELETE CASCADE
);
```

#### Personnel

Speichert das Personal mit Dienstgraden.

```sql
CREATE TABLE Personnel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rank VARCHAR(100) NOT NULL,
    rang_code VARCHAR(10) NOT NULL,
    position VARCHAR(255) NOT NULL,
    unit_id INTEGER NOT NULL,
    service_number VARCHAR(50),
    FOREIGN KEY (unit_id) REFERENCES Unit(id) ON DELETE CASCADE
);
```

### Datenbank zurücksetzen

Um die Datenbank komplett neu aufzusetzen:

1.  Datenbank löschen:
    
    ```bash
    dropdb -U postgres italienisches_heer
    ```
    
2.  Neu erstellen und befüllen:
    
    ```bash
    createdb -U postgres italienisches_heer
    psql -U postgres -d italienisches_heer -f backend/schema.sql
    ```
    

Fehlerbehebung
--------------

### Häufige Probleme und Lösungen

#### 1. Datenbank-Verbindungsfehler

Symptom:

```text

Fehler beim Laden der Daten: connect ECONNREFUSED 127.0.0.1:5432

Lösungen:

*   PostgreSQL-Service starten:
    
    ```bash
    # Windows
    net start postgresql-x64-15
    
    # Linux
    sudo systemctl start postgresql
    
    # Mac
    brew services start postgresql
    
*   Verbindung testen:
    
    bash
    
    psql -U postgres -h localhost -p 5432
    
*   Passwort in `backend/server.js` überprüfen
    ```
```
    

#### 2. Schema-Import-Fehler

Symptom:

text

ERROR:  relation "branch" already exists

Lösung:

*   Bestehende Datenbank löschen und neu erstellen:
    
    ```bash
    dropdb -U postgres italienisches_heer
    createdb -U postgres italienisches_heer
    psql -U postgres -d italienisches_heer -f backend/schema.sql
    ```
    

#### 3. CORS-Fehler

Symptom:

```text

Access to fetch at 'http://localhost:5000/api/organisation' from origin 'http://localhost:3000' has been blocked by CORS policy

Lösung:

*   Backend auf Port 5000 und Frontend auf Port 3000 laufen lassen
    
*   CORS ist bereits im Backend konfiguriert
```
    

#### 4. Port bereits in Verwendung

Symptom:

```text

Error: listen EADDRINUSE: address already in use :::5000

Lösung:

*   Anderen Port verwenden oder bestehenden Prozess beenden:
    
    bash
    
    # Prozesse auf Port 5000 finden
    netstat -ano | findstr :5000
    
    # Prozess beenden (Windows)
    taskkill /PID  /F
    
    # Linux/Mac
    lsof -ti:5000 | xargs kill -9
```
    

#### 5. Node Modules Fehler

Symptom:

```text

Error: Cannot find module 'express'

Lösung:

*   Abhängigkeiten neu installieren:
    
    bash
    
    cd backend && npm install
    cd ../frontend && npm install
```
    

#### 6. React Development Server Fehler

Symptom:

```text

Error: EADDRINUSE: address already in use :::3000

Lösung:

*   Anderen Port verwenden oder Vite konfigurieren:
    
    bash
    
    # Port ändern
    npm run dev -- --port 3001
```
    

#### 7. PNG Export funktioniert nicht

Symptom:

*   PNG-Export erzeugt leeres Bild oder Fehler
    

Lösung:

*   html2canvas installieren:
    
    ```bash
    cd frontend
    npm install html2canvas
    ```
    

#### 8. Daten werden nicht angezeigt

Symptom:

*   "Keine Daten gefunden" oder leeres Organigramm
    

Lösung:

*   API-Endpoints testen:
    
    ```bash
    curl http://localhost:5000/api/organisation
    curl http://localhost:5000/api/health
    ```
    
*   Backend-Logs überprüfen
    

#### 9. PostgreSQL Authentifizierungsfehler

Symptom:

```text

psql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL: password authentication failed for user "postgres"

Lösung:

*   Passwort zurücksetzen oder pg_hba.conf anpassen
    
*   Verbindung ohne Passwort testen:
    
    ```bash
    psql -U postgres -h localhost -d italienisches_heer
    ```
```
    

#### 10. Memory Issues bei großen Organigrammen

Symptom:

*   Langsame Performance oder Browser-Absturz
    

Lösung:

*   Browser-Developer-Tools öffnen und Memory überwachen
    
*   Weniger Daten laden oder Pagination implementieren
    

### Debugging-Tipps

1.  Backend-Logs überprüfen:
    
    *   Server starten mit `node server.js`
        
    *   API-Aufrufe werden im Terminal protokolliert
        
2.  Frontend-Console:
    
    *   Browser-Developer-Tools öffnen (F12)
        
    *   Console-Tab für Fehlermeldungen überprüfen
        
3.  Network-Tab:
    
    *   Network requests im Browser überwachen
        
    *   HTTP-Statuscodes und Response-Bodies prüfen
        
4.  Datenbank direkt testen:
    
    ```bash
    psql -U postgres -d italienisches_heer -c "SELECT COUNT(*) FROM unit;"
    psql -U postgres -d italienisches_heer -c "SELECT COUNT(*) FROM personnel;"
    ```


Entwicklung
-----------

### Projekt-Struktur

```text
.
├── backend/
│   ├── server.js          # Express-Server
│   ├── schema.sql         # Datenbankschema & Daten
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx        # Hauptkomponente mit Organigramm
    │   ├── App.css        # Styles der Hauptkomponente
    │   ├── main.tsx       # React-Einstiegspunkt
    │   ├── index.css      # Globale Styles
    │   ├── services/
    │   │   └── api.ts     # API-Service
    │   └── types/
    │       └── index.ts   # TypeScript Typen
    ├── package.json
    └── vite.config.js     # Vite Konfiguration
```

### Skripte

Backend:

*   `npm start` - Startet den Server
    
*   `npm run dev` - Startet mit Watch-Mode (falls konfiguriert)
    

Frontend:

*   `npm run dev` - Startet Entwicklungsserver
    
*   `npm run build` - Erstellt Produktions-Build
    
*   `npm run preview` - Vorschau des Builds
    

Autoren
-------

*   Louis Duong
    
*   Emil Sack
    

Danksagungen
------------

*   Basierend auf den offiziellen Strukturen des Esercito Italiano
    
*   Dienstgrad-Informationen von [Wikipedia](https://de.wikipedia.org/wiki/Dienstgrade_der_italienischen_Streitkr%C3%A4fte)
    
*   Esercito Italiano Informationen von [Wikipedia](https://de.wikipedia.org/wiki/Esercito_Italiano)