import React, { useState } from "react";
import { AfricanCountry, SchoolLevel, SubjectCategory } from "../types";
import { generateRandomMathExercise } from "../utils/mathEngine";
import { MathView } from "../utils/mathRenderer";
import { SolutionCard } from "../components/SolutionCard";
import {
  Target,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
} from "lucide-react";

interface TrainViewProps {
  selectedCountry: AfricanCountry;
}

export const TrainView: React.FC<TrainViewProps> = ({ selectedCountry }) => {
  const [difficulty, setDifficulty] = useState<"Facile" | "Intermédiaire" | "Difficile" | "Niveau examen">("Intermédiaire");
  const [currentExercise, setCurrentExercise] = useState(() => generateRandomMathExercise("Intermédiaire"));
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<{ total: number; resolved: number }>({ total: 0, resolved: 0 });

  const handleNextExercise = () => {
    const next = generateRandomMathExercise(difficulty);
    setCurrentExercise(next);
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
  };

  const handleDifficultyChange = (diff: "Facile" | "Intermédiaire" | "Difficile" | "Niveau examen") => {
    setDifficulty(diff);
    const next = generateRandomMathExercise(diff);
    setCurrentExercise(next);
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
  };

  const handleRevealSolution = () => {
    setShowSolution(true);
    setScoreHistory((prev) => ({ ...prev, total: prev.total + 1, resolved: prev.resolved + 1 }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              S'ENTRAÎNER
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Générateur d'exercices d'entraînement mathématiques & scientifiques générés par calcul local.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700">
            Exercices résolus : {scoreHistory.resolved}
          </span>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Niveau de difficulté :
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(["Facile", "Intermédiaire", "Difficile", "Niveau examen"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleDifficultyChange(lvl)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                difficulty === lvl
                  ? "bg-amber-500 text-slate-950 border-amber-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase">
              {difficulty}
            </span>
            <span className="text-xs text-slate-400 font-medium">Généré par algorithme local</span>
          </div>

          <button
            onClick={handleNextExercise}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Autre exercice
          </button>
        </div>

        {/* Statement with natural math */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <span className="text-xs font-extrabold uppercase text-slate-500 block mb-2">
            Énoncé du problème :
          </span>
          <div className="text-base font-bold text-slate-900 leading-relaxed font-serif">
            <MathView content={currentExercise.statement} />
          </div>
        </div>

        {/* Hint toggle */}
        <div>
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              <HelpCircle className="w-4 h-4" />
              Afficher un indice méthodique
            </button>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Indice méthodique :</span>
                <p>{currentExercise.hint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Answer input & actions */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Ta réponse ou tes calculs (optionnel pour t'exercer au brouillon) :
          </label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Écris ton résultat avant de vérifier..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex flex-wrap gap-3 pt-2">
            {!showSolution ? (
              <button
                onClick={handleRevealSolution}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Eye className="w-4 h-4" />
                Vérifier et afficher la correction détaillée (9 étapes)
              </button>
            ) : (
              <button
                onClick={handleNextExercise}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Passer à l'exercice suivant
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full 9-step Solution when revealed */}
      {showSolution && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Correction complète certifiée
            </span>
          </div>

          <SolutionCard
            title={`Résolution Complète : ${difficulty}`}
            solution={currentExercise.solution}
            questionPrompt={currentExercise.statement}
            sourceBadge="Généré et Résolu par Moteur Local Autonome"
          />
        </div>
      )}
    </div>
  );
};
