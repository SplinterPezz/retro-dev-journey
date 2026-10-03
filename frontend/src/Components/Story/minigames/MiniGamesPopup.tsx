import React, { useMemo, useState } from 'react';
import { StoryDifficulty } from '../../../types/story';
import CodeFixEditor from '../code/CodeFixEditor';
import PcMonitor from './PcMonitor';
import '../../Common/pixel-button.css';
import './MiniGamesPopup.css';
import {
  BASE_POINTS,
  buildLog,
  commitCountByDifficulty,
  commitOptions,
  difficultyMultiplier,
  fixBuildCountByDifficulty,
  fixBuildSnippets,
  miniGameMistakesByDifficulty,
  tierFor,
} from '../../../config/story/miniGames';

interface MiniGamesPopupProps {
  difficulty: StoryDifficulty;
  onFinish: (earned: number, max: number) => void;
  onPowerOff: () => void; // power button on the monitor: leave without finishing
}

// Shared by the three games: count mistakes, and restart the game when the
// difficulty's limit is passed.
const useMistakes = (difficulty: StoryDifficulty, onRestart: () => void) => {
  const [mistakes, setMistakes] = useState(0);
  const limit = miniGameMistakesByDifficulty[difficulty];
  const miss = () => {
    const next = mistakes + 1;
    setMistakes(next);
    if (limit !== null && next > limit) onRestart();
  };
  return { mistakes, limit, miss };
};

const normalise = (code: string) => code.replace(/\s+/g, '');

// ---- Game 1: fix the build ----

interface FixBuildProps {
  difficulty: StoryDifficulty;
  onDone: (points: number) => void;
  onRestart: () => void;
}

const FixBuildGame: React.FC<FixBuildProps> = ({ difficulty, onDone, onRestart }) => {
  const snippets = fixBuildSnippets.slice(0, fixBuildCountByDifficulty[difficulty]);
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'wrong'>('none');
  const [showHint, setShowHint] = useState(false);
  const { mistakes, limit, miss } = useMistakes(difficulty, onRestart);
  const snippet = snippets[index];
  const worth = BASE_POINTS * difficultyMultiplier[difficulty];

  const submit = (code: string) => {
    if (normalise(code) === normalise(snippet.expected)) {
      const nextPoints = points + worth;
      setPoints(nextPoints);
      setFeedback('none');
      setShowHint(false);
      if (index + 1 >= snippets.length) {
        onDone(nextPoints);
      } else {
        setIndex(index + 1);
      }
    } else {
      setFeedback('wrong');
      miss();
    }
  };

  return (
    <div className="minigame">
      <p className="minigame-prompt">Fix the Java build: edit the line until it compiles. ({index + 1} / {snippets.length})</p>
      <CodeFixEditor key={snippet.id} initialCode={snippet.bugged} onSubmit={submit} />
      <div className="minigame-meta">
        {difficulty === 'junior' ? (
          <button type="button" className="minigame-hint pixel-button" onClick={() => setShowHint(true)}>
            Hint
          </button>
        ) : (
          <span>No hints on this level</span>
        )}
        {limit !== null && <span>Mistakes: {mistakes} / {limit}</span>}
      </div>
      {showHint && <p className="minigame-hint-text">{snippet.hint}</p>}
      {feedback === 'wrong' && <p className="minigame-wrong">Not quite. Look at the line again.</p>}
    </div>
  );
};

// ---- Game 2: which commit broke everything? ----

interface PickCommitProps {
  difficulty: StoryDifficulty;
  onDone: (points: number) => void;
  onRestart: () => void;
}

const PickCommitGame: React.FC<PickCommitProps> = ({ difficulty, onDone, onRestart }) => {
  const options = useMemo(
    () => commitOptions.slice(0, commitCountByDifficulty[difficulty]),
    [difficulty]
  );
  const { mistakes, limit, miss } = useMistakes(difficulty, onRestart);
  const [wrong, setWrong] = useState(false);
  const worth = BASE_POINTS * difficultyMultiplier[difficulty];

  const pick = (breaks: boolean) => {
    if (breaks) {
      onDone(worth);
    } else {
      setWrong(true);
      miss();
    }
  };

  return (
    <div className="minigame">
      <p className="minigame-prompt">Which commit broke the build?</p>
      <div className="minigame-options">
        {options.map((c) => (
          <button key={c.hash} type="button" className="minigame-option pixel-button" onClick={() => pick(c.breaks)}>
            <span className="minigame-hash">{c.hash}</span> {c.message}
          </button>
        ))}
      </div>
      <div className="minigame-meta">
        {limit !== null && <span>Mistakes: {mistakes} / {limit}</span>}
      </div>
      {wrong && <p className="minigame-wrong">That one is fine. Check the others.</p>}
    </div>
  );
};

