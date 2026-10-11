import React, { useState, useEffect } from "react";
import { AfricanCountry, QuizQuestion, QuizResult, SubjectCategory } from "../types";
import { QUIZZES_DATABASE } from "../data/quizzesDatabase";
import { MathView } from "../utils/mathRenderer";
import { generateQuizResultPDF } from "../utils/pdfGenerator";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  ArrowRight,
  ArrowLeft,
  Filter,
} from "lucide-react";

interface QuizViewProps {
  selectedCountry: AfricanCountry;
}

export const QuizView: React.FC<QuizViewProps> = ({ selectedCountry }) => {
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [enableTimer, setEnableTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const activeQuestions = QUIZZES_DATABASE.filter((q) => {
    if (filterSubject !== "all" && q.subject !== filterSubject) return false;
    return true;
  });

  const totalQuestions = activeQuestions.length;

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (enableTimer && !isCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [enableTimer, isCompleted, timeRemaining]);

  const handleSelectOption = (optionIndex: number) => {
    if (isCompleted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optionIndex });
  };

  const handleFinishQuiz = () => {
    let score = 0;
    const userAnswers = activeQuestions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        question: q.question,
        selectedAnswer: selected !== undefined ? q.options[selected] : "Non répondu",
        correctAnswer: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const result: QuizResult = {
      quizTitle: `Quiz ${filterSubject === "all" ? "Général" : filterSubject} - EDUAI`,
      subject: (filterSubject === "all" ? "Mathématiques" : filterSubject) as SubjectCategory,
      level: "Lycée",
      totalQuestions,
      score,
      percentage,
      date: new Date().toLocaleDateString("fr-FR"),
      userAnswers,
    };

    setQuizResult(result);
    setIsCompleted(true);
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setQuizResult(null);
    setTimeRemaining(180);
  };

  const currentQ = activeQuestions[currentIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 text-purple-800">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              MES QUIZ
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Évaluations interactives avec auto-notation locale instantanée (Moteur Local, sans IA distante).
          </p>
        </div>

        {/* Timer toggle if not completed */}
        {!isCompleted && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnableTimer(!enableTimer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                enableTimer
                  ? "bg-purple-100 text-purple-900 border-purple-300"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Chronomètre {enableTimer ? `(${formatTimer(timeRemaining)})` : "Désactivé"}</span>
            </button>
          </div>
        )}
      </div>

      {!isCompleted ? (
        /* Active Quiz Screen */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>
                Question {currentIndex + 1} sur {totalQuestions}
              </span>
              <span>
                {Math.round(((currentIndex + 1) / totalQuestions) * 100)}% complété
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Statement */}
          {currentQ && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {currentQ.subject} • {currentQ.difficulty}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
                {currentQ.mathExpression && (
                  <div className="mt-3">
                    <MathView content={`$$${currentQ.mathExpression}$$`} />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-700 shadow-md scale-[1.01]"
                          : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-3 ${
                          isSelected ? "bg-white text-purple-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Précédente
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Suivante
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Terminer et voir mon score
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished & Results Screen */
        quizResult && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Score Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Bilan de l'évaluation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                {quizResult.score} / {quizResult.totalQuestions}
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 font-bold text-sm">
                Taux de réussite : {quizResult.percentage}%
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {quizResult.percentage >= 80
                  ? "Félicitations ! Tu maîtrises parfaitement ces concepts du programme."
                  : quizResult.percentage >= 50
                  ? "Bon travail ! Tu as acquis l'essentiel, revois les quelques questions incorrectes."
                  : "Prends le temps de consulter la fiche de révision correspondante avant de retenter ta chance !"}
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => generateQuizResultPDF(quizResult)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le bilan en PDF
                </button>

                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recommencer le quiz
                </button>
              </div>
            </div>

            {/* Detailed correction item by item */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Correction détaillée question par question
              </h3>

              <div className="space-y-4">
                {quizResult.userAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-2xl p-5 space-y-2.5 ${
                      item.isCorrect
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-rose-200 bg-rose-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Question {idx + 1}</span>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          item.isCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {item.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">{item.question}</p>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Ta réponse :</strong> {item.selectedAnswer}
                      </p>
                      {!item.isCorrect && (
                        <p className="text-emerald-800 font-semibold">
                          <strong>Bonne réponse :</strong> {item.correctAnswer}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg">
                      <strong className="text-slate-800">Explication :</strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
