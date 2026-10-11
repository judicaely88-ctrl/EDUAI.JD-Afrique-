import React from "react";
import { Lock, ShieldAlert, Phone, MessageCircle, X, ExternalLink } from "lucide-react";

interface ShareProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProtectionModal: React.FC<ShareProtectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const PHONE_NUMBER = "07 47 57 51 08";
  const WHATSAPP_URL = `https://wa.me/2250747575108?text=${encodeURIComponent(
    "Bonjour JDDIGITAL,\nJe souhaite obtenir un lien officiel d'accès à l'application EDUAI pour un proche / élève.\nMerci !"
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-amber-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Sécurité & Licence Exclusive
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Partage Réservé au Créateur
          </h2>
          <p className="text-xs text-amber-200/90 mt-1">
            Seul JDDIGITAL est habilité à distribuer les liens d'accès officiels.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Règle de distribution stricte :</span>
            </div>
            <p className="leading-relaxed">
              Une personne recevant le lien de l'application ne peut pas le repartager à son tour. Chaque accès est personnel, sécurisé et soumis à la validation du créateur <strong>JDDIGITAL</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">
              Tu souhaites recommander EduAI à un camarade ou à un proche ?
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Contacte directement JDDIGITAL qui se chargera de lui attribuer son lien d'accès officiel après souscription (15 000 FCFA hors examen / 20 000 FCFA classe d'examen).
            </p>
          </div>

          {/* Contact Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Numéro JDDIGITAL (WhatsApp / Wave / Orange Money)
              </span>
              <span className="text-xl font-black text-white">{PHONE_NUMBER}</span>
            </div>

            <a
              href={`tel:+2250747575108`}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Appeler"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* WhatsApp Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Demander un lien d'accès sur WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
};
