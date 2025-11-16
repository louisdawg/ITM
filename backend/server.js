import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'italienisches_heer',
    password: '123',
    port: 5432,
});

pool.on('connect', () => {
    console.log('✅ Erfolgreich mit PostgreSQL verbunden');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL Verbindungsfehler:', err);
});

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            success: true,
            message: 'Backend und PostgreSQL sind online',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'PostgreSQL nicht erreichbar'
        });
    }
});

app.get('/api/hierarchie', async (req, res) => {
    try {
        const query = `
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
            SELECT * FROM hierarchie 
            ORDER BY path
        `;

        const result = await pool.query(query);
        
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
        
    } catch (error) {
        console.error('❌ Fehler bei hierarchischer Abfrage:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend Server läuft auf http://localhost:${PORT}`);
});