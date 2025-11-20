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
    password: '123', // Hier ändern falls anderes Pw
    port: 5432,
});

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ 
            success: true, 
            message: 'Server & PostgreSQL online!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Datenbank Fehler: ' + error.message
        });
    }
});

app.get('/api/hierarchie', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dienstgrade ORDER BY id');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/statistiken', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT rang_kategorie, COUNT(*) as anzahl 
            FROM dienstgrade 
            GROUP BY rang_kategorie
        `);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log('Backend Server gestartet!');
    console.log(`http://localhost:${PORT}`);
    console.log('Health: http://localhost:5000/api/health');
});