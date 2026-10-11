import React, { useState, useEffect } from "react";
import { AfricanCountry, RecentItem, SchoolLevel, ExamItem, CourseSheet } from "./types";
import { AFRICAN_COUNTRIES } from "./data/africanCountries";
import { Header } from "./components/Header";
import { HomeView } from "./views/HomeView";
import { TeacherAIView } from "./views/TeacherAIView";
import { ExamsView } from "./views/ExamsView";
import { CoursesView } from "./views/CoursesView";
import { PhotoSolverView } from "./views/PhotoSolverView";
import { TrainView } from "./views/TrainView";
import { QuizView } from "./views/QuizView";
import { SettingsView } from "./views/SettingsView";
import { AdminStatsView } from "./views/AdminStatsView";
import { OfflineIndicatorBanner } from "./components/OfflineIndicatorBanner";
import { AssistanceModal } from "./components/AssistanceModal";
import { AssistanceFloatingButton } from "./components/AssistanceFloatingButton";
import { DisconnectedLockScreen } from "./components/DisconnectedLockScreen";
import { ShareProtectionModal } from "./components/ShareProtectionModal";
import {
  Compass,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award,
  Activity,
  Phone,
  MessageCircle,
} from "lucide-react";

export function App() {
  // Stored country preference
  const [selectedCountry, setSelectedCountry] = useState<AfricanCountry>(() => {
    const saved = localStorage.getItem("eduai_country");
    if (saved) {
      const found = AFRICAN_COUNTRIES.find((c) => c.id === saved);
      if (found) return found;
    }
    return AFRICAN_COUNTRIES[0]; // Côte d'Ivoire default
  });

  // Stored school level
  const [userLevel, setUserLevel] = useState<SchoolLevel>(() => {
    const saved = localStorage.getItem("eduai_level") as SchoolLevel;
    return saved || "Lycée";
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Selection states for cross-view navigation
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);

  // Live connected count
  const [connectedCount, setConnectedCount] = useState<number>(1);

  // Disconnection & Creator Access Management State
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [disconnectedReason, setDisconnectedReason] = useState<string>("");

  // Modals state
  const [isAssistanceOpen, setIsAssistanceOpen] = useState<boolean>(false);
  const [isShareProtectionOpen, setIsShareProtectionOpen] = useState<boolean>(false);

  // Client identifier for session tracking
  const [clientId] = useState<string>(() => {
    let id = localStorage.getItem("eduai_client_id");
    if (!id) {
      id = "usr_" + Math.random().toString(36).substring(2, 8) + "_" + Date.now().toString(36);
      localStorage.setItem("eduai_client_id", id);
    }
    return id;
  });

  // Recent items history stored in localStorage
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    try {
      const saved = localStorage.getItem("eduai_recent");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Online / offline detector
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Heartbeat pulse to sync with JDDIGITAL backend
  const checkHeartbeat = async (): Promise<boolean> => {
    const isExamClass = userLevel === "Lycée"; // Candidates for Baccalauréat
    const deviceType = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      ? "Mobile / Tablette"
      : "Ordinateur PC / Mac";

    try {
      const res = await fetch("/api/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          country: selectedCountry.name,
          isExamClass,
          level: userLevel,
          device: deviceType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.connectedUsers === "number") {
          setConnectedCount(data.connectedUsers);
        }

        if (data.status === "disconnected") {
          setIsDisconnected(true);
          setDisconnectedReason(data.reason || "Accès suspendu par le créateur JDDIGITAL");
          return false;
        } else {
          setIsDisconnected(false);
          setDisconnectedReason("");
          return true;
        }
      }
    } catch (err) {
      // Offline or network error
    }
    return false;
  };

  useEffect(() => {
    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 12000); // Pulse every 12s
    return () => clearInterval(interval);
  }, [selectedCountry, userLevel, clientId]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("eduai_country", selectedCountry.id);
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem("eduai_level", userLevel);
  }, [userLevel]);

  useEffect(() => {
    localStorage.setItem("eduai_recent", JSON.stringify(recentItems));
  }, [recentItems]);

  const handleRecordRecentExam = (exam: ExamItem) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((item) => item.id !== exam.id);
      return [
        {
          id: exam.id,
          type: "exam" as const,
          title: exam.title,
          subtitle: `${exam.countryName} • ${exam.examType} (${exam.year})`,
          date: new Date().toLocaleDateString("fr-FR"),
          linkTab: "exams",
          itemId: exam.id,
        },
        ...filtered,
      ].slice(0, 6);
    });
  };

  const handleRecordRecentCourse = (course: CourseSheet) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((item) => item.id !== course.id);
      return [
        {
          id: course.id,
          type: "course" as const,
          title: course.title,
          subtitle: `${course.subject} • ${course.chapter}`,
          date: new Date().toLocaleDateString("fr-FR"),
          linkTab: "courses",
          itemId: course.id,
        },
        ...filtered,
      ].slice(0, 6);
    });
  };

  const handleClearRecent = () => {
    setRecentItems([]);
    localStorage.removeItem("eduai_recent");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      {/* If disconnected by creator JDDIGITAL, show non-dismissible lock screen */}
      {isDisconnected && (
        <DisconnectedLockScreen
          reason={disconnectedReason}
          clientId={clientId}
          onRetryCheck={checkHeartbeat}
        />
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedExamId(undefined);
          setSelectedCourseId(undefined);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        isOnline={isOnline}
        connectedCount={connectedCount}
        onOpenAssistance={() => setIsAssistanceOpen(true)}
        onOpenShareProtection={() => setIsShareProtectionOpen(true)}
      />

      {/* Offline Connectivity & Cache Alert Banner */}
      <OfflineIndicatorBanner
        isOnline={isOnline}
        onOpenCachedTab={(tab) => {
          setSelectedExamId(undefined);
          setSelectedCourseId(undefined);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === "home" && (
          <HomeView
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            selectedCountry={selectedCountry}
            setSelectedExamId={(id) => {
              setSelectedExamId(id);
              setCurrentTab("exams");
            }}
            setSelectedCourseId={(id) => {
              setSelectedCourseId(id);
              setCurrentTab("courses");
            }}
            recentItems={recentItems}
          />
        )}

        {currentTab === "teacher" && (
          <TeacherAIView
            selectedCountry={selectedCountry}
            onNavigateToPhoto={() => setCurrentTab("photo")}
            isOnline={isOnline}
          />
        )}

        {currentTab === "exams" && (
          <ExamsView
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedExamId={selectedExamId}
            setSelectedExamId={setSelectedExamId}
            onRecordRecent={handleRecordRecentExam}
          />
        )}

        {currentTab === "courses" && (
          <CoursesView
            selectedCountry={selectedCountry}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            onRecordRecent={handleRecordRecentCourse}
          />
        )}

        {currentTab === "photo" && (
          <PhotoSolverView
            selectedCountry={selectedCountry}
            isOnline={isOnline}
          />
        )}

        {currentTab === "train" && (
          <TrainView selectedCountry={selectedCountry} />
        )}

        {currentTab === "quiz" && (
          <QuizView selectedCountry={selectedCountry} />
        )}

        {currentTab === "admin" && (
          <AdminStatsView />
        )}

        {currentTab === "settings" && (
          <SettingsView
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            userLevel={userLevel}
            setUserLevel={setUserLevel}
            onClearRecent={handleClearRecent}
            isOnline={isOnline}
          />
        )}
      </main>

      {/* Floating Assistance & Payment Button (Persistent 24/7) */}
      <AssistanceFloatingButton onOpenAssistance={() => setIsAssistanceOpen(true)} />

      {/* Assistance & Payment Modal */}
      <AssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        clientId={clientId}
      />

      {/* Exclusive Creator Share Protection Modal */}
      <ShareProtectionModal
        isOpen={isShareProtectionOpen}
        onClose={() => setIsShareProtectionOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Android & phone optimized) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: "home", label: "Accueil", icon: Compass },
            { id: "teacher", label: "Prof JD 24/7", icon: Sparkles },
            { id: "exams", label: "Examens", icon: GraduationCap },
            { id: "courses", label: "Cours", icon: BookOpen },
            { id: "admin", label: "Gérance", icon: Activity },
          ].map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedExamId(undefined);
                  setSelectedCourseId(undefined);
                  setCurrentTab(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  active
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">EDUAI</span>
              <span className="text-slate-500">|</span>
              <span>Une réalisation exclusive par <strong>JDDIGITAL</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300">« Apprendre. Comprendre. Réussir. »</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Assistance 24/7, Wave & Orange Money : <strong className="text-emerald-400 font-bold">07 47 57 51 08</strong> • Diffusion et partages exclusifs réservés à JDDIGITAL.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-purple-300 font-semibold">15 000 FCFA (Hors examen) / 20 000 FCFA (Classe examen)</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentTab("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span>{connectedCount} connecté(s) en direct</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
