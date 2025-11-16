import React from 'react';
import { Dienstgrad } from '../types';
import DienstgradCard from './DienstgradCard';
import './Level.css';

interface LevelProps {
  level: number;
  dienstgrade: Dienstgrad[];
}

const Level: React.FC<LevelProps> = ({ level, dienstgrade }) => {
  return (
    <div className="level">
      <div className="level-header">Befehlsebene {level + 1}</div>
      <div className="level-content">
        {dienstgrade.map((dienstgrad) => (
          <DienstgradCard 
            key={dienstgrad.id} 
            dienstgrad={dienstgrad} 
          />
        ))}
      </div>
    </div>
  );
};

export default Level;