import React, { useState, useEffect } from "react";
import { CourseSheet, SubjectCategory, AfricanCountry } from "../types";
import { COURSES_DATABASE } from "../data/coursesDatabase";
import { MathView } from "../utils/mathRenderer";
import { generateCoursePDF } from "../utils/pdfGenerator";
import { cacheCourse, isCourseCached } from "../utils/localCache";
import {
  BookOpen,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  X,
  HelpCircle,
  Database,
} from "lucide-react";

interface CoursesViewProps {
  selectedCountry: AfricanCountry;
  selectedCourseId?: string;
  setSelectedCourseId?: (id: string | undefined) => void;
  onRecordRecent?: (course: CourseSheet) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  selectedCountry,
  selectedCourseId,
  setSelectedCourseId,
  onRecordRecent,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyCached, setOnlyCached] = useState<boolean>(false);
  const [activeCourse, setActiveCourse] = useState<CourseSheet | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  useEffect(() => {
    if (selectedCourseId) {
      const found = COURSES_DATABASE.find((c) => c.id === selectedCourseId);
      if (found) {
        setActiveCourse(found);
        cacheCourse(found); // Auto-cache
        if (onRecordRecent) onRecordRecent(found);
      }
    }
  }, [selectedCourseId, onRecordRecent]);

  const filteredCourses = COURSES_DATABASE.filter((c) => {
    if (onlyCached && !isCourseCached(c.id)) return false;
    if (filterSubject !== "all" && c.subject !== filterSubject) return false;
    if (filterLevel !== "all" && c.level !== filterLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.chapter.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const subjects: SubjectCategory[] = [
    "Mathématiques",
    "Physique-Chimie",
    "Sciences de la Vie et de la Terre",
    "Français",
    "Philosophie",
    "Histoire-Géographie",
    "Anglais",
    "Informatique",
    "Économie",
  ];

  const handleOpenCourse = (course: CourseSheet) => {
    setActiveCourse(course);
    setQuizAnswers({});
    setShowQuizResults(false);
    cacheCourse(course); // Auto-cache into local storage for offline access
    if (setSelectedCourseId) setSelectedCourseId(course.id);
    if (onRecordRecent) onRecordRecent(course);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseCourse = () => {
    setActiveCourse(null);
    if (setSelectedCourseId) setSelectedCourseId(undefined);
  };

  return (
    <div className="space-y-8 pb-16">
      {activeCourse ? (
        /* Full Course Sheet Reader */
        <div className="space-y-6">
          <button
            onClick={handleCloseCourse}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux fiches de cours
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold uppercase px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                    {activeCourse.subject}
                  </span>
                  <span className="font-bold text-slate-500">•</span>
                  <span className="font-bold text-slate-700">{activeCourse.level}</span>
                  <span className="font-bold text-slate-500">•</span>
                  <span className="text-slate-500 font-medium">Chapitre : {activeCourse.chapter}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  {activeCourse.title}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enregistré dans le cache local (100% accessible hors-connexion)</span>
                </div>
              </div>

              <button
                onClick={() => generateCoursePDF(activeCourse)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                TÉLÉCHARGER EN PDF
              </button>
            </div>

            {/* 1. Objectifs */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                1. Objectifs d'apprentissage du chapitre
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-indigo-950 font-medium">
                {activeCourse.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Définitions essentielles */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                2. Définitions essentielles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeCourse.definitions.map((d, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-xs font-black text-slate-900 block mb-1">
                      {d.term}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {d.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Formules & Règles clés */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                3. Formules et relations fondamentales
              </h3>
              <div className="space-y-2.5">
                {activeCourse.keyFormulas.map((f, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        {f.name} :
                      </span>
                      <MathView content={f.formula} className="text-sm font-serif font-bold text-slate-900" />
                    </div>
                    {f.note && (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {f.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Exemples d'application résolus */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                4. Exemples d'application résolus pas à pas
              </h3>
              <div className="space-y-4">
                {activeCourse.examples.map((ex, i) => (
                  <div key={i} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{ex.title}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Résolu
                      </span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                      <span className="font-bold text-slate-900 block mb-1">Énoncé :</span>
                      <MathView content={ex.problem} />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                      <span className="font-bold text-emerald-800 block mb-1">Résolution :</span>
                      <MathView content={ex.resolution} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Pièges & Erreurs fréquentes */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                5. Pièges classiques et erreurs fréquentes à éviter
              </h3>
              <ul className="space-y-2 text-xs text-amber-950 font-medium">
                {activeCourse.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Résumé Express */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                6. Résumé express à retenir pour le jour de l'examen
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {activeCourse.summary}
              </p>
            </div>

            {/* 7. Quiz Flash */}
            {activeCourse.quickQuiz && activeCourse.quickQuiz.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    Quiz Flash de validation des acquis
                  </h3>
                  {showQuizResults && (
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setShowQuizResults(false);
                      }}
                      className="text-xs font-bold text-purple-700 hover:underline"
                    >
                      Recommencer le quiz
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {activeCourse.quickQuiz.map((q, qIdx) => {
                    const selected = quizAnswers[qIdx];
                    const hasAnswered = selected !== undefined;
                    return (
                      <div key={qIdx} className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                        <span className="text-xs font-bold text-slate-900 block">
                          Question {qIdx + 1} : {q.question}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = selected === oIdx;
                            const isCorrect = q.correctIndex === oIdx;

                            let btnStyle = "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100";
                            if (showQuizResults) {
                              if (isCorrect) btnStyle = "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold";
                              else if (isChosen && !isCorrect)
                                btnStyle = "bg-rose-100 text-rose-950 border-rose-400";
                            } else if (isChosen) {
                              btnStyle = "bg-purple-100 text-purple-950 border-purple-400 font-bold";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (!showQuizResults) {
                                    setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
                                  }
                                }}
                                className={`text-left text-xs p-3 rounded-lg border transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showQuizResults && (
                          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                            <span className="font-bold text-slate-900">Explication : </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!showQuizResults && Object.keys(quizAnswers).length === activeCourse.quickQuiz.length && (
                  <button
                    onClick={() => setShowQuizResults(true)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Valider mes réponses
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Course Directory View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  COURS ET FICHES DE RÉVISION
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fiches pédagogiques synthétiques avec définitions, formules clés et résumés express.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-blue-600" />
              Filtrer les cours
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Matière :</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les matières</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Niveau :</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="Collège">Collège</option>
                  <option value="Lycée">Lycée</option>
                  <option value="Supérieur">Supérieur</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mot-clé :</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: second degré, Newton..."
                    className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Cache filter header bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{filteredCourses.length} fiche(s) disponible(s)</span>
              <button
                onClick={() => setOnlyCached(!onlyCached)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  onlyCached
                    ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{onlyCached ? "Filtré : En cache hors-ligne" : "Filtrer : En cache hors-ligne"}</span>
              </button>
            </div>
            <span className="font-semibold text-blue-700">
              Fiches consultées enregistrées pour le mode hors-ligne
            </span>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {course.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCourseCached(course.id) && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          <Database className="w-3 h-3 text-blue-600" />
                          En cache
                        </span>
                      )}
                      <span className="font-bold text-slate-500">{course.level}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs font-bold text-slate-600">
                    Chapitre : {course.chapter}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {course.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenCourse(course)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Consulter la fiche
                  </button>

                  <button
                    onClick={() => generateCoursePDF(course)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    title="Télécharger en PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
