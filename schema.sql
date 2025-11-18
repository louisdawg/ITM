CREATE TABLE dienstgrade (
    id SERIAL PRIMARY KEY,
    rang_name VARCHAR(100) NOT NULL,
    rang_kategorie VARCHAR(20) CHECK (rang_kategorie IN ('Mannschaften', 'Unteroffiziere', 'Offiziere', 'Generale')) NOT NULL,
    rang_code VARCHAR(10) NOT NULL,
    vorgesetzter_id INTEGER REFERENCES dienstgrade(id),
    beschreibung TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dienstgrade (rang_name, rang_kategorie, rang_code, vorgesetzter_id, beschreibung) VALUES
('Generale', 'Generale', 'OF-9', NULL, 'General - Höchster Dienstgrad'),
('Generale di Corpo d Armata', 'Generale', 'OF-8', 1, 'Armeekorpsgeneral'),
('Generale di Divisione', 'Generale', 'OF-7', 2, 'Divisionsgeneral'),
('Generale di Brigata', 'Generale', 'OF-6', 3, 'Brigadegeneral'),
('Colonnello', 'Offiziere', 'OF-5', 4, 'Oberst'),
('Tenente Colonnello', 'Offiziere', 'OF-4', 5, 'Oberstleutnant'),
('Maggiore', 'Offiziere', 'OF-3', 6, 'Major'),
('Capitano', 'Offiziere', 'OF-2', 7, 'Hauptmann'),
('Tenente', 'Offiziere', 'OF-1', 8, 'Leutnant'),
('Sottotenente', 'Offiziere', 'OF-1', 9, 'Unterleutnant'),
('Primo Maresciallo Luogotenente', 'Unteroffiziere', 'OR-9', 10, 'Erster Hauptfeldwebel'),
('Primo Maresciallo', 'Unteroffiziere', 'OR-8', 11, 'Hauptfeldwebel'),
('Maresciallo Capo', 'Unteroffiziere', 'OR-8', 12, 'Oberfeldwebel'),
('Maresciallo Ordinario', 'Unteroffiziere', 'OR-7', 13, 'Feldwebel'),
('Maresciallo', 'Unteroffiziere', 'OR-6', 14, 'Unterfeldwebel'),
('Sergente Maggiore Capo', 'Unteroffiziere', 'OR-6', 15, 'Hauptsergent'),
('Sergente Maggiore', 'Unteroffiziere', 'OR-5', 16, 'Obersergent'),
('Sergente', 'Unteroffiziere', 'OR-5', 17, 'Sergent'),
('Caporal Maggiore Capo Scelto', 'Mannschaften', 'OR-4', 18, 'Hauptgefreiter'),
('Caporal Maggiore Capo', 'Mannschaften', 'OR-4', 19, 'Stabsgefreiter'),
('Caporal Maggiore Scelto', 'Mannschaften', 'OR-3', 20, 'Obergefreiter'),
('Caporal Maggiore', 'Mannschaften', 'OR-3', 21, 'Gefreiter'),
('Caporale', 'Mannschaften', 'OR-2', 22, 'Korporal'),
('Soldato', 'Mannschaften', 'OR-1', 23, 'Soldat');

SELECT COUNT(*) as anzahl_dienstgrade FROM dienstgrade;

WITH RECURSIVE hierarchie AS (
    SELECT 
        id,
        rang_name,
        rang_kategorie,
        rang_code,
        vorgesetzter_id,
        beschreibung,
        0 as level,
        ARRAY[id] as path
    FROM dienstgrade 
    WHERE vorgesetzter_id IS NULL
    
    UNION ALL
    
    SELECT 
        d.id,
        d.rang_name,
        d.rang_kategorie,
        d.rang_code,
        d.vorgesetzter_id,
        d.beschreibung,
        h.level + 1 as level,
        h.path || d.id as path
    FROM dienstgrade d
    INNER JOIN hierarchie h ON d.vorgesetzter_id = h.id
)
SELECT * FROM hierarchie ORDER BY path;