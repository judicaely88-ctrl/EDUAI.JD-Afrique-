import React, { useState, useEffect } from "react";
import { AfricanCountry } from "../types";
import { AFRICAN_COUNTRIES } from "../data/africanCountries";
import {
  GraduationCap,
  Sparkles,
  Wifi,
  BookOpen,
  Compass,
  Activity,
  CreditCard,
  Camera,
  Target,
  Phone,
  MessageCircle,
  Share2,
} from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCountry: AfricanCountry;
  setSelectedCountry: (country: AfricanCountry) => void;
  isOnline: boolean;
  connectedCount?: number;
  onOpenAssistance?: () => void;
  onOpenShareProtection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedCountry,
  setSelectedCountry,
  isOnline,
  connectedCount = 1,
  onOpenAssistance,
  onOpenShareProtection,
}) => {
  const tabs = [
    { id: "home", label: "Accueil", icon: Compass },
    { id: "teacher", label: "Professeur JD 24/7", icon: Sparkles },
    { id: "exams", label: "Examens & Concours", icon: GraduationCap },
    { id: "courses", label: "Cours & Fiches", icon: BookOpen },
    { id: "photo", label: "Résoudre par Photo", icon: Camera },
    { id: "train", label: "S'entraîner", icon: Target },
    { id: "quiz", label: "Mes Quiz", icon: BookOpen },
    { id: "admin", label: "Gérance JDDIGITAL", icon: Activity, isSpecial: true },
    { id: "settings", label: "Paramètres", icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Tarification, WhatsApp OM/Wave, and Live Connected Counter */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider text-emerald-400">EDUAI</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">JDDIGITAL</span>
            <span className="hidden md:inline text-amber-300">« Apprendre. Comprendre. Réussir. »</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Contact Button: WhatsApp Orange Money Wave */}
            <button
              onClick={onOpenAssistance}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition-colors cursor-pointer"
              title="Assistance JDDIGITAL • 07 47 57 51 08"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assistance : 07 47 57 51 08</span>
            </button>

            {/* Live Connected Users Count */}
            <button
              onClick={() => setCurrentTab("admin")}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Voir la gérance des connectés"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{connectedCount} connecté(s)</span>
            </button>

            {/* Pricing Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30">
              <CreditCard className="w-3 h-3 text-purple-300" />
              <span>15 000 / 20 000 FCFA</span>
            </span>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className={`w-3.5 h-3.5 ${isOnline ? "text-emerald-400" : "text-amber-400"}`} />
              <span className="hidden lg:inline text-[11px]">
                {isOnline ? "Connecté" : "Hors-ligne"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setCurrentTab("home")}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:shadow-lg transition-all">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                EDUAI<span className="text-emerald-600">.JD</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                Afrique
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Assistant Éducatif Intelligent</p>
          </div>
        </button>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Share Protected Trigger */}
          <button
            onClick={onOpenShareProtection}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs"
            title="Partager l'application (Protégé)"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Partager</span>
          </button>

          {/* Assistance Quick Button */}
          <button
            onClick={onOpenAssistance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Contacter JDDIGITAL au 07 47 57 51 08"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Assistance :</span>
            <span>07 47 57 51 08</span>
          </button>

          {/* Quick link to connected users monitor */}
          <button
            onClick={() => setCurrentTab("admin")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Gérance :</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black text-[11px]">
              {connectedCount}
            </span>
          </button>

          {/* Country Selector */}
          <select
            id="country-select"
            aria-label="Sélectionner le pays africain"
            value={selectedCountry.id}
            onChange={(e) => {
              const found = AFRICAN_COUNTRIES.find((c) => c.id === e.target.value);
              if (found) setSelectedCountry(found);
            }}
            className="text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs hover:bg-slate-100 transition-colors"
          >
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav Tabs Bar */}
      <nav aria-label="Navigation principale" className="bg-slate-50 border-t border-slate-200/80 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? tab.isSpecial
                      ? "bg-slate-900 text-emerald-400 shadow-xs font-bold"
                      : "bg-emerald-600 text-white shadow-xs"
                    : tab.isSpecial
                    ? "text-slate-900 font-bold bg-emerald-100 hover:bg-emerald-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {tab.isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>}
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
