import React, { useMemo, useState } from 'react';
import { QuizData, QuizCategory, QuizQuestion, StoryDifficulty, StoryFlags } from '../../../types/story';
import { DEFAULT_DIFFICULTY, exceedsMistakeLimit, maxMistakesByDifficulty } from '../../../config/story/difficulty';
import { sameCode } from '../code/sameCode';
import { isDev } from '../../../config/env';
import { useTimeouts } from '../../../hooks/useTimeouts';
import DialogueChoices from '../dialogue/DialogueChoices';
import CodeFixEditor from '../code/LazyCodeFixEditor';
import StoryIntroDialog from '../dialogue/StoryIntroDialog';
import '../../Common/pixel-button.css';
import './QuizPopup.css';

interface QuizPopupProps {
  quiz: QuizData;
  flags: StoryFlags;
  difficulty: StoryDifficulty;
  onSetFlag: (flag: string) => void;
  onAllComplete: () => void;
  onClose: () => void;
}

type Stage = 'intro' | 'categories' | 'questions';

const CORRECT_PAUSE_MS = 700;
const WRONG_FLASH_MS = 2000;
const WRONG_FLASH = 'Wrong answer';
const DEFAULT_WRONG_MESSAGE = 'Not quite - try again.';
const RESTART_MESSAGE = 'Too many mistakes - this topic starts over from question 1.';

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  onWrongText?: string;
  codeSnippet?: string;
  expectedCode?: string;
}

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// shuffled so answers cannot be memorized by position
const shuffleQuestion = (q: QuizQuestion): ShuffledQuestion => {
  if (q.codeSnippet !== undefined) {
    return {
      question: q.question,
      options: [],
      correctIndex: 0,
      onWrongText: q.onWrongText,
      codeSnippet: q.codeSnippet,
      expectedCode: q.expectedCode,
    };
  }
  const order = shuffleArray(q.options.map((_, i) => i));
  return {
    question: q.question,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
    onWrongText: q.onWrongText,
  };
};

// topics not split by level yet use the whole pool
const questionsForDifficulty = (category: QuizCategory, difficulty: StoryDifficulty): QuizQuestion[] => {
  const matching = category.questions.filter((q) => (q.difficulty ?? DEFAULT_DIFFICULTY) === difficulty);
  return matching.length > 0 ? matching : category.questions;
};

