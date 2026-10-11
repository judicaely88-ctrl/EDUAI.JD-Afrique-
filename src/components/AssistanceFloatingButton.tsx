import React from "react";
import { Phone, MessageCircle } from "lucide-react";

interface AssistanceFloatingButtonProps {
  onOpenAssistance: () => void;
}

export const AssistanceFloatingButton: React.FC<AssistanceFloatingButtonProps> = ({
  onOpenAssistance,
}) => {
  return (
    <aside
      aria-label="Assistance et support"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2"
    >
      <button
        onClick={onOpenAssistance}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl border-2 border-emerald-500/40 backdrop-blur-md transition-all active:scale-95"
        title="Contacter JDDIGITAL pour assistance ou abonnement (07 47 57 51 08)"
      >
        <div className="relative">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping opacity-75"></span>
        </div>

        <div className="flex items-center gap-1.5 text-left">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-tight leading-none text-white">
              Assistance 24/7 & Paiement
            </span>
            <span className="text-[10px] text-emerald-400 font-bold leading-tight">
              07 47 57 51 08
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase">
          Wave / Orange
        </span>
      </button>
    </aside>
  );
};
