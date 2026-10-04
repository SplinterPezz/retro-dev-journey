import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StoryDifficulty } from '../../../types/story';
import CodeFixEditor from '../code/LazyCodeFixEditor';
import { sameCode } from '../code/sameCode';
import PcMonitor from './PcMonitor';
import '../../Common/pixel-button.css';
import './MiniGamesPopup.css';
import {
  BASE_POINTS,
  buildLog,
  CommitRound,
  commitCountByDifficulty,
  commitRounds,
  commitRoundsByDifficulty,
  difficultyMultiplier,
  FixSnippet,
  fixBuildCountByDifficulty,
  fixBuildSnippets,
  logRoundsByDifficulty,
  tierFor,
} from '../../../config/story/miniGames';
import { isDev } from '../../../config/env';

interface MiniGamesPopupProps {
  difficulty: StoryDifficulty;
  onFinish: (earned: number, max: number) => void;
  onPowerOff: () => void;
}

const FEEDBACK_MS = 1400;

type GameId = 'fixBuild' | 'pickCommit' | 'readLog';
type Step =
  | { game: 'fixBuild'; round: number; snippet: FixSnippet }
  | { game: 'pickCommit'; round: number; commit: CommitRound }
  | { game: 'readLog'; round: number; log: { lines: string[]; errorIndex: number } };

const buildSteps = (difficulty: StoryDifficulty): Step[] => [
  ...fixBuildSnippets.slice(0, fixBuildCountByDifficulty[difficulty]).map((snippet, round) => ({ game: 'fixBuild' as const, round, snippet })),
  ...commitRounds.slice(0, commitRoundsByDifficulty[difficulty]).map((commit, round) => ({ game: 'pickCommit' as const, round, commit })),
  ...Array.from({ length: logRoundsByDifficulty[difficulty] }, (_, round) => ({ game: 'readLog' as const, round, log: buildLog(difficulty, round) })),
];

const gameTitles: Record<GameId, string> = {
  fixBuild: '1 / 3  Fix the Java build',
  pickCommit: '2 / 3  Which commit?',
  readLog: '3 / 3  Read the log',
};

interface QuestionProps {
  locked: boolean;
  onAnswer: (correct: boolean) => void;
}

const FixBuildQuestion: React.FC<QuestionProps & { snippet: FixSnippet; showHintButton: boolean; counter: string }> = ({
  snippet,
  showHintButton,
  counter,
  locked,
  onAnswer,
}) => {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="minigame">
      <p className="minigame-prompt">Fix the Java build: edit the line until it compiles. {counter}</p>
      <CodeFixEditor initialCode={snippet.bugged} disabled={locked} onSubmit={(code) => onAnswer(sameCode(code, snippet.expected))} />
      <div className="minigame-meta">
        {showHintButton ? (
          <button type="button" className="minigame-hint pixel-button" disabled={locked} onClick={() => setShowHint(true)}>
            Hint
          </button>
        ) : (
          <span>No hints on this level</span>
        )}
      </div>
      {showHint && <p className="minigame-hint-text">{snippet.hint}</p>}
    </div>
  );
};

const PickCommitQuestion: React.FC<QuestionProps & { commit: CommitRound; count: number; counter: string }> = ({
  commit,
  count,
  counter,
  locked,
  onAnswer,
}) => (
  <div className="minigame">
    <p className="minigame-prompt">{commit.prompt} {counter}</p>
    <div className="minigame-options">
      {commit.options.slice(0, count).map((c) => (
        <button key={c.hash} type="button" className="minigame-option pixel-button" disabled={locked} onClick={() => onAnswer(c.breaks)}>
          <span className="minigame-hash">{c.hash}</span> {c.message}
        </button>
      ))}
    </div>
  </div>
);

const ReadLogQuestion: React.FC<QuestionProps & { log: { lines: string[]; errorIndex: number }; counter: string }> = ({
  log,
  counter,
  locked,
  onAnswer,
}) => (
  <div className="minigame">
    <p className="minigame-prompt">Tap the line that caused the crash. {counter}</p>
    <div className="minigame-log">
      {log.lines.map((line, i) => (
        <button key={i} type="button" className="minigame-log-line" disabled={locked} onClick={() => onAnswer(i === log.errorIndex)}>
          {line}
        </button>
      ))}
    </div>
  </div>
);

const MiniGamesPopup: React.FC<MiniGamesPopupProps> = ({ difficulty, onFinish, onPowerOff }) => {
  const steps = useMemo(() => buildSteps(difficulty), [difficulty]);
  const [results, setResults] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const worth = BASE_POINTS * difficultyMultiplier[difficulty];
  const max = steps.length * worth;
  const total = results.filter(Boolean).length * worth;
  const stepIndex = feedback === null ? results.length : results.length - 1;
  const finished = feedback === null && results.length >= steps.length;

  const answer = (correct: boolean) => {
    if (feedback !== null) return;
    setResults((prev) => [...prev, correct]);
    setFeedback(correct);
    timerRef.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  };

  if (finished) {
    const percent = Math.round((total / max) * 100);
    return (
      <PcMonitor onPowerOff={onPowerOff}>
        <div className="minigame-popup">
          <h2 className="minigame-title">Final exercise</h2>
          <div className="minigame-final-score">
            <span className="minigame-score-number">{total}</span>
            <span className="minigame-score-max"> / {max} pts</span>
          </div>
          <p className="minigame-tier">{tierFor(total, max).title} ({percent}%)</p>
          <p className="minigame-final-note">
            {results.filter(Boolean).length} of {steps.length} answers right. Close the laptop: the instructor has something to say.
          </p>
          <button type="button" className="minigame-close pixel-button" onClick={() => onFinish(total, max)}>
            Close
          </button>
        </div>
      </PcMonitor>
    );
  }

  const step = steps[stepIndex];
  const roundsOfGame = steps.filter((s) => s.game === step.game).length;
  const counter = `(${step.round + 1} / ${roundsOfGame})`;
  const locked = feedback !== null;

  return (
    <PcMonitor onPowerOff={onPowerOff}>
      <div className="minigame-popup">
        <div className="minigame-header">
          <span className="minigame-game-title">{gameTitles[step.game]}</span>
          <span className="minigame-running">Points: <strong>{total}</strong> / {max}</span>
          {isDev && (
            <button type="button" className="minigame-debug-complete" onClick={() => onFinish(max, max)}>
              Debug: complete
            </button>
          )}
        </div>
        {feedback === true && <p className="minigame-feedback minigame-right">Correct! +{worth} pts</p>}
        {feedback === false && <p className="minigame-feedback minigame-wrong">Wrong - no points for this one. On to the next.</p>}
        {step.game === 'fixBuild' && (
          <FixBuildQuestion
            key={step.snippet.id}
            snippet={step.snippet}
            showHintButton={difficulty === 'junior'}
            counter={counter}
            locked={locked}
            onAnswer={answer}
          />
        )}
        {step.game === 'pickCommit' && (
          <PickCommitQuestion
            key={step.commit.id}
            commit={step.commit}
            count={commitCountByDifficulty[difficulty]}
            counter={counter}
            locked={locked}
            onAnswer={answer}
          />
        )}
        {step.game === 'readLog' && <ReadLogQuestion key={`log-${step.round}`} log={step.log} counter={counter} locked={locked} onAnswer={answer} />}
      </div>
    </PcMonitor>
  );
};

export default MiniGamesPopup;
