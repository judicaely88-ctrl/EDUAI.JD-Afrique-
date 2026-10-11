import React, { useState, useRef, useEffect } from "react";
import { AfricanCountry, ChatMessage, SchoolLevel, SubjectCategory } from "../types";
import { solveWithLocalEngine } from "../utils/localAIEngine";
import { MathView } from "../utils/mathRenderer";
import { SolutionCard } from "../components/SolutionCard";
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Camera,
  Check,
  Cpu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  MessageSquare,
  HelpCircle,
  Headphones,
  RotateCcw,
} from "lucide-react";

interface TeacherAIViewProps {
  selectedCountry: AfricanCountry;
  onNavigateToPhoto?: () => void;
  isOnline: boolean;
}

export const TeacherAIView: React.FC<TeacherAIViewProps> = ({
  selectedCountry,
  onNavigateToPhoto,
  isOnline,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "eduai",
      text: `Bonjour ! Je suis **Professeur JD**, ton assistant personnel 24/7 officiel créé par JDDIGITAL.

Je suis optimisé par **Gemini** et disponible jour et nuit pour t'expliquer tes cours, résoudre tes exercices pas à pas en 9 étapes détaillées et t'entraîner pour tes examens en Afrique.

💡 **Astuce** : Tu peux me parler directement au **micro vocal** ou m'écrire ta question. Notre échange fonctionne avec ta simple connexion Internet (données mobiles ou WiFi), **sans aucun crédit téléphonique** !`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>("Mathématiques");
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>("Lycée");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Voice Speech-to-Text & Text-to-Speech
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Tu peux écrire ton message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Erreur lancement micro vocal:", err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Text-to-speech reading
  const handleSpeakText = (text: string, id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown/formula artifacts for pleasant voice
    const cleanSpeech = text
      .replace(/\$\$/g, "")
      .replace(/\$/g, "")
      .replace(/[*#_~]/g, "")
      .replace(/\\Delta/g, "delta")
      .replace(/\\times/g, "fois")
      .replace(/\\sqrt\{([^}]+)\}/g, "racine carrée de $1")
      .slice(0, 600);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const suggestedQuestions = [
    { label: "Résoudre x² + 2x + 3 = 0", prompt: "Résoudre dans ℂ l'équation du second degré : x² + 2x + 3 = 0", subject: "Mathématiques" as SubjectCategory },
    { label: "Théorème de Pythagore (6, 8, 10)", prompt: "Dans un triangle rectangle ABC avec AB = 6 cm et AC = 8 cm, calculer l'hypoténuse BC.", subject: "Mathématiques" as SubjectCategory },
    { label: "Équation 3x + 5 = 20", prompt: "Résoudre dans ℝ l'équation du premier degré : 3x + 5 = 20", subject: "Mathématiques" as SubjectCategory },
    { label: "Lois de Newton & projectile", prompt: "Quelle est la portée d'un projectile lancé avec une vitesse v₀ = 20 m/s faisant un angle de 30° ?", subject: "Physique-Chimie" as SubjectCategory },
    { label: "Méthode dissertation de français", prompt: "Donne-moi le plan type détaillé d'une dissertation littéraire pour le BAC.", subject: "Français" as SubjectCategory },
    { label: "Problématique en philosophie", prompt: "Comment formuler la problématique d'un sujet de dissertation en philosophie ?", subject: "Philosophie" as SubjectCategory },
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    if (isRecording) {
      stopVoiceRecording();
    }

    const promptToSend = (customPrompt || inputPrompt).trim();
    if (!promptToSend || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    // Prepare contextual history (last turns)
    const contextHistory = messages
      .filter((m) => m.id !== "welcome-msg")
      .slice(-6)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        sender: m.sender,
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      let geminiSuccess = false;
      let replyText = "";

      if (isOnline) {
        try {
          const res = await fetch("/api/gemini/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptToSend,
              subject: selectedSubject,
              level: selectedLevel,
              country: selectedCountry.name,
              history: contextHistory,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.text) {
              geminiSuccess = true;
              replyText = data.text;
            }
          }
        } catch (fetchErr) {
          console.warn("Gemini server endpoint unavailable, using local engine:", fetchErr);
        }
      }

      if (!geminiSuccess) {
        // If offline or fallback
        const localRes = solveWithLocalEngine(promptToSend, selectedSubject);
        const botMessageId = (Date.now() + 1).toString();
        const botMessage: ChatMessage = {
          id: botMessageId,
          sender: "eduai",
          text: isOnline
            ? (localRes.message || "Voici la résolution méthodique détaillée préparée par Professeur JD :")
            : "⚠️ Mode hors-connexion : Le chat interactif Gemini nécessite une connexion Internet (sans crédit téléphonique). Voici la résolution méthodique préparée par le moteur local EDUAI :",
          structuredSolution: localRes.solution,
          isOfflineFallback: true,
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMessage]);

        if (autoSpeak && botMessage.text) {
          handleSpeakText(botMessage.text, botMessageId);
        }
      } else {
        const botMessageId = (Date.now() + 1).toString();
        const botMessage: ChatMessage = {
          id: botMessageId,
          sender: "eduai",
          text: replyText,
          isAiGenerated: true,
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMessage]);

        if (autoSpeak && replyText) {
          handleSpeakText(replyText, botMessageId);
        }
      }
    } catch (err) {
      console.error(err);
      const fallbackRes = solveWithLocalEngine(promptToSend, selectedSubject);
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: ChatMessage = {
        id: botMessageId,
        sender: "eduai",
        text: "Le Professeur JD fonctionne en mode local autonome. Voici la démarche pédagogique pas à pas :",
        structuredSolution: fallbackRes.solution,
        isOfflineFallback: true,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: "cleared-msg",
        sender: "eduai",
        text: "La discussion a été réinitialisée. Bonjour ! Je suis le Professeur JD, ton assistant personnel 24/7. Quelle est ta prochaine question ?",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Official Header bar with new required name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Professeur JD ton assistant personnel 24/7
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Chatbot contextuel optimisé par Gemini • Réponses pédagogiques structurées & vocales
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-speech toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              autoSpeak
                ? "bg-purple-100 text-purple-900 border-purple-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
            title="Lecture vocale automatique de chaque réponse"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voix auto :</span>
            <span>{autoSpeak ? "Activée" : "Désactivée"}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            title="Effacer la conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        </div>
      </div>

      {/* Explicit Connection & Zero-Credit Notice Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 p-3.5 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-slate-700 leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 font-black text-indigo-950">
              <span>Optimisé par Google Gemini 3.8 Flash</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                <Wifi className="w-3 h-3" />
                Connexion Internet requise
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold">
                0 crédit téléphonique
              </span>
            </div>
            <p className="mt-1 text-slate-600">
              Le <strong>Professeur JD</strong> fonctionne avec les données mobiles Internet ou le Wi-Fi, <strong>sans aucun crédit d'appel téléphonique</strong>. Pose tes questions par écrit ou au micro pour recevoir une explication complète en 9 étapes !
            </p>
          </div>
        </div>
      </div>

      {/* Offline Alert if user has no internet */}
      {!isOnline && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold block">Mode Hors-Ligne Détecté :</strong>
            <span>
              Le chatbot Gemini nécessite une connexion Internet (données mobiles ou WiFi). En mode hors-connexion, le <strong>moteur déterministe local</strong> prend le relais pour résoudre tes équations mathématiques et tu peux consulter tes cours et examens sauvegardés dans ton <strong>cache local</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Preferences selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <label className="font-bold text-slate-600">Niveau :</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as SchoolLevel)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800"
          >
            <option value="Primaire">Primaire</option>
            <option value="Collège">Collège (6e - 3e)</option>
            <option value="Lycée">Lycée (2nde - Tle)</option>
            <option value="Supérieur">Supérieur / Université</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-bold text-slate-600">Matière :</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as SubjectCategory)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800"
          >
            <option value="Mathématiques">Mathématiques</option>
            <option value="Physique-Chimie">Physique-Chimie</option>
            <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
            <option value="Français">Français</option>
            <option value="Philosophie">Philosophie</option>
            <option value="Histoire-Géographie">Histoire-Géographie</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium ml-auto flex items-center gap-1">
          <span>Programme : <strong>{selectedCountry.flagEmoji} {selectedCountry.name}</strong></span>
        </div>

        {onNavigateToPhoto && (
          <button
            onClick={onNavigateToPhoto}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Photo exercice
          </button>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Questions rapides suggérées :
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedSubject(q.subject);
                handleSendMessage(q.prompt);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-xs font-medium text-slate-700 transition-all text-left shadow-2xs"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                {msg.sender === "user" ? (
                  "Toi (Apprenant)"
                ) : (
                  <>
                    <span className="text-emerald-700 font-black">Professeur JD</span>
                    <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                      24/7
                    </span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              {msg.isOfflineFallback && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded">
                  Moteur Local
                </span>
              )}
              {msg.isAiGenerated && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 text-indigo-900 rounded">
                  Gemini Flash
                </span>
              )}
            </div>

            {msg.sender === "user" ? (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl rounded-tr-xs px-5 py-3 max-w-2xl shadow-sm text-sm font-medium">
                <MathView content={msg.text} className="text-white" />
              </div>
            ) : (
              <div className="w-full max-w-4xl space-y-4">
                {msg.structuredSolution ? (
                  <SolutionCard
                    title="Résolution Pédagogique - Professeur JD"
                    solution={msg.structuredSolution}
                    sourceBadge={
                      msg.isOfflineFallback
                        ? "Moteur Déterministe Local"
                        : "Professeur JD • 9 Étapes Certifiées"
                    }
                  />
                ) : (
                  <div className="bg-white rounded-2xl rounded-tl-xs border border-slate-200 p-6 shadow-sm space-y-3">
                    <MathView content={msg.text} />

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400 font-medium">
                        Professeur JD ton assistant personnel 24/7 • JDDIGITAL
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Audio Speak button */}
                        <button
                          onClick={() => handleSpeakText(msg.text, msg.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            speakingId === msg.id
                              ? "bg-purple-600 text-white shadow-xs animate-pulse"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                          title="Écouter le Professeur JD à voix haute"
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Arrêter la voix</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                              <span>Écouter le prof</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === msg.id ? "Copié !" : "Copier"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-indigo-200 shadow-xs max-w-md">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-indigo-950">
              Professeur JD analyse ta question avec Gemini et prépare les 9 étapes...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Notification Banner if active */}
      {isRecording && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-pulse border-2 border-white/50">
          <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          <span className="text-xs font-extrabold tracking-wide">
            Microphone actif : Parle distinctement à Professeur JD...
          </span>
          <button
            onClick={stopVoiceRecording}
            className="px-3 py-1 rounded bg-white text-rose-700 text-xs font-black hover:bg-rose-100 transition-colors shadow-xs"
          >
            Terminer & Envoyer
          </button>
        </div>
      )}

      {/* Input Form Bar with Vocal Microphone */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-2.5 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Vocal Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isRecording
                ? "bg-rose-600 text-white shadow-lg animate-pulse"
                : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300"
            }`}
            title={isRecording ? "Arrêter le micro" : "Parler au micro vocal avec Professeur JD"}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-emerald-600" />
            )}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              isRecording
                ? "Écoute en cours... Parle à ton Professeur JD !"
                : "Écris ou dicte au micro (ex: Résoudre x² + 2x + 3 = 0)..."
            }
            className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 text-white text-xs sm:text-sm font-black shadow-xs transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>ENVOYER</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
