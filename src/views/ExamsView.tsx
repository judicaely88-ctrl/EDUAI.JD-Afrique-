import React, { useState, useEffect } from "react";
import { AfricanCountry, ExamItem, SchoolLevel } from "../types";
import { AFRICAN_COUNTRIES } from "../data/africanCountries";
import { EXAMS_DATABASE } from "../data/examsDatabase";
import { MathView } from "../utils/mathRenderer";
import { SolutionCard } from "../components/SolutionCard";
import { generateExamPDF } from "../utils/pdfGenerator";
import { cacheExam, isExamCached } from "../utils/localCache";
import {
  GraduationCap,
  Download,
  Eye,
  CheckCircle,
  FileText,
  ArrowLeft,
  X,
  Search,
  Filter,
  Database,
  CheckCircle2,
} from "lucide-react";

interface ExamsViewProps {
  selectedCountry: AfricanCountry;
  setSelectedCountry: (country: AfricanCountry) => void;
  selectedExamId?: string;
  setSelectedExamId?: (id: string | undefined) => void;
  onRecordRecent?: (exam: ExamItem) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedExamId,
  setSelectedExamId,
  onRecordRecent,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyCached, setOnlyCached] = useState<boolean>(false);
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [viewMode, setViewMode] = useState<"statement" | "solution">("solution");

  // Load selected exam if provided from props and auto-cache
  useEffect(() => {
    if (selectedExamId) {
      const found = EXAMS_DATABASE.find((e) => e.id === selectedExamId);
      if (found) {
        setActiveExam(found);
        cacheExam(found);
        if (onRecordRecent) onRecordRecent(found);
      }
    }
  }, [selectedExamId, onRecordRecent]);

  // Filter exams based on criteria
  const filteredExams = EXAMS_DATABASE.filter((exam) => {
    if (onlyCached && !isExamCached(exam.id)) return false;
    if (filterLevel !== "all" && exam.level !== filterLevel) return false;
    if (filterSubject !== "all" && exam.subject !== filterSubject) return false;
    if (filterYear !== "all" && exam.year.toString() !== filterYear) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        exam.title.toLowerCase().includes(q) ||
        exam.examType.toLowerCase().includes(q) ||
        exam.subject.toLowerCase().includes(q) ||
        exam.statement.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const subjects = [
    "Mathématiques",
    "Physique-Chimie",
    "Sciences de la Vie et de la Terre",
    "Français",
    "Philosophie",
    "Histoire-Géographie",
    "Anglais",
  ];

  const years = [2024, 2023, 2022, 2021, 2020];

  const handleOpenExam = (exam: ExamItem, mode: "statement" | "solution") => {
    setActiveExam(exam);
    setViewMode(mode);
    cacheExam(exam); // Automatically save into local cache for offline access
    if (setSelectedExamId) setSelectedExamId(exam.id);
    if (onRecordRecent) onRecordRecent(exam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseDetail = () => {
    setActiveExam(null);
    if (setSelectedExamId) setSelectedExamId(undefined);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Detail Modal / Full View */}
      {activeExam ? (
        <div className="space-y-6">
          <button
            onClick={handleCloseDetail}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des examens
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                    {activeExam.countryName}
                  </span>
                  <span className="font-bold text-slate-500">•</span>
                  <span className="font-bold text-slate-700">{activeExam.examType}</span>
                  <span className="font-bold text-slate-500">•</span>
                  <span className="font-semibold text-slate-600">Session {activeExam.year}</span>
                  <span className="font-bold text-slate-500">•</span>
                  <span className="font-medium text-slate-500">Niveau {activeExam.level}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {activeExam.title}
                </h1>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Source officielle :</span> {activeExam.source}
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enregistré dans le cache local (100% accessible hors-connexion)</span>
                </div>
              </div>

              {/* Top Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => generateExamPDF(activeExam)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger en PDF
                </button>
              </div>
            </div>

            {/* Toggle Mode: Énoncé vs Corrigé */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setViewMode("solution")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "solution"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Voir le Corrigé Détaillé (9 Étapes)
              </button>
              <button
                onClick={() => setViewMode("statement")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "statement"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Consulter l'Énoncé du Sujet
              </button>
            </div>

            {/* Content view */}
            {viewMode === "statement" ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Énoncé Officiel de l'Épreuve
                  </h3>
                  <button
                    onClick={() => setViewMode("solution")}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Passer au corrigé →
                  </button>
                </div>
                <div className="bg-white rounded-xl p-5 border border-slate-200 text-sm font-medium text-slate-800 leading-relaxed">
                  <MathView content={activeExam.statement} />
                </div>
              </div>
            ) : (
              activeExam.solution && (
                <SolutionCard
                  title={`Correction Détaillée : ${activeExam.title}`}
                  solution={activeExam.solution}
                  questionPrompt={activeExam.statement}
                  sourceBadge={
                    activeExam.status === "VERIFIE_OFFICIEL"
                      ? "Corrigé Officiel Vérifié"
                      : "Corrigé Pédagogique Conforme"
                  }
                />
              )
            )}
          </div>
        </div>
      ) : (
        /* Exam List & Filtering */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  EXAMENS ET CONCOURS
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Annales des examens nationaux et concours officiels des pays africains avec corrigés complets.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-emerald-600" />
              Critères de sélection et filtres
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* 1. Country */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">1. Pays :</label>
                <select
                  value={selectedCountry.id}
                  onChange={(e) => {
                    const c = AFRICAN_COUNTRIES.find((x) => x.id === e.target.value);
                    if (c) setSelectedCountry(c);
                  }}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. School Level */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">2. Niveau scolaire :</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="Primaire">Primaire (CEPE / CEP)</option>
                  <option value="Collège">Collège (BEPC / BFEM / DEF)</option>
                  <option value="Lycée">Lycée (Baccalauréat / Probatoire)</option>
                  <option value="Supérieur">Enseignement Supérieur</option>
                </select>
              </div>

              {/* 3. Subject */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">3. Matière :</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Toutes les matières</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Year */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">4. Année :</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Toutes les années</option>
                  {years.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Search text */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">5. Mot-clé :</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: second degré, Pythagore..."
                    className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results count & status */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {filteredExams.length} épreuve(s) trouvée(s)
              </span>

              <button
                onClick={() => setOnlyCached(!onlyCached)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  onlyCached
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{onlyCached ? "Filtré : En cache hors-ligne" : "Filtrer : En cache hors-ligne"}</span>
              </button>
            </div>

            <span className="font-semibold text-emerald-700">
              Examens consultés automatiquement mis en cache pour le mode hors-ligne
            </span>
          </div>

          {/* Exams Grid */}
          {filteredExams.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Aucun examen disponible pour ces critères.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                De nouveaux contenus pourront être ajoutés ultérieurement lors de la numérisation des annales des 54 pays.
                Essaie d'élargir tes filtres ou consulte les annales disponibles pour la Côte d'Ivoire, le Sénégal ou le Cameroun.
              </p>
              <button
                onClick={() => {
                  setFilterLevel("all");
                  setFilterSubject("all");
                  setFilterYear("all");
                  setSearchQuery("");
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {exam.countryName}
                        </span>
                        <span className="text-xs font-bold text-slate-600">{exam.examType}</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-500">{exam.year}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {exam.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Matière : {exam.subject}</span>
                      <span>•</span>
                      <span>Niveau : {exam.level}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Sujet disponible
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-blue-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Corrigé disponible
                      </span>
                      {isExamCached(exam.id) && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <Database className="w-3 h-3 text-emerald-600" />
                          En cache hors-ligne
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      {exam.statement}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenExam(exam, "statement")}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      CONSULTER LE SUJET
                    </button>

                    <button
                      onClick={() => handleOpenExam(exam, "solution")}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      VOIR LE CORRIGÉ
                    </button>

                    <button
                      onClick={() => generateExamPDF(exam)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      title="Télécharger en PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
