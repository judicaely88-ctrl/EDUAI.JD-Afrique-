import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  Copy,
  Check,
  X,
  ExternalLink,
  HelpCircle,
  Lock,
} from "lucide-react";

interface AssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

export const AssistanceModal: React.FC<AssistanceModalProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const PHONE_NUMBER = "07 47 57 51 08";
  const PHONE_INTL = "+2250747575108";
  const WHATSAPP_URL = `https://wa.me/2250747575108?text=${encodeURIComponent(
    `Bonjour JDDIGITAL,\nJe vous contacte depuis l'application EDUAI pour une assistance / un abonnement.\nMon identifiant : ${clientId || "Élève"}\nMerci !`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText("0747575108");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Phone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Contact & Assistance Directe
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            JDDIGITAL • Créateur EduAI
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Assistance technique, activation d'abonnement & support pédagogique 24/7.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Main phone highlight */}
          <div className="bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 rounded-2xl p-5 border-2 border-emerald-500/30 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Numéro Officiel WhatsApp • Orange Money • Wave
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  {PHONE_NUMBER}
                </div>
                <span className="text-xs text-slate-600 font-semibold">
                  (Indicatif : Côte d'Ivoire +225)
                </span>
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copier</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${PHONE_INTL}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            {/* Badges of supported services */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp 24/7
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                Orange Money
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                Wave Côte d'Ivoire
              </span>
            </div>
          </div>

          {/* Pricing breakdown & Subscription payment */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Tarification officielle pour l'accès complet :
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900">
                    Hors classe d'examen
                  </span>
                  <span className="text-sm font-black text-blue-900">
                    15 000 FCFA
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Primaire, 6e, 5e, 4e, 2nde, 1ère • Accès annuel illimité
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900">
                    Classe d'examen
                  </span>
                  <span className="text-sm font-black text-purple-900">
                    20 000 FCFA
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  CEPE, BEPC, Baccalauréat • Tout inclus + Annales certifiées
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              💡 <strong>Pour s'abonner :</strong> Effectuez votre transfert par <strong>Orange Money</strong> ou <strong>Wave</strong> au <strong>07 47 57 51 08</strong>, puis envoyez la preuve ou votre numéro par WhatsApp à JDDIGITAL pour activation immédiate de votre terminal.
            </p>
          </div>

          {/* Exclusive sharing policy notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                Protection & Partage exclusif par JDDIGITAL :
              </strong>
              <span>
                Seul <strong>JDDIGITAL</strong> est autorisé à générer et distribuer les liens d'accès de l'application. Aucun utilisateur ne peut transférer ou revendre son lien sans validation préalable du créateur.
              </span>
            </div>
          </div>

          {/* Direct WhatsApp CTA Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Discuter avec JDDIGITAL sur WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
};
