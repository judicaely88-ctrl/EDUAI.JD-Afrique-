import React, { useState } from "react";
import { ExamSolution } from "../types";
import { MathView } from "../utils/mathRenderer";
import { generateSolutionPDF } from "../utils/pdfGenerator";
import { Check, Copy, Download, AlertTriangle, CheckCircle2, BookOpen, Lightbulb } from "lucide-react";

interface SolutionCardProps {
  title: string;
  solution: ExamSolution;
  questionPrompt?: string;
  sourceBadge?: string;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  title,
  solution,
  questionPrompt,
  sourceBadge = "Corrigé Pédagogique Structuré",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textLines = [
      `=== ${title.toUpperCase()} ===`,
      `[Source: EDUAI par JDDIGITAL]`,
      "",
      `1. Énoncé compris : ${solution.understoodProblem}`,
      `2. Données : ${solution.givenData.join(", ")}`,
      `3. Ce qu'il faut trouver : ${solution.toFind}`,
      `4. Méthode : ${solution.methodology}`,
      "",
      "--- ÉTAPES DE CALCUL ET RAISONNEMENT ---",
      ...solution.steps.map(
        (s) =>
          `Étape ${s.stepNumber} : ${s.title}\n${s.content}\n${(s.calculationLines || []).join("\n")}`
      ),
      "",
      `Résultat final : ${solution.finalResult}`,
      `Vérification : ${solution.verification}`,
      "",
      "Pièges à éviter :",
      ...(solution.commonPitfalls || []).map((p) => `• ${p}`),
    ].join("\n");

    navigator.clipboard.writeText(textLines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    generateSolutionPDF(title, solution, questionPrompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              {sourceBadge}
            </span>
            <span className="text-xs text-slate-300 font-medium">9 étapes pédagogiques</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors active:scale-95"
            title="Copier la solution dans le presse-papier"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copié !" : "Copier"}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors active:scale-95"
            title="Télécharger la correction en PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger en PDF</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* If question prompt exists */}
        {questionPrompt && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Énoncé initial
            </div>
            <MathView content={questionPrompt} className="text-sm font-medium text-slate-900" />
          </div>
        )}

        {/* 1. Compréhension & Données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
              1. Énoncé compris & Données
            </div>
            <p className="text-sm text-slate-800 font-medium mb-2">{solution.understoodProblem}</p>
            <div className="space-y-1">
              {solution.givenData.map((d, i) => (
                <div key={i} className="text-xs text-indigo-950 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              2. Ce qu'il faut trouver & Méthode
            </div>
            <p className="text-sm text-slate-800 font-semibold mb-1">Objectif : {solution.toFind}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              <span className="font-bold text-blue-900">Méthode :</span> {solution.methodology}
            </p>
          </div>
        </div>

        {/* 3. Steps with natural math */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Étapes de résolution et calculs détaillés
          </h4>

          {solution.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  Étape {step.stepNumber} : {step.title}
                </span>
              </div>

              <div className="text-sm text-slate-700 mb-2">
                <MathView content={step.content} />
              </div>

              {step.formulas && step.formulas.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 mb-2.5">
                  <span className="text-[11px] font-bold text-amber-900 block mb-1">Formule applicable :</span>
                  <div className="space-y-1">
                    {step.formulas.map((f, fIdx) => (
                      <MathView key={fIdx} content={f} className="text-sm font-serif font-bold text-slate-900" />
                    ))}
                  </div>
                </div>
              )}

              {step.calculationLines && step.calculationLines.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-sans">
                    Calculs ligne par ligne :
                  </span>
                  {step.calculationLines.map((line, lIdx) => (
                    <MathView key={lIdx} content={line} />
                  ))}
                </div>
              )}

              {step.resultHighlight && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800">Résultat partiel :</span>
                  <MathView
                    content={step.resultHighlight}
                    className="text-xs font-bold text-emerald-700 font-serif"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4. Final Result & Verification */}
        <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Résultat final certifié
          </div>
          <div className="text-base font-bold text-emerald-950 mb-3">
            <MathView content={solution.finalResult} />
          </div>
          <div className="border-t border-emerald-200 pt-2 text-xs text-emerald-800 flex items-start gap-1.5">
            <span className="font-bold whitespace-nowrap">Vérification de cohérence :</span>
            <span>{solution.verification}</span>
          </div>
        </div>

        {/* 5. Common Pitfalls */}
        {solution.commonPitfalls && solution.commonPitfalls.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Erreurs fréquentes et pièges d'examen à éviter
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
              {solution.commonPitfalls.map((pitfall, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Download Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500 font-medium">
            Accès officiel EDUAI • 15 000 FCFA (Hors examen) / 20 000 FCFA (Classe examen) • JDDIGITAL
          </p>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger le corrigé (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
