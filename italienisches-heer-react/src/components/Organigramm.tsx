import React from 'react';
import { Dienstgrad } from '../types';
import Level from './Level';
import './Organigramm.css';

interface OrganigrammProps {
  data: Dienstgrad[];
  loading: boolean;
  error: string | null;
}

const Organigramm: React.FC<OrganigrammProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Lade Organigramm-Daten...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>❌ Fehler beim Laden der Daten</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <h3>Keine Daten verfügbar</h3>
        <p>Bitte starte das Backend und überprüfe die Datenbankverbindung.</p>
      </div>
    );
  }

  // Gruppiere Daten nach Level
  const levels: { [key: number]: Dienstgrad[] } = {};
  data.forEach(dienstgrad => {
    if (!levels[dienstgrad.level]) {
      levels[dienstgrad.level] = [];
    }
    levels[dienstgrad.level].push(dienstgrad);
  });

  return (
    <div className="organigramm">
      {Object.keys(levels)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(level => (
          <Level 
            key={level} 
            level={parseInt(level)} 
            dienstgrade={levels[parseInt(level)]} 
          />
        ))}
    </div>
  );
};

export default Organigramm;