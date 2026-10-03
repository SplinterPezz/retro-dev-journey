import React from 'react';
import './DialogueChoices.css';

export interface ChoiceButtonItem {
  id: string;
  label: string;
  isAnswer?: boolean; // styled distinctly - picking this choice leads into a question the NPC turns back on the player
  disabled?: boolean; // this specific choice is disabled (e.g. an already-completed quiz category)
  progress?: { done: number; total: number }; // renders filled/empty dots on the right of the button - signals there's more than one variant behind an isAnswer choice (e.g. "Got a random question for you" hides 2 different questions), so answering one doesn't look like a dead end
}

interface DialogueChoicesProps {
  choices: ChoiceButtonItem[];
  onSelect: (id: string) => void;
  disabled?: boolean;
}

// Stacked custom-styled buttons, shared by dialogue branching choices and
// the quiz answer options - both are "pick one of N labelled buttons", often
// with longer, variable-length text. Deliberately NOT an rpgui-button: that
// asset draws its corner studs as floated pseudo-elements that only line up
// at one fixed pixel width (see StoryIntroDialog's "Continue" button for
// where that style is still right - a short, fixed label), which breaks on
// longer answer text that needs to wrap. This is a plain CSS button instead,
// free to size to its content.
const DialogueChoices: React.FC<DialogueChoicesProps> = ({ choices, onSelect, disabled = false }) => {
  return (
    <div className="dialogue-choices">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          type="button"
          className={`story-choice-button${choice.isAnswer ? ' story-choice-button--answer' : ''}`}
          style={{ animationDelay: `${index * 90}ms` }}
          disabled={disabled || choice.disabled}
          onClick={() => onSelect(choice.id)}
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
      ))}
    </div>
  );
};

export default DialogueChoices;
