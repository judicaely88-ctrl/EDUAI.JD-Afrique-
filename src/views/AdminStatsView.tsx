import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  TrendingUp,
  Globe2,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Clock,
  Activity,
  Layers,
  Phone,
  MessageCircle,
  Lock,
  Unlock,
  UserX,
  UserCheck,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  Smartphone,
} from "lucide-react";

interface AdminStats {
  activeConnectedCount: number;
  activeExamClassCount: number;
  activeStandardClassCount: number;
  disconnectedCount?: number;
  totalVisits: number;
  totalUsersTracked?: number;
  paidCount?: number;
  collectedRevenue?: number;
  byCountry: Record<string, number>;
  pricing: {
    standardClassPrice: number;
    examClassPrice: number;
    currency: string;
  };
  creatorContact?: {
    phone: string;
    whatsappLink: string;
    operatorOrangeMoney: string;
    operatorWave: string;
  };
  potentialRevenue: number;
  auditLogs?: Array<{
    id: string;
    timestamp: number;
    action: string;
    details: string;
    targetUser?: string;
  }>;
  generatedLinks?: Array<{
    code: string;
    studentName: string;
    tier: "standard" | "exam";
    createdAt: number;
    url: string;
    status: string;
  }>;
  timestamp: string;
}

interface ManagedUser {
  id: string;
  studentName: string;
  country: string;
  isExamClass: boolean;
  level: string;
  device: string;
  ip: string;
  firstSeen: number;
  lastSeen: number;
  status: "connected" | "disconnected";
  disconnectedReason?: string;
  paymentStatus: "unpaid" | "paid_15k" | "paid_20k";
  isLive: boolean;
}

