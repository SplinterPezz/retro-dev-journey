import React, { useEffect, useState } from 'react';
import '../../Common/pixel-button.css';
import './DialogueChoices.css';

export interface ChoiceButtonItem {
  id: string;
  label: string;
  isAnswer?: boolean;
  disabled?: boolean;
  progress?: { done: number; total: number };
  hint?: string;
}

interface DialogueChoicesProps {
  choices: ChoiceButtonItem[];
  onSelect: (id: string) => void;
  disabled?: boolean;
}

// Not an rpgui-button: its corner studs only line up at one fixed width, and these labels wrap.
const DialogueChoices: React.FC<DialogueChoicesProps> = ({ choices, onSelect, disabled = false }) => {
  const [openHintId, setOpenHintId] = useState<string | null>(null);

  useEffect(() => {
    if (!openHintId) return;
    const closeIfOutside = (event: PointerEvent) => {
      const row = document.querySelector(`[data-hint-id="${openHintId}"]`);
      if (!row?.contains(event.target as Node)) setOpenHintId(null);
    };
    document.addEventListener('pointerdown', closeIfOutside);
    return () => document.removeEventListener('pointerdown', closeIfOutside);
  }, [openHintId]);

  const renderButton = (choice: ChoiceButtonItem, index: number) => (
    <button
      type="button"
      className={`story-choice-button pixel-button${choice.isAnswer ? ' story-choice-button--answer' : ''}`}
      style={{ animationDelay: `${index * 90}ms` }}
      disabled={disabled || choice.disabled}
      onClick={() => {
        setOpenHintId(null);
        onSelect(choice.id);
      }}
    >
      <span className="story-choice-row">
        <span className="story-choice-text">
          {choice.isAnswer && <span className="story-choice-answer-mark">&gt;</span>}
          {choice.label}
        </span>
        {choice.progress && (
          <span className="story-choice-dots" aria-hidden="true">
            {Array.from({ length: choice.progress.total }).map((_, i) => (
              <span
                key={i}
                className={`story-choice-dot${i < choice.progress!.done ? ' filled' : ''}`}
              />
            ))}
          </span>
        )}
      </span>
    </button>
  );

  return (
    <div className="dialogue-choices">
      {choices.map((choice, index) => {
        if (!choice.hint) {
          return <React.Fragment key={choice.id}>{renderButton(choice, index)}</React.Fragment>;
        }
        const isOpen = openHintId === choice.id;
        return (
          <div key={choice.id} className="story-choice-wrap" data-hint-id={choice.id}>
            {renderButton(choice, index)}
            <button
              type="button"
              className="story-choice-hint-button"
              aria-label="Hint"
              aria-expanded={isOpen}
              onClick={() => setOpenHintId(isOpen ? null : choice.id)}
            >
              ?
            </button>
            {isOpen && (
              <div className="story-choice-balloon" role="note">
                {choice.hint}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DialogueChoices;
