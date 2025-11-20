import React, { useState, useEffect } from 'react';
import { hierarchieAPI } from './services/api';
import type { Dienstgrad, Statistik } from './types';
import './App.css';

function App() {
  const [hierarchie, setHierarchie] = useState<Dienstgrad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await hierarchieAPI.getHierarchie();
      if (response.data.success) {
        setHierarchie(response.data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Lade Daten...</div>;
  if (error) return <div className="error">Fehler: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🇮🇹 Italienisches Heer</h1>
        <p>Dienstgradhierarchie</p>
        <button onClick={loadData}>Aktualisieren</button>
      </header>

      <main>
        <div className="organigramm">
          {hierarchie.map(rang => (
            <div key={rang.id} className="rang-card">
              <div className="rang-name">{rang.rang_name}</div>
              <div className="rang-code">{rang.rang_code}</div>
              <div className="rang-kategorie">{rang.rang_kategorie}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;