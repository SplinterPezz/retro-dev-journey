import React from 'react';
import { LucideIcon } from 'lucide-react';
import './ChoiceScreen.css';
import '../Common/pixel-button.css';
import '../Common/fullscreen-page.css';

const ICON_SIZE = 56;

interface ChoiceOption<T> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface ChoiceScreenProps<T> {
  title: string;
  options: readonly ChoiceOption<T>[];
  onChoose: (value: T) => void;
}

// A full-screen question with big icon buttons, asked once before the first game.
const ChoiceScreen = <T,>({ title, options, onChoose }: ChoiceScreenProps<T>) => (
  <div className="orientation-choice-page fullscreen-page">
    <div className="orientation-choice-box">
      <h2 className="orientation-choice-title">{title}</h2>
      <div className="orientation-choice-buttons">
        {options.map(({ value, label, icon: Icon }) => (
          <button key={label} type="button" className="orientation-choice-button pixel-button" onClick={() => onChoose(value)}>
            <Icon size={ICON_SIZE} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ChoiceScreen;