const QuizPopup: React.FC<QuizPopupProps> = ({ quiz, flags, difficulty, onSetFlag, onAllComplete, onClose }) => {
  const [stage, setStage] = useState<Stage>(flags[quiz.introSeenFlag] ? 'categories' : 'intro');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [locked, setLocked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const later = useTimeouts();

  const activeCategory: QuizCategory | undefined = useMemo(
    () => quiz.categories.find((c) => c.id === activeCategoryId),
    [quiz.categories, activeCategoryId]
  );

  const mistakeLimit = maxMistakesByDifficulty[difficulty];

  const handleIntroComplete = () => {
    onSetFlag(quiz.introSeenFlag);
    setStage('categories');
  };

  const startTopic = (category: QuizCategory) => {
    setShuffledQuestions(shuffleArray(questionsForDifficulty(category, difficulty)).map(shuffleQuestion));
    setQuestionIndex(0);
    setFeedback(null);
    setMistakes(0);
    setNotice(null);
    setRunId((r) => r + 1);
  };

  const handlePickCategory = (categoryId: string) => {
    const category = quiz.categories.find((c) => c.id === categoryId);
    if (!category || flags[category.completionFlag]) return;
    setActiveCategoryId(categoryId);
    startTopic(category);
    setStage('questions');
  };

  const handleBackToCategories = () => {
    setActiveCategoryId(null);
    setStage('categories');
  };

  const handleCorrect = (category: QuizCategory) => {
    setFeedback('correct');
    setNotice(null);
    const isLastQuestion = questionIndex === shuffledQuestions.length - 1;
    later(() => {
      if (!isLastQuestion) {
        setQuestionIndex((i) => i + 1);
        setFeedback(null);
        return;
      }
      onSetFlag(category.completionFlag);
      const everyTopicDone = quiz.categories.every((c) => c.id === category.id || flags[c.completionFlag]);
      if (everyTopicDone) onAllComplete();
      else handleBackToCategories();
    }, CORRECT_PAUSE_MS);
  };

  const handleWrong = (category: QuizCategory, hint?: string) => {
    const nextMistakes = mistakes + 1;
    const restarts = exceedsMistakeLimit(nextMistakes, mistakeLimit);
    const message = restarts ? RESTART_MESSAGE : hint || DEFAULT_WRONG_MESSAGE;
    setFeedback('wrong');
    setNotice(WRONG_FLASH);
    setLocked(true);
    later(() => {
      setLocked(false);
      if (restarts) startTopic(category);
      else setMistakes(nextMistakes);
      setFeedback('wrong');
      setNotice(message);
    }, WRONG_FLASH_MS);
  };

  const applyResult = (isCorrect: boolean, hint?: string) => {
    if (!activeCategory || feedback === 'correct') return;
    if (isCorrect) handleCorrect(activeCategory);
    else handleWrong(activeCategory, hint);
  };

  const handleSelect = (optionId: string) => {
    const question = shuffledQuestions[questionIndex];
    if (!question) return;
    applyResult(Number(optionId) === question.correctIndex, question.onWrongText);
  };

  const handleCodeSubmit = (code: string) => {
    const question = shuffledQuestions[questionIndex];
    if (!question || question.expectedCode === undefined) return;
    applyResult(sameCode(code, question.expectedCode), question.onWrongText);
  };

  if (stage === 'intro') {
    return (
      <StoryIntroDialog
        title={quiz.introTitle}
        pages={quiz.introPages.map((text) => ({ text }))}
        onComplete={handleIntroComplete}
        onClose={onClose}
      />
    );
  }

  const doneCount = quiz.categories.filter((c) => flags[c.completionFlag]).length;

  const handleDebugCompleteAll = () => {
    quiz.categories.forEach((c) => {
      if (!flags[c.completionFlag]) onSetFlag(c.completionFlag);
    });
    onAllComplete();
  };
  const currentQuestion = shuffledQuestions[questionIndex];
  const isCodeQuestion = currentQuestion?.codeSnippet !== undefined;
  const attemptsLeft = mistakeLimit === null ? null : Math.max(0, mistakeLimit - mistakes);

  return (
    <div className="quiz-popup-backdrop">
      <div className="quiz-popup-container">
        <div className="rpgui-container framed-golden quiz-popup-box">
          <button type="button" className="quiz-popup-exit pixel-button" onClick={onClose} aria-label="Exit quiz">
            ×
          </button>
          <h3 className="quiz-popup-title">{quiz.title}</h3>
          <div className="dialog-separator">
            <hr className="golden" />
          </div>

          {stage === 'categories' && (
            <>
              <p className="quiz-popup-question">Pick a topic to practice:</p>
              <DialogueChoices
                choices={quiz.categories.map((c) => ({
                  id: c.id,
                  label: flags[c.completionFlag] ? `✓ ${c.label}` : c.label,
                  disabled: flags[c.completionFlag],
                  hint: c.hint,
                }))}
                onSelect={handlePickCategory}
              />
              <span className="quiz-popup-progress">
                {doneCount} / {quiz.categories.length} topics
              </span>
              {isDev && (
                <button type="button" className="quiz-debug-complete" onClick={handleDebugCompleteAll}>
                  Debug: complete all
                </button>
              )}
            </>
          )}

          {stage === 'questions' && activeCategory && currentQuestion && (
            <>
              <p className="quiz-popup-progress-inline">
                {activeCategory.label}
                {attemptsLeft !== null && (
                  <span className="quiz-popup-attempts">
                    {attemptsLeft} mistake{attemptsLeft === 1 ? '' : 's'} left
                  </span>
                )}
              </p>
              <p className="quiz-popup-question">{currentQuestion.question}</p>

              {isCodeQuestion ? (
                <CodeFixEditor
                  key={`${runId}-${questionIndex}`}
                  initialCode={currentQuestion.codeSnippet ?? ''}
                  onSubmit={handleCodeSubmit}
                  disabled={feedback === 'correct' || locked}
                />
              ) : (
                <DialogueChoices
                  key={`${runId}-${questionIndex}`}
                  choices={currentQuestion.options.map((opt, i) => ({
                    id: String(i),
                    label: opt,
                  }))}
                  onSelect={handleSelect}
                  disabled={feedback === 'correct' || locked}
                />
              )}

              {feedback === 'correct' && <p className="quiz-popup-feedback correct">Correct!</p>}
              {feedback === 'wrong' && notice && <p className="quiz-popup-feedback wrong">{notice}</p>}

              <div className="quiz-popup-footer">
                <button type="button" className="quiz-popup-back" onClick={handleBackToCategories}>
                  ← back to topics
                </button>
                <span className="quiz-popup-progress">
                  {questionIndex + 1}/{shuffledQuestions.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;
