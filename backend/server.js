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
    password: '123', // Hier ändern bei Bedarf
    port: 5432, // // Hier ändern bei Bedarf
});

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server läuft!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/hierarchie', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dienstgrade ORDER BY id');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Datenbankfehler:', error);
        res.status(500).json({
            success: false,
            error: 'Datenbankfehler'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
});