import React, { useState, useEffect } from "react";
import { getCacheStats, CacheStats } from "../utils/localCache";
import { WifiOff, Database, CheckCircle2, ChevronRight, X } from "lucide-react";

interface OfflineIndicatorBannerProps {
  isOnline: boolean;
  onOpenCachedTab: (tab: "exams" | "courses") => void;
}

export const OfflineIndicatorBanner: React.FC<OfflineIndicatorBannerProps> = ({
  isOnline,
  onOpenCachedTab,
}) => {
  const [stats, setStats] = useState<CacheStats>(() => getCacheStats());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setStats(getCacheStats());
  }, [isOnline]);

  if (isOnline || dismissed) return null;

  const totalCached = stats.examCount + stats.courseCount;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 shadow-md border-b border-amber-500/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold block sm:inline mr-2">
              Mode Hors-Connexion Détecté :
            </span>
            <span className="text-amber-100">
              {totalCached > 0
                ? `Tu disposes de ${stats.examCount} examen(s) et ${stats.courseCount} cours sauvegardés en cache local.`
                : "Consulte tes cours et examens pour qu'ils soient automatiquement mis en cache hors-ligne."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {stats.examCount > 0 && (
            <button
              onClick={() => onOpenCachedTab("exams")}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-colors"
            >
              Examens en cache ({stats.examCount})
            </button>
          )}

          {stats.courseCount > 0 && (
            <button
              onClick={() => onOpenCachedTab("courses")}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-colors"
            >
              Cours en cache ({stats.courseCount})
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white"
            title="Masquer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
