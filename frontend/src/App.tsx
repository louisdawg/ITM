import React, { useState, useEffect } from 'react';
import { hierarchieAPI } from './services/api';
import type { Dienstgrad, Statistik } from './types';
import Organigramm from './components/Organigramm';
import './App.css';

function App() {
  const [hierarchie, setHierarchie] = useState<Dienstgrad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Statistik[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [hierarchieResponse, statsResponse] = await Promise.all([
        hierarchieAPI.getHierarchie(),
        hierarchieAPI.getStatistiken()
      ]);

      if (hierarchieResponse.success) {
        setHierarchie(hierarchieResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Laden der Daten');
      console.error('Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalDienstgrade = hierarchie.length;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Esercito Italiano (Italienisches Heer)</h1>
        <p>Dienstgradhierarchie - Organigramm</p>
        
        {stats && (
          <div className="stats">
            {stats.map(stat => (
              <span key={stat.rang_kategorie} className="stat-item">
                {stat.rang_kategorie}: {stat.anzahl}
              </span>
            ))}
            <span className="stat-item total">Gesamt: {totalDienstgrade}</span>
          </div>
        )}
        
        <button 
          onClick={loadData} 
          className="refresh-btn"
          disabled={loading}
        >
          {loading ? '🔄 Lädt...' : '⟳ Aktualisieren'}
        </button>
      </header>

      <main>
        <Organigramm 
          data={hierarchie} 
          loading={loading} 
          error={error} 
        />
      </main>

      <footer className="App-footer">
        <p>Esercito Italiano - Dienstgrad Organigramm</p>
      </footer>
    </div>
  );
}

export default App;