import React, { useState } from "react";
import {
  Lock,
  Phone,
  MessageCircle,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";

interface DisconnectedLockScreenProps {
  reason?: string;
  clientId: string;
  onRetryCheck: () => Promise<boolean>;
}

export const DisconnectedLockScreen: React.FC<DisconnectedLockScreenProps> = ({
  reason,
  clientId,
  onRetryCheck,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const PHONE_NUMBER = "07 47 57 51 08";
  const WHATSAPP_URL = `https://wa.me/2250747575108?text=${encodeURIComponent(
    `Bonjour JDDIGITAL,\nMon accès à l'application EduAI a été suspendu / déconnecté.\nIdentifiant élève : ${clientId}\nJe souhaite régulariser mon accès (15 000 FCFA / 20 000 FCFA via Wave/Orange Money).\nMerci !`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText("0747575108");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheck = async () => {
    setIsChecking(true);
    setCheckMessage(null);
    try {
      const isReconnected = await onRetryCheck();
      if (!isReconnected) {
        setCheckMessage("Votre session est toujours en attente de validation par JDDIGITAL. Contactez le créateur.");
      }
    } catch {
      setCheckMessage("Erreur réseau. Vérifiez votre connexion Internet.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-red-500/30 overflow-hidden my-8">
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-slate-900 text-white p-6 sm:p-7 relative">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Lock className="w-6 h-6" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-red-100">
              Contrôle d'Accès JDDIGITAL
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Accès Suspendu par le Créateur
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-1">
            Votre session a été temporairement déconnectée par l'administrateur JDDIGITAL.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Reason display */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Motif de la déconnexion :</span>
            </div>
            <p className="leading-relaxed pl-5">
              {reason ||
                "Votre terminal a été déconnecté par JDDIGITAL ou votre accès annuel nécessite une validation de paiement."}
            </p>
          </div>

          {/* Pricing & Activation procedure */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Régularisation & Tarifs Officiels d'Accès :
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-blue-900 block">
                  Hors classe d'examen :
                </span>
                <span className="text-base font-black text-slate-900">
                  15 000 FCFA
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Primaire, 6e, 5e, 4e, 2nde, 1ère
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-purple-900 block">
                  Classe d'examen :
                </span>
                <span className="text-base font-black text-slate-900">
                  20 000 FCFA
                </span>
                <span className="text-[10px] text-slate-500 block">
                  CEPE, BEPC, Baccalauréat
                </span>
              </div>
            </div>
          </div>

          {/* Direct Creator Contacts Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Contact Officiel JDDIGITAL pour Réactivation
            </span>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black tracking-tight text-white">
                  {PHONE_NUMBER}
                </div>
                <div className="text-[11px] text-slate-300">
                  Orange Money • Wave • WhatsApp 24/7
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Votre identifiant terminal :</span>
              <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono text-[10px]">
                {clientId}
              </code>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Contacter JDDIGITAL sur WhatsApp</span>
            </a>

            <button
              onClick={handleCheck}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              <span>{isChecking ? "Vérification en cours..." : "Vérifier si j'ai été reconnecté"}</span>
            </button>

            {checkMessage && (
              <p className="text-center text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                {checkMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
