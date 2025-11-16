import React from 'react';
import { Dienstgrad } from '../types';
import './DienstgradCard.css';

interface DienstgradCardProps {
  dienstgrad: Dienstgrad;
}

const DienstgradCard: React.FC<DienstgradCardProps> = ({ dienstgrad }) => {
  const getCardClass = (kategorie: string) => {
    switch (kategorie) {
      case 'Generale': return 'rang-card generale';
      case 'Offiziere': return 'rang-card offiziere';
      case 'Unteroffiziere': return 'rang-card unteroffiziere';
      case 'Mannschaften': return 'rang-card mannschaften';
      default: return 'rang-card';
    }
  };

  return (
    <div className={getCardClass(dienstgrad.rang_kategorie)}>
      <div className="rang-kategorie">{dienstgrad.rang_kategorie}</div>
      <div className="rang-name">{dienstgrad.rang_name}</div>
      <div className="rang-code">{dienstgrad.rang_code}</div>
      {dienstgrad.beschreibung && (
        <div className="rang-beschreibung">{dienstgrad.beschreibung}</div>
      )}
      <div className="level-indicator">Level {dienstgrad.level + 1}</div>
    </div>
  );
};

export default DienstgradCard;