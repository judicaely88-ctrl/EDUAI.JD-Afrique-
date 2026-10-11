import React, { useState, useEffect } from "react";
import { AfricanCountry, RecentItem } from "../types";
import { EXAMS_DATABASE } from "../data/examsDatabase";
import { COURSES_DATABASE } from "../data/coursesDatabase";
import { getCachedExams, getCachedCourses } from "../utils/localCache";
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Camera,
  Target,
  Award,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Clock,
  Database,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  selectedCountry: AfricanCountry;
  setSelectedExamId?: (id: string) => void;
  setSelectedCourseId?: (id: string) => void;
  recentItems: RecentItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  selectedCountry,
  setSelectedExamId,
  setSelectedCourseId,
  recentItems,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cachedExams, setCachedExams] = useState(() => getCachedExams());
  const [cachedCourses, setCachedCourses] = useState(() => getCachedCourses());

  useEffect(() => {
    setCachedExams(getCachedExams());
    setCachedCourses(getCachedCourses());
  }, []);

  // Filter content matching search query
  const matchingExams = searchQuery
    ? EXAMS_DATABASE.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.examType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchingCourses = searchQuery
    ? COURSES_DATABASE.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.chapter.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const mainCards = [
    {
      id: "teacher",
      title: "Professeur JD ton assistant personnel 24/7",
      tagline: "Pose une question par écrit ou au micro vocal 24/7",
      description: "Chatbot contextuel optimisé par Gemini. Fonctionne avec connexion Internet (sans crédit téléphonique). Résolution en 9 étapes.",
      icon: Sparkles,
      color: "from-indigo-600 to-violet-600",
      accent: "bg-indigo-50 text-indigo-700 border-indigo-200",
      badge: "Gemini 24/7 Vocal",
    },
    {
      id: "exams",
      title: "EXAMENS ET CONCOURS",
      tagline: "Annales et corrigés officiels africains",
      description: "CEPE, BEPC, Baccalauréats (Séries C, D, A, S2, etc.) et concours avec corrigés complets.",
      icon: GraduationCap,
      color: "from-emerald-600 to-teal-700",
      accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badge: "54 Pays Prévus",
    },
    {
      id: "courses",
      title: "COURS ET RÉVISIONS",
      tagline: "Fiches synthétiques et formules clés",
      description: "Définitions, théorèmes, résumés, exemples résolus et pièges fréquents téléchargeables en PDF.",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-700",
      accent: "bg-blue-50 text-blue-700 border-blue-200",
      badge: "Conforme Programmes",
    },
    {
      id: "photo",
      title: "RÉSOUDRE PAR PHOTO",
      tagline: "Prends en photo ton exercice ou ton devoir",
      description: "Extraction du texte mathématique et résolution méthodique étape par étape.",
      icon: Camera,
      color: "from-rose-600 to-pink-600",
      accent: "bg-rose-50 text-rose-700 border-rose-200",
      badge: "Vision & OCR",
    },
    {
      id: "train",
      title: "S'ENTRAÎNER",
      tagline: "Générateur d'exercices à variations infinies",
      description: "Exercices mathématiques et scientifiques générés localement avec vérification instantanée.",
      icon: Target,
      color: "from-amber-600 to-orange-600",
      accent: "bg-amber-50 text-amber-700 border-amber-200",
      badge: "Calcul Local",
    },
    {
      id: "quiz",
      title: "MES QUIZ",
      tagline: "Évaluations interactives et auto-notation",
      description: "Teste tes connaissances, chronomètre tes révisions et télécharge ton bilan en PDF.",
      icon: Award,
      color: "from-purple-600 to-fuchsia-600",
      accent: "bg-purple-50 text-purple-700 border-purple-200",
      badge: "0 Crédit Nécessaire",
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <span>{selectedCountry.flagEmoji}</span>
            <span>{selectedCountry.name}</span>
            <span className="text-slate-400">•</span>
            <span>{selectedCountry.educationSystem}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Bienvenue sur <span className="text-emerald-400">EduAI</span> !
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
            « Avec le Professeur JD ton assistant personnel 24/7 : Apprendre, Comprendre et Réussir tes examens. »
          </p>

          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Conçu par <strong className="text-white">JDDIGITAL</strong> pour tous les apprenants et élèves d'Afrique.
            Accès complet à <span className="text-blue-300 font-bold">15 000 FCFA</span> pour les classes hors examen et <span className="text-purple-300 font-bold">20 000 FCFA</span> pour les classes d'examen (CEPE, BEPC, BAC).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab("admin")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Voir les personnes connectées en direct</span>
            </button>
            <button
              onClick={() => setCurrentTab("teacher")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Discuter avec le Professeur JD 24/7</span>
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="pt-4 max-w-2xl">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un examen (ex: Baccalauréat, BEPC), une matière, un chapitre ou une équation..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 focus:border-emerald-500 focus:outline-none transition-all text-sm shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-slate-200"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results if query exists */}
      {searchQuery && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Résultats de recherche pour : « {searchQuery} »
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {matchingExams.length + matchingCourses.length} résultat(s)
            </span>
          </div>

          {matchingExams.length === 0 && matchingCourses.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              Aucun résultat trouvé pour votre recherche. De nouveaux contenus pourront être ajoutés ultérieurement.
            </p>
          ) : (
            <div className="space-y-4">
              {matchingExams.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Examens correspondants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {matchingExams.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => {
                          if (setSelectedExamId) setSelectedExamId(exam.id);
                          setCurrentTab("exams");
                        }}
                        className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-emerald-700 block">
                            {exam.countryName} • {exam.examType} ({exam.year})
                          </span>
                          <span className="text-sm font-semibold text-slate-900">{exam.title}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingCourses.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                    Cours et fiches correspondants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {matchingCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          if (setSelectedCourseId) setSelectedCourseId(course.id);
                          setCurrentTab("courses");
                        }}
                        className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-blue-700 block">
                            {course.subject} • {course.chapter}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">{course.title}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 6 Main Feature Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Que souhaites-tu réviser aujourd'hui ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Accès complet à toutes les rubriques : 15 000 FCFA (classes ordinaires) et 20 000 FCFA (classes d'examen).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mainCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setCurrentTab(card.id)}
                className="group relative text-left bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.accent}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{card.tagline}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{card.description}</p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Accéder à la rubrique</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured African Exams Quick Access */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                <Globe2 className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Prépare ton prochain examen officiel
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sujets officiels avec résolutions détaillées étape par étape, formules et calculs naturels.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab("exams")}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Voir tous les examens
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMS_DATABASE.map((exam) => (
            <div
              key={exam.id}
              className="border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-100">
                    {exam.countryName}
                  </span>
                  <span className="font-bold text-slate-500">{exam.year}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{exam.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{exam.statement}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (setSelectedExamId) setSelectedExamId(exam.id);
                    setCurrentTab("exams");
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Consulter le sujet & corrigé
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Section if exists */}
      {recentItems && recentItems.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">Derniers contenus consultés</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.linkTab)}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/40 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                  {item.type.toUpperCase()} • {item.date}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Offline Cached Materials Section */}
      {(cachedExams.length > 0 || cachedCourses.length > 0) && (
        <section className="bg-white rounded-3xl border border-emerald-500/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                <Database className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Contenus Sauvegardés dans ton Cache Hors-Ligne
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {cachedExams.length + cachedCourses.length} disponible(s) sans Internet
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cachedExams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  if (setSelectedExamId) setSelectedExamId(exam.id);
                  setCurrentTab("exams");
                }}
                className="text-left p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/60 transition-colors"
              >
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Examen en cache • {exam.countryName}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {exam.title}
                </span>
                <span className="text-[11px] text-slate-600 line-clamp-1">
                  {exam.examType} ({exam.year}) • Corrigé 9 étapes inclus
                </span>
              </button>
            ))}

            {cachedCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  if (setSelectedCourseId) setSelectedCourseId(course.id);
                  setCurrentTab("courses");
                }}
                className="text-left p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-100/60 transition-colors"
              >
                <span className="text-[10px] font-extrabold uppercase text-blue-800 block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Cours en cache • {course.subject}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {course.title}
                </span>
                <span className="text-[11px] text-slate-600 line-clamp-1">
                  {course.chapter} • Résumé & Formules
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tarifs Officiels EduAI */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-purple-100 text-purple-800">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Tarifs d'Accès Officiel EduAI (JDDIGITAL)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Deux formules simples adaptées au parcours de chaque apprenant.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab("admin")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
          >
            <span>Voir les connectés en direct</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Plan 1: Classes hors examen */}
          <div className="rounded-3xl border-2 border-blue-500/30 bg-blue-50/30 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-blue-100 text-blue-900">
                  Classes Hors Examen
                </span>
                <span className="text-xs font-bold text-slate-500">Annuel</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">15 000</span>
                  <span className="text-sm font-bold text-slate-600">FCFA / an</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Pour les élèves du Primaire, 6ème, 5ème, 4ème, Seconde et Première.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 font-medium pt-2 border-t border-blue-200/60">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Accès complet au Professeur IA (Écrit & Micro Vocal)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Fiches de révision de tous les cours et résumés express</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Générateur d'exercices d'entraînement et quiz interactifs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Résolution par photo & téléchargements PDF illimités</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentTab("teacher")}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors text-center"
            >
              Souscrire à la formule 15 000 FCFA
            </button>
          </div>

          {/* Plan 2: Classes d'examen */}
          <div className="rounded-3xl border-2 border-purple-500/40 bg-purple-50/40 p-6 flex flex-col justify-between space-y-4 hover:border-purple-500 transition-all relative overflow-hidden shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-purple-200 text-purple-950">
                  Classes d'Examen (Officiel)
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  Succès Garanti
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">20 000</span>
                  <span className="text-sm font-bold text-slate-600">FCFA / an</span>
                </div>
                <p className="text-xs text-purple-950 mt-1 font-semibold">
                  Pour les candidats au CEPE, BEPC, BFEM, DEF, Probatoire et Baccalauréat (A, C, D, S2).
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-800 font-medium pt-2 border-t border-purple-200/60">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Tout le contenu de la formule 15 000 FCFA inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Annales officielles complètes et corrigés détaillés en 9 étapes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Coaching spécifique aux épreuves nationales des 54 pays</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Accès prioritaire à l'assistance pédagogique vocale</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentTab("exams")}
              className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition-colors text-center"
            >
              Souscrire à la formule 20 000 FCFA
            </button>
          </div>
        </div>

        {/* Official contact & Payment card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
              Contact & Paiement Officiel JDDIGITAL
            </span>
            <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>07 47 57 51 08</span>
              <span className="text-xs font-semibold text-slate-300">(Orange Money • Wave • WhatsApp)</span>
            </div>
            <p className="text-xs text-slate-300">
              Pour toute assistance, activation ou paiement, contactez directement le créateur au <strong>07 47 57 51 08</strong>.
            </p>
          </div>

          <a
            href="https://wa.me/2250747575108?text=Bonjour%20JDDIGITAL,%20je%20souhaite%20m'abonner%20ou%20obtenir%20une%20assistance%20sur%20EduAI"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 active:scale-95 shrink-0"
          >
            <span>WhatsApp 07 47 57 51 08</span>
          </a>
        </div>

        {/* Exclusive creator link distribution banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <span className="font-bold text-amber-800">🔒 Règle de partage :</span>
          <span>
            Seul <strong>JDDIGITAL</strong> est habilité à générer et distribuer les liens d'accès officiels d'EduAI. Une personne recevant le lien ne peut pas la redistribuer sans accord préalable. Pour toute demande d'accès pour un proche, contactez le <strong>07 47 57 51 08</strong>.
          </span>
        </div>

        {/* Payment operators footer */}
        <div className="pt-2 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
          <span className="font-semibold text-slate-700">Moyens de paiement acceptés :</span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-100 font-bold text-orange-900 border border-orange-200">Orange Money (07 47 57 51 08)</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 font-bold text-blue-900 border border-blue-200">Wave (07 47 57 51 08)</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 font-bold text-emerald-900 border border-emerald-200">WhatsApp 24/7 (07 47 57 51 08)</span>
        </div>
      </section>

      {/* Trust Banner JDDIGITAL */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Engagement Qualité JDDIGITAL
          </div>
          <h2 className="text-xl font-black">
            L'excellence éducative pour chaque élève et candidat d'Afrique.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            EduAI offre un accompagnement rigoureux et bienveillant adapté aux exigences des programmes officiels africains. Tarifs transparents de 15 000 FCFA (hors examen) et 20 000 FCFA (classe d'examen) pour un accès complet toute l'année.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setCurrentTab("admin")}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Tableau de Bord des Connectés
          </button>
        </div>
      </section>
    </div>
  );
};
