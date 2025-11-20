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

app.get('/api/organisation', async (req, res) => {
    try {
        const query = `
            WITH RECURSIVE org_hierarchy AS (
                -- Wurzelknoten (ohne parent)
                SELECT 
                    id, 
                    name, 
                    type, 
                    parent_unit_id, 
                    branch_id, 
                    location, 
                    founded_year,
                    0 as level,
                    name::TEXT as path  -- Explizit als TEXT casten
                FROM Unit 
                WHERE parent_unit_id IS NULL
                
                UNION ALL
                
                -- Untergeordnete Einheiten
                SELECT 
                    u.id, 
                    u.name, 
                    u.type, 
                    u.parent_unit_id, 
                    u.branch_id, 
                    u.location, 
                    u.founded_year,
                    oh.level + 1 as level,
                    (oh.path || ' → ' || u.name)::TEXT as path  -- Auch hier als TEXT casten
                FROM Unit u
                INNER JOIN org_hierarchy oh ON u.parent_unit_id = oh.id
            )
            SELECT 
                oh.*,
                b.name as branch_name,
                (SELECT COUNT(*) FROM Personnel p WHERE p.unit_id = oh.id) as personnel_count
            FROM org_hierarchy oh
            LEFT JOIN Branch b ON oh.branch_id = b.id
            ORDER BY oh.level, oh.name
        `;

        const result = await pool.query(query);
        console.log(`✅ Organisation geladen: ${result.rows.length} Einheiten`);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('❌ Organisation Query Fehler:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Alternative: Einfache Unit-Abfrage ohne Rekursion
app.get('/api/units', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.*,
                b.name as branch_name,
                (SELECT COUNT(*) FROM Personnel p WHERE p.unit_id = u.id) as personnel_count,
                parent.name as parent_unit_name
            FROM Unit u
            LEFT JOIN Branch b ON u.branch_id = b.id
            LEFT JOIN Unit parent ON u.parent_unit_id = parent.id
            ORDER BY u.id
        `;
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Units Query Fehler:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Personal nach Einheit
app.get('/api/personnel/:unitId', async (req, res) => {
    try {
        const { unitId } = req.params;
        const query = `
            SELECT p.*, u.name as unit_name, u.type as unit_type
            FROM Personnel p
            JOIN Unit u ON p.unit_id = u.id
            WHERE p.unit_id = $1
            ORDER BY 
                CASE 
                    WHEN p.rang_code LIKE 'OF-%' THEN 1
                    WHEN p.rang_code LIKE 'OR-%' THEN 2
                    ELSE 3
                END,
                p.rang_code DESC
        `;
        const result = await pool.query(query, [unitId]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Alle Teilstreitkräfte
app.get('/api/branches', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Branch');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Alle Dienstgrade
app.get('/api/ranks', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT rank, rang_code 
            FROM Personnel 
            ORDER BY 
                CASE 
                    WHEN rang_code LIKE 'OF-%' THEN 1
                    WHEN rang_code LIKE 'OR-%' THEN 2
                    ELSE 3
                END,
                rang_code DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ 
            success: true, 
            message: 'Esercito Italiano Database online!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test-Daten Endpoint
app.get('/api/test', async (req, res) => {
    try {
        const units = await pool.query('SELECT COUNT(*) as unit_count FROM Unit');
        const personnel = await pool.query('SELECT COUNT(*) as personnel_count FROM Personnel');
        const branches = await pool.query('SELECT COUNT(*) as branch_count FROM Branch');
        
        res.json({
            success: true,
            data: {
                units: units.rows[0].unit_count,
                personnel: personnel.rows[0].personnel_count,
                branches: branches.rows[0].branch_count
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('🚀 Esercito Italiano Server gestartet!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('🏛️  Organisation: http://localhost:5000/api/organisation');
    console.log('🎖️  Einheiten: http://localhost:5000/api/units');
    console.log('👥 Personal: http://localhost:5000/api/personnel/1');
    console.log('🌿 Teilstreitkräfte: http://localhost:5000/api/branches');
    console.log('⭐ Dienstgrade: http://localhost:5000/api/ranks');
    console.log('🔍 Test: http://localhost:5000/api/test');
    console.log('❤️  Health: http://localhost:5000/api/health');
});