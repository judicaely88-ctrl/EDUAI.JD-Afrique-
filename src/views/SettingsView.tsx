import React, { useState, useEffect } from "react";
import { AfricanCountry, SchoolLevel } from "../types";
import { AFRICAN_COUNTRIES } from "../data/africanCountries";
import { getCacheStats, clearAllCache, CacheStats } from "../utils/localCache";
import {
  Compass,
  GraduationCap,
  Trash2,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface SettingsViewProps {
  selectedCountry: AfricanCountry;
  setSelectedCountry: (country: AfricanCountry) => void;
  userLevel: SchoolLevel;
  setUserLevel: (level: SchoolLevel) => void;
  onClearRecent: () => void;
  isOnline: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedCountry,
  setSelectedCountry,
  userLevel,
  setUserLevel,
  onClearRecent,
  isOnline,
}) => {
  const [cacheStats, setCacheStats] = useState<CacheStats>(() => getCacheStats());

  const handleClearCache = () => {
    if (window.confirm("Es-tu sûr de vouloir vider les cours et examens sauvegardés hors-connexion ?")) {
      clearAllCache();
      setCacheStats(getCacheStats());
    }
  };

  useEffect(() => {
    setCacheStats(getCacheStats());
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-slate-100 text-slate-800">
            <Compass className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            PARAMÈTRES & CACHE HORS-LIGNE
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gère tes préférences scolaires et les contenus enregistrés pour l'accès sans connexion Internet.
        </p>
      </div>

      {/* Preferences Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          Profil et Système Éducatif
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Pays africain par défaut :
            </label>
            <select
              value={selectedCountry.id}
              onChange={(e) => {
                const found = AFRICAN_COUNTRIES.find((c) => c.id === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {AFRICAN_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flagEmoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {selectedCountry.educationSystem}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Niveau scolaire actuel :
            </label>
            <select
              value={userLevel}
              onChange={(e) => setUserLevel(e.target.value as SchoolLevel)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Primaire">Primaire (CEPE / CEP)</option>
              <option value="Collège">Collège (BEPC / BFEM / DEF)</option>
              <option value="Lycée">Lycée (Baccalauréat Séries C, D, A, etc.)</option>
              <option value="Supérieur">Enseignement Supérieur (BTS, Université)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Les explications et exercices s'adaptent automatiquement à ce niveau.
            </p>
          </div>
        </div>
      </div>

      {/* Storage & Offline Cache Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Gestion du Cache Local & Mode Hors-ligne
          </h2>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Stockage Navigateur Actif
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Chaque fois que tu consultes un sujet d'examen officiel ou une fiche de révision, l'application les enregistre automatiquement dans le cache sécurisé de ton appareil. Tu peux les réviser même sans connexion réseau ni forfait Internet mobile.
        </p>

        {/* Cache Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">
              Examens en cache
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {cacheStats.examCount}
            </div>
            <span className="text-[11px] text-slate-500">Sujets & corrigés complets</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 block">
              Cours en cache
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {cacheStats.courseCount}
            </div>
            <span className="text-[11px] text-slate-500">Fiches de cours & résumés</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80">
            <span className="text-[10px] font-extrabold uppercase text-purple-800 block">
              Espace mémoire utilisé
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {cacheStats.approximateSizeKB} <span className="text-xs font-normal">Ko</span>
            </div>
            <span className="text-[11px] text-slate-500">Optimisé et très léger</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
            />
            <span className="font-semibold text-slate-800">
              Statut réseau : {isOnline ? "Connecté à Internet" : "Mode Hors-ligne (Données en cache utilisées)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearCache}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Vider le cache hors-ligne
            </button>
            <button
              onClick={onClearRecent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Effacer historique
            </button>
          </div>
        </div>
      </div>

      {/* Project Vision & Tarification Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            À Propos du Projet EDUAI par JDDIGITAL
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Nom de l'application :</strong> EDUAI (EDUAI.JD)
          </p>
          <p>
            <strong className="text-white">Créateur :</strong> JDDIGITAL
          </p>
          <p>
            <strong className="text-white">Contact & Assistance 24/7 :</strong> 07 47 57 51 08 (WhatsApp, Orange Money, Wave)
          </p>
          <p>
            <strong className="text-white">Slogan officiel :</strong> « Apprendre. Comprendre. Réussir. »
          </p>
          <p>
            <strong className="text-white">Description :</strong> « EduAI avec le Professeur JD ton assistant personnel 24/7 pour apprendre, réviser, comprendre tes erreurs et préparer tes examens en Afrique. »
          </p>
          <p className="border-t border-white/10 pt-3">
            <strong className="text-emerald-400">Tarification Officielle :</strong> L'accès annuel complet est fixé à <strong>15 000 FCFA</strong> pour les élèves hors classe d'examen (Primaire, 6e, 5e, 4e, 2nde, 1ère) et <strong>20 000 FCFA</strong> pour les élèves en classe d'examen (CEPE, BEPC, Baccalauréat, Concours). Paiement par <strong>Orange Money</strong> ou <strong>Wave</strong> au <strong>07 47 57 51 08</strong>.
          </p>
          <p className="border-t border-white/10 pt-3 text-amber-200 text-xs">
            <strong>🔒 Diffusion exclusive :</strong> Seul le créateur <strong>JDDIGITAL</strong> est habilité à générer et distribuer les liens d'accès de l'application. Une personne recevant le lien ne peut pas la repartager à son tour sans autorisation.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/2250747575108?text=Bonjour%20JDDIGITAL,%20je%20vous%20contacte%20depuis%20l'application%20EduAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
            >
              <span>Contacter JDDIGITAL sur WhatsApp (07 47 57 51 08)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
