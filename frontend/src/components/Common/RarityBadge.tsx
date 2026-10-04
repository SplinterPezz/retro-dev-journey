import React from 'react';
import { Rarity } from '../../types/game';
import { rarityLabels } from '../../config/rarity';
import './rarity.css';

const RarityBadge: React.FC<{ rarity: Rarity }> = ({ rarity }) => (
  <span className={`rarity-badge rarity--${rarity}`}>{rarityLabels[rarity]}</span>
);

export default RarityBadge;