export const AdminStatsView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    activeConnectedCount: 1,
    activeExamClassCount: 1,
    activeStandardClassCount: 0,
    disconnectedCount: 0,
    totalVisits: 1,
    totalUsersTracked: 1,
    paidCount: 0,
    collectedRevenue: 0,
    byCountry: { "Côte d'Ivoire": 1 },
    pricing: {
      standardClassPrice: 15000,
      examClassPrice: 20000,
      currency: "FCFA",
    },
    potentialRevenue: 20000,
    timestamp: new Date().toISOString(),
  });

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Creator Authentication state
  const [isCreatorUnlocked, setIsCreatorUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("eduai_creator_unlocked") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Search and filter for users
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "disconnected" | "paid">("all");

  // Link generator state (Exclusive to JDDIGITAL)
  const [linkStudentName, setLinkStudentName] = useState("");
  const [linkTier, setLinkTier] = useState<"standard" | "exam">("standard");
  const [createdLink, setCreatedLink] = useState<{ url: string; code: string; text: string } | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // User management action feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const CREATOR_PHONE = "07 47 57 51 08";
  const CREATOR_WHATSAPP = "https://wa.me/2250747575108";

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [resStats, resUsers] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }

      if (resUsers.ok) {
        const userData = await resUsers.json();
        if (Array.isArray(userData.users)) {
          setUsers(userData.users);
        }
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.warn("Could not fetch admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 6000); // Live poll every 6s
    return () => clearInterval(interval);
  }, []);

  const handleUnlockCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pinInput }),
      });

      if (res.ok) {
        setIsCreatorUnlocked(true);
        sessionStorage.setItem("eduai_creator_unlocked", "true");
        setPinInput("");
        showFeedback("Accès Créateur JDDIGITAL déverrouillé avec succès !");
      } else {
        setPinError("Code incorrect. (Code par défaut : 0747575108 ou JDDIGITAL)");
      }
    } catch {
      setPinError("Erreur réseau lors de la validation du code.");
    }
  };

  const handleDisconnectUser = async (user: ManagedUser) => {
    const reason = prompt(
      `Motif de déconnexion pour ${user.studentName} :`,
      "Accès suspendu par le créateur JDDIGITAL pour régularisation d'abonnement (07 47 57 51 08)."
    );
    if (reason === null) return; // User cancelled prompt

    try {
      const res = await fetch("/api/admin/users/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: user.id, reason }),
      });

      if (res.ok) {
        showFeedback(`Élève ${user.studentName} déconnecté avec succès !`);
        fetchStats();
      }
    } catch {
      alert("Erreur lors de la déconnexion.");
    }
  };

  const handleConnectUser = async (user: ManagedUser) => {
    try {
      const res = await fetch("/api/admin/users/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: user.id }),
      });

      if (res.ok) {
        showFeedback(`Élève ${user.studentName} reconnecté et autorisé !`);
        fetchStats();
      }
    } catch {
      alert("Erreur lors de la reconnexion.");
    }
  };

  const handleSetPayment = async (user: ManagedUser, paymentStatus: "paid_15k" | "paid_20k" | "unpaid") => {
    try {
      const res = await fetch("/api/admin/users/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: user.id, paymentStatus }),
      });

      if (res.ok) {
        showFeedback(`Paiement de ${user.studentName} mis à jour : ${paymentStatus}`);
        fetchStats();
      }
    } catch {
      alert("Erreur lors de la mise à jour du paiement.");
    }
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkStudentName.trim()) return;

    setIsGeneratingLink(true);
    try {
      const res = await fetch("/api/admin/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: linkStudentName.trim(),
          tier: linkTier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedLink({
          url: data.link.url,
          code: data.link.code,
          text: data.whatsappShareText,
        });
        showFeedback(`Lien officiel généré pour ${linkStudentName} !`);
        fetchStats();
      }
    } catch {
      alert("Erreur lors de la génération du lien.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.country.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.device.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "live") return u.isLive;
    if (statusFilter === "disconnected") return u.status === "disconnected";
    if (statusFilter === "paid") return u.paymentStatus !== "unpaid";
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-slate-900 text-white border-2 border-emerald-500 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{actionNotice}</span>
        </div>
      )}

      {/* Main Header with Creator Badge & Contacts */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                PORTAIL DE GÉRANCE OFFICIEL • CRÉATEUR JDDIGITAL
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Supervision, Ventes & Gestion des Accès
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Contrôlez en direct vos élèves connectés, déconnectez ou reconnectez les utilisateurs, validez les paiements Orange Money & Wave et générez vos liens d'accès exclusifs.
            </p>
          </div>

          {/* Creator Direct Contact Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col justify-between shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block mb-1">
              Contact d'Assistance & Paiement Officiel
            </span>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-2xl font-black tracking-tight text-white block">
                  {CREATOR_PHONE}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Orange Money • Wave • WhatsApp 24/7
                </span>
              </div>
              <a
                href={CREATOR_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black transition-all shadow-md active:scale-95 flex items-center justify-center"
                title="Ouvrir WhatsApp JDDIGITAL"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Mis à jour à {lastRefreshed.toLocaleTimeString("fr-FR")}
              </span>
              <button
                onClick={fetchStats}
                disabled={isLoading}
                className="flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Rafraîchir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Authentication Pin Gate */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`p-2.5 rounded-2xl ${
                isCreatorUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {isCreatorUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {isCreatorUnlocked ? "Gérance Déverrouillée (JDDIGITAL)" : "Mode Déverrouillage Créateur"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isCreatorUnlocked
                  ? "Vous avez tous les privilèges pour déconnecter/reconnecter les utilisateurs et générer des liens."
                  : "Entrez votre code secret créateur (par défaut : 0747575108 ou JDDIGITAL) pour agir sur les sessions."}
              </p>
            </div>
          </div>

          {isCreatorUnlocked ? (
            <button
              onClick={() => {
                setIsCreatorUnlocked(false);
                sessionStorage.removeItem("eduai_creator_unlocked");
                showFeedback("Session créateur verrouillée.");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors self-start sm:self-center"
            >
              Verrouiller l'accès
            </button>
          ) : (
            <form onSubmit={handleUnlockCreator} className="flex items-center gap-2 self-start sm:self-center">
              <input
                type="password"
                placeholder="Code JDDIGITAL"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all active:scale-95"
              >
                Déverrouiller
              </button>
            </form>
          )}
        </div>

        {pinError && (
          <p className="text-xs font-semibold text-red-600 mt-2 bg-red-50 p-2 rounded-xl border border-red-200">
            {pinError}
          </p>
        )}
      </div>

      {/* KPI Cards: Live Connected, Exam Classes, Collected & Potential Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Connected Users */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              En direct
            </span>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {stats.activeConnectedCount}
            </div>
            <p className="text-xs font-semibold text-emerald-300 mt-1">
              Élève(s) actuellement connecté(s)
            </p>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Total enregistrés :</span>
            <span className="text-white font-bold">{users.length} élèves</span>
          </div>
        </div>

        {/* Classes d'Examen (20 000 FCFA) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Classes d'Examen
            </span>
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900">
              {stats.activeExamClassCount}
            </div>
            <p className="text-xs font-semibold text-purple-900 mt-0.5">
              Candidats CEPE, BEPC, BAC
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Tarif accès :</span>
            <span className="text-purple-700 font-extrabold">20 000 FCFA / an</span>
          </div>
        </div>

        {/* Classes Ordinaires (15 000 FCFA) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Classes Hors Examen
            </span>
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900">
              {stats.activeStandardClassCount}
            </div>
            <p className="text-xs font-semibold text-blue-900 mt-0.5">
              Primaire, 6e à 1ère
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Tarif accès :</span>
            <span className="text-blue-700 font-extrabold">15 000 FCFA / an</span>
          </div>
        </div>

        {/* CA Encaissé & Potentiel */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Revenu Potentiel
            </span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.potentialRevenue.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-bold text-slate-500">FCFA</span>
            </div>
            <p className="text-xs font-semibold text-amber-900 mt-0.5">
              CA calculé sur les élèves actifs
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Déconnectés / Bloqués :</span>
            <span className="text-red-600 font-extrabold">
              {stats.disconnectedCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION EXCLUSIVE : GÉNÉRATEUR DE LIEN D'ACCÈS JDDIGITAL (SEUL JDDIGITAL PEUT PARTAGER) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Générateur Exclusif de Liens d'Accès JDDIGITAL
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Règle de sécurité stricte :</strong> Seul vous (JDDIGITAL) êtes habilité à créer et distribuer les liens de l'application. Les élèves recevant le lien ne peuvent pas le repartager à leur tour. Générez ici un lien sécurisé pour un élève après confirmation de son paiement Orange Money ou Wave au <strong>{CREATOR_PHONE}</strong>.
          </p>

          <form onSubmit={handleGenerateLink} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Nom ou prénom de l'élève :
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Koffi Marc, Fatou..."
                value={linkStudentName}
                onChange={(e) => setLinkStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Formule tarifaire :
              </label>
              <select
                value={linkTier}
                onChange={(e) => setLinkTier(e.target.value as "standard" | "exam")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="standard">Hors Examen (15 000 FCFA)</option>
                <option value="exam">Classe Examen CEPE/BEPC/BAC (20 000 FCFA)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isGeneratingLink || !linkStudentName.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>{isGeneratingLink ? "Génération..." : "Générer le Lien Officiel"}</span>
              </button>
            </div>
          </form>

          {/* Generated Link Display */}
          {createdLink && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-indigo-400/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Lien officiel généré avec succès !
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Code : {createdLink.code}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 break-all border border-slate-700 select-all">
                {createdLink.url}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdLink.url);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier le lien</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(createdLink.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Envoyer par WhatsApp à l'élève</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLEAU DE CONTRÔLE DES ÉLÈVES (DÉCONNECTER / RECONNECTER / PAIEMENT) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Contrôle en Direct des Élèves ({filteredUsers.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Déconnectez un élève non à jour ou reconnectez-le dès réception du paiement Wave / Orange Money.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher élève, ID, pays..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="live">Connectés en direct</option>
              <option value="disconnected">Déconnectés / Suspendus</option>
              <option value="paid">Paiement validé</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Élève & ID</th>
                <th className="p-3.5">Classe & Tarif</th>
                <th className="p-3.5">Pays & Appareil</th>
                <th className="p-3.5">Statut Session</th>
                <th className="p-3.5">Paiement</th>
                <th className="p-3.5 text-right">Actions Gérance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Aucun élève correspondant aux critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isDisconnected = u.status === "disconnected";
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDisconnected ? "bg-red-50/30" : ""
                      }`}
                    >
                      {/* Name & ID */}
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{u.studentName}</span>
                          {u.isLive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {u.id}
                        </span>
                      </td>

                      {/* Class & Tier */}
                      <td className="p-3.5">
                        {u.isExamClass ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[11px]">
                            <GraduationCap className="w-3 h-3" />
                            Examen (20 000 FCFA)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold text-[11px]">
                            <Layers className="w-3 h-3" />
                            Standard (15 000 FCFA)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {u.level}
                        </span>
                      </td>

                      {/* Country & Device */}
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">
                          {u.country}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          {u.device}
                        </span>
                      </td>

                      {/* Session Status */}
                      <td className="p-3.5">
                        {isDisconnected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px]">
                            <UserX className="w-3 h-3 text-red-600" />
                            DÉCONNECTÉ
                          </span>
                        ) : u.isLive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            CONNECTÉ EN DIRECT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                            Hors-ligne
                          </span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="p-3.5">
                        {u.paymentStatus === "paid_20k" ? (
                          <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-950 font-black text-[10px]">
                            Payé 20 000 FCFA
                          </span>
                        ) : u.paymentStatus === "paid_15k" ? (
                          <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-950 font-black text-[10px]">
                            Payé 15 000 FCFA
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                            En attente
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* Disconnect or Reconnect */}
                        {isDisconnected ? (
                          <button
                            onClick={() => handleConnectUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="Rétablir l'accès de cet élève"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Reconnecter</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDisconnectUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] transition-all inline-flex items-center gap-1"
                            title="Déconnecter immédiatement cet élève"
                          >
                            <UserX className="w-3 h-3 text-red-600" />
                            <span>Déconnecter</span>
                          </button>
                        )}

                        {/* Payment quick toggle */}
                        <button
                          onClick={() => {
                            const next =
                              u.paymentStatus === "unpaid"
                                ? u.isExamClass
                                  ? "paid_20k"
                                  : "paid_15k"
                                : "unpaid";
                            handleSetPayment(u, next);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-all inline-flex items-center gap-1"
                          title="Basculer le statut du paiement"
                        >
                          <CreditCard className="w-3 h-3 text-emerald-600" />
                          <span>Paiement</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Tarification & Répartition par Pays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grille Tarifaire Officielle */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Grille Tarifaire Officielle EduAI
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Modèle de tarification fixé par <strong>JDDIGITAL</strong> pour la commercialisation auprès des familles et établissements scolaires en Afrique.
          </p>

          <div className="space-y-3 pt-2">
            {/* Plan 1 */}
            <div className="p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-50/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-blue-900 block">
                  1. Formule Standard (Hors classe d'examen)
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Élèves du primaire, 6ème, 5ème, 4ème, Seconde, 1ère
                </p>
                <p className="text-[11px] text-blue-800 font-medium mt-1">
                  Accès cours, professeur IA, résolution d'exercices & quiz.
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-xl font-black text-blue-900 block">
                  15 000
                </span>
                <span className="text-[10px] font-extrabold text-blue-700 uppercase">
                  FCFA / an
                </span>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="p-4 rounded-2xl border-2 border-purple-500/40 bg-purple-50/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-purple-900">
                    2. Formule Examen & Concours
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                    Recommandé
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Candidats CEPE, BEPC, BFEM, DEF, Baccalauréat (A, C, D, S2)
                </p>
                <p className="text-[11px] text-purple-800 font-medium mt-1">
                  Tout inclus + annales officielles complètes, corrigés certifiés et coaching bac.
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-xl font-black text-purple-900 block">
                  20 000
                </span>
                <span className="text-[10px] font-extrabold text-purple-700 uppercase">
                  FCFA / an
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition Géographique en Direct */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Origine des Élèves Connectés
            </h2>
          </div>

          <p className="text-xs text-slate-600">
            Répartition des sessions actives par pays en temps réel :
          </p>

          <div className="space-y-2.5 pt-2">
            {Object.keys(stats.byCountry).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                En attente de connexions...
              </p>
            ) : (
              Object.entries(stats.byCountry).map(([country, count]) => {
                const percent = Math.round((count / (stats.activeConnectedCount || 1)) * 100);
                return (
                  <div key={country} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{country}</span>
                      <span className="text-slate-600">
                        {count} élève(s) ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Note administrateur */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-700 space-y-1 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block mb-0.5">
            Gérance & Droits Exclusifs JDDIGITAL (07 47 57 51 08) :
          </strong>
          Le système garantit que tout élève déconnecté depuis ce panneau verra immédiatement son écran verrouillé sur son téléphone, avec les instructions pour payer par Orange Money ou Wave au <strong>07 47 57 51 08</strong> et contacter JDDIGITAL sur WhatsApp.
        </div>
      </div>
    </div>
  );
};