// ---- Game 4: find the error in the log ----

interface ReadLogProps {
  difficulty: StoryDifficulty;
  onDone: (points: number) => void;
  onRestart: () => void;
}

const ReadLogGame: React.FC<ReadLogProps> = ({ difficulty, onDone, onRestart }) => {
  const log = useMemo(() => buildLog(difficulty), [difficulty]);
  const { mistakes, limit, miss } = useMistakes(difficulty, onRestart);
  const [wrong, setWrong] = useState(false);
  const worth = BASE_POINTS * difficultyMultiplier[difficulty];

  const tap = (i: number) => {
    if (i === log.errorIndex) {
      onDone(worth);
    } else {
      setWrong(true);
      miss();
    }
  };

  return (
    <div className="minigame">
      <p className="minigame-prompt">Tap the line that caused the crash.</p>
      <div className="minigame-log">
        {log.lines.map((line, i) => (
          <button key={i} type="button" className="minigame-log-line" onClick={() => tap(i)}>
            {line}
          </button>
        ))}
      </div>
      <div className="minigame-meta">
        {limit !== null && <span>Mistakes: {mistakes} / {limit}</span>}
      </div>
      {wrong && <p className="minigame-wrong">Not that one. Read the error line.</p>}
    </div>
  );
};

// ---- The three games, one after another, with the running score ----

const MiniGamesPopup: React.FC<MiniGamesPopupProps> = ({ difficulty, onFinish, onPowerOff }) => {
  const [gameIndex, setGameIndex] = useState(0);
  const [attempt, setAttempt] = useState(0); // bumping it remounts the current game
  const [gamePoints, setGamePoints] = useState<number[]>([0, 0, 0]);

  const maxPerGame = [
    fixBuildCountByDifficulty[difficulty] * BASE_POINTS * difficultyMultiplier[difficulty],
    BASE_POINTS * difficultyMultiplier[difficulty],
    BASE_POINTS * difficultyMultiplier[difficulty],
  ];
  const max = maxPerGame.reduce((a, b) => a + b, 0);
  const total = gamePoints.reduce((a, b) => a + b, 0);
  const finished = gameIndex >= 3;

  const complete = (points: number) => {
    setGamePoints((prev) => prev.map((p, i) => (i === gameIndex ? points : p)));
    setGameIndex(gameIndex + 1);
  };

  // Too many mistakes: this game starts again from zero, the others are kept.
  const restart = () => {
    setGamePoints((prev) => prev.map((p, i) => (i === gameIndex ? 0 : p)));
    setAttempt(attempt + 1);
  };

  if (finished) {
    const percent = Math.round((total / max) * 100);
    const tier = tierFor(percent);
    return (
      <PcMonitor onPowerOff={onPowerOff}>
        <div className="minigame-popup">
          <h2 className="minigame-title">Final exercise</h2>
          <div className="minigame-final-score">
            <span className="minigame-score-number">{total}</span>
            <span className="minigame-score-max"> / {max} pts</span>
          </div>
          <p className="minigame-tier">{tier.title} ({percent}%)</p>
          <div className="minigame-jokes">
            <p><strong>Francesco:</strong> {tier.francesco}</p>
            <p><strong>Manuel:</strong> {tier.manuel}</p>
          </div>
          <button type="button" className="minigame-close pixel-button" onClick={() => onFinish(total, max)}>
            Close
          </button>
        </div>
      </PcMonitor>
    );
  }

  const gameTitles = ['1 / 3  Fix the Java build', '2 / 3  Which commit?', '3 / 3  Read the log'];

  return (
    <PcMonitor onPowerOff={onPowerOff}>
      <div className="minigame-popup">
        <div className="minigame-header">
          <span className="minigame-game-title">{gameTitles[gameIndex]}</span>
          <span className="minigame-running">Points: <strong>{total}</strong> / {max}</span>
          {process.env.REACT_APP_ENV === 'development' && (
            <button type="button" className="minigame-debug-complete" onClick={() => onFinish(max, max)}>
              Debug: complete
            </button>
          )}
        </div>
        {gameIndex === 0 && (
          <FixBuildGame key={`g0-${attempt}`} difficulty={difficulty} onDone={complete} onRestart={restart} />
        )}
        {gameIndex === 1 && (
          <PickCommitGame key={`g1-${attempt}`} difficulty={difficulty} onDone={complete} onRestart={restart} />
        )}
        {gameIndex === 2 && (
          <ReadLogGame key={`g2-${attempt}`} difficulty={difficulty} onDone={complete} onRestart={restart} />
        )}
      </div>
    </PcMonitor>
  );
};

export default MiniGamesPopup;
