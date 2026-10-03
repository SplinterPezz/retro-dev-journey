import React, { useMemo, useState } from 'react';
import { QuizData, QuizCategory, QuizQuestion, StoryDifficulty } from '../../types/story';
import { maxMistakesByDifficulty } from '../../config/story/difficulty';
import DialogueChoices from './DialogueChoices';
import CodeFixEditor from './CodeFixEditor';
import StoryIntroDialog from './StoryIntroDialog';
import './QuizPopup.css';

interface QuizPopupProps {
  quiz: QuizData;
  flags: Record<string, boolean>;
  difficulty: StoryDifficulty;
  onSetFlag: (flag: string) => void;
  onAllComplete: () => void;
  onClose: () => void;
}

type Stage = 'intro' | 'categories' | 'questions';

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

// Randomize both question order and each question's answer order so the
// quiz can't just be memorized by button position/sequence. Code-fix
// questions have no options to shuffle.
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

// Only the questions written for the chosen difficulty; falls back to the
// whole pool for a topic that hasn't been split by level yet.
const questionsForDifficulty = (category: QuizCategory, difficulty: StoryDifficulty): QuizQuestion[] => {
  const matching = category.questions.filter((q) => (q.difficulty ?? 'junior') === difficulty);
  return matching.length > 0 ? matching : category.questions;
};

const normalizeCode = (code: string) => code.replace(/\s+/g, '');

// Multi-stage quiz: a one-time 2-page intro (StoryIntroDialog), then a
// category picker, then that category's questions for the chosen difficulty.
// Finishing a category marks it done; once every category is done, the whole
// station is complete. Difficulty also sets how many mistakes a topic allows
// before it restarts from question 1.
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

  // Shared outcome handler for both option picks and code fixes.
  const applyResult = (isCorrect: boolean, wrongText?: string) => {
    if (!activeCategory || feedback === 'correct') return;

    if (isCorrect) {
      setFeedback('correct');
      setNotice(null);
      const isLastQuestion = questionIndex === shuffledQuestions.length - 1;
      setTimeout(() => {
        if (isLastQuestion) {
          onSetFlag(activeCategory.completionFlag);
          const allDone = quiz.categories.every(
            (c) => c.id === activeCategory.id || flags[c.completionFlag]
          );
          if (allDone) {
            onAllComplete();
          } else {
            handleBackToCategories();
          }
        } else {
          setQuestionIndex((i) => i + 1);
          setFeedback(null);
        }
      }, 700);
      return;
    }

    // Brief "Wrong answer" flash, then the usual hint / restart message.
    const nextMistakes = mistakes + 1;
    const restarts = mistakeLimit !== null && nextMistakes >= mistakeLimit;
    const afterFlash = restarts
      ? 'Too many mistakes - this topic starts over from question 1.'
      : wrongText || 'Not quite - try again.';
    setFeedback('wrong');
    setNotice('Wrong answer');
    setLocked(true);
    setTimeout(() => {
      setLocked(false);
      setNotice(afterFlash);
      if (restarts) {
        startTopic(activeCategory);
        setFeedback('wrong');
        setNotice(afterFlash);
      } else {
        setMistakes(nextMistakes);
      }
    }, 2000);
  };

  const handleSelect = (optionId: string) => {
    const question = shuffledQuestions[questionIndex];
    if (!question) return;
    applyResult(Number(optionId) === question.correctIndex, question.onWrongText);
  };

  const handleCodeSubmit = (code: string) => {
    const question = shuffledQuestions[questionIndex];
    if (!question || question.expectedCode === undefined) return;
    applyResult(normalizeCode(code) === normalizeCode(question.expectedCode), question.onWrongText);
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
  const currentQuestion = shuffledQuestions[questionIndex];
  const isCodeQuestion = currentQuestion?.codeSnippet !== undefined;
  const attemptsLeft = mistakeLimit === null ? null : Math.max(0, mistakeLimit - mistakes);

  return (
    <div className="quiz-popup-backdrop">
      <div className="quiz-popup-container">
        <div className="rpgui-container framed-golden quiz-popup-box">
          <button type="button" className="quiz-popup-exit" onClick={onClose} aria-label="Exit quiz">
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
                }))}
                onSelect={handlePickCategory}
              />
              <span className="quiz-popup-progress">
                {doneCount} / {quiz.categories.length} topics
              </span>
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
