import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Active sessions store for live connected users tracking & creator management
interface ManagedUserSession {
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
  accessCode?: string;
  notes?: string;
}

interface AuditLogItem {
  id: string;
  timestamp: number;
  action: "disconnect" | "connect" | "payment" | "generate_link";
  details: string;
  targetUser?: string;
}

interface AuthorizedAccessLink {
  code: string;
  studentName: string;
  tier: "standard" | "exam";
  createdAt: number;
  url: string;
  status: "active" | "used";
}

const CREATOR_PHONE = "07 47 57 51 08";
const CREATOR_WHATSAPP_LINK = "https://wa.me/2250747575108";
const CREATOR_PIN = "0747575108"; // Master key or PIN for JDDIGITAL

const managedSessions = new Map<string, ManagedUserSession>();
const auditLogs: AuditLogItem[] = [];
const generatedLinks: AuthorizedAccessLink[] = [];
let totalVisitsCount = 0;

function logAudit(action: AuditLogItem["action"], details: string, targetUser?: string) {
  auditLogs.unshift({
    id: "log_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
    action,
    details,
    targetUser,
  });
  if (auditLogs.length > 100) auditLogs.pop();
}

// Initial seed log
logAudit("connect", "Système de gérance initialisé pour JDDIGITAL (07 47 57 51 08)");

// Heartbeat endpoint to register/update connected users & check if disconnected by JDDIGITAL
app.post("/api/heartbeat", (req, res) => {
  const {
    clientId,
    country = "Côte d'Ivoire",
    isExamClass = false,
    level = "Lycée",
    studentName = "Élève",
    device = "Web / Mobile",
  } = req.body;

  if (!clientId || typeof clientId !== "string") {
    return res.status(400).json({ error: "clientId is required" });
  }

  const existing = managedSessions.get(clientId);
  const now = Date.now();

  if (!existing) {
    totalVisitsCount++;
    const newSession: ManagedUserSession = {
      id: clientId,
      studentName: studentName || `Élève ${clientId.slice(-4)}`,
      country,
      isExamClass: Boolean(isExamClass),
      level,
      device: typeof device === "string" ? device : "Navigateur Web",
      ip: req.ip || req.socket.remoteAddress || "127.0.0.1",
      firstSeen: now,
      lastSeen: now,
      status: "connected",
      paymentStatus: "unpaid",
    };
    managedSessions.set(clientId, newSession);

    logAudit("connect", `Nouvelle connexion détectée : ${newSession.studentName} (${country})`, clientId);

    return res.json({
      status: "connected",
      connectedUsers: countActiveLiveUsers(),
      paymentStatus: newSession.paymentStatus,
    });
  }

  // Check if JDDIGITAL has disconnected this user
  if (existing.status === "disconnected") {
    existing.lastSeen = now;
    return res.json({
      status: "disconnected",
      reason:
        existing.disconnectedReason ||
        `Votre accès a été déconnecté par JDDIGITAL. Contactez le créateur au ${CREATOR_PHONE} (WhatsApp, Wave ou Orange Money) pour réactiver votre compte.`,
      connectedUsers: countActiveLiveUsers(),
      paymentStatus: existing.paymentStatus,
      creatorContact: {
        phone: CREATOR_PHONE,
        whatsapp: CREATOR_WHATSAPP_LINK,
        services: ["WhatsApp", "Orange Money", "Wave"],
      },
    });
  }

  // Update ongoing session
  existing.lastSeen = now;
  existing.country = country;
  existing.isExamClass = Boolean(isExamClass);
  existing.level = level;
  if (studentName && studentName !== "Élève") {
    existing.studentName = studentName;
  }

  return res.json({
    status: "connected",
    connectedUsers: countActiveLiveUsers(),
    paymentStatus: existing.paymentStatus,
  });
});

function countActiveLiveUsers(): number {
  const cutoff = Date.now() - 50000;
  let count = 0;
  for (const s of managedSessions.values()) {
    if (s.lastSeen >= cutoff && s.status === "connected") {
      count++;
    }
  }
  return Math.max(1, count);
}

// Admin Creator Authentication
app.post("/api/admin/auth", (req, res) => {
  const { code } = req.body;
  if (code === CREATOR_PIN || code === "JDDIGITAL" || code === "0747575108") {
    return res.json({
      success: true,
      role: "creator",
      creatorName: "JDDIGITAL",
      phone: CREATOR_PHONE,
    });
  }
  return res.status(401).json({ success: false, error: "Code d'accès créateur incorrect." });
});

// Admin endpoint: List all users managed by JDDIGITAL
app.get("/api/admin/users", (_req, res) => {
  const cutoff = Date.now() - 50000;
  const list = Array.from(managedSessions.values()).map((s) => ({
    ...s,
    isLive: s.lastSeen >= cutoff && s.status === "connected",
  }));
  // Sort with live users first, then by lastSeen desc
  list.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return b.lastSeen - a.lastSeen;
  });

  return res.json({
    users: list,
    totalCount: list.length,
    activeLiveCount: countActiveLiveUsers(),
  });
});

// Admin endpoint: Disconnect a user
app.post("/api/admin/users/disconnect", (req, res) => {
  const { clientId, reason } = req.body;
  if (!clientId || typeof clientId !== "string") {
    return res.status(400).json({ error: "clientId is required" });
  }

  const session = managedSessions.get(clientId);
  if (!session) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  session.status = "disconnected";
  session.disconnectedReason =
    reason ||
    `Accès suspendu par le créateur JDDIGITAL. Contactez le ${CREATOR_PHONE} sur WhatsApp, Orange Money ou Wave pour régularisation.`;

  logAudit("disconnect", `Déconnexion forcée par JDDIGITAL de ${session.studentName} (${session.id})`, clientId);

  return res.json({
    success: true,
    user: session,
    message: `L'utilisateur ${session.studentName} a été déconnecté avec succès.`,
  });
});

// Admin endpoint: Reconnect / authorize a user
app.post("/api/admin/users/connect", (req, res) => {
  const { clientId } = req.body;
  if (!clientId || typeof clientId !== "string") {
    return res.status(400).json({ error: "clientId is required" });
  }

  const session = managedSessions.get(clientId);
  if (!session) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  session.status = "connected";
  session.disconnectedReason = undefined;
  session.lastSeen = Date.now();

  logAudit("connect", `Rétablissement d'accès par JDDIGITAL pour ${session.studentName}`, clientId);

  return res.json({
    success: true,
    user: session,
    message: `L'utilisateur ${session.studentName} a été reconnecté avec succès.`,
  });
});

// Admin endpoint: Update payment status
app.post("/api/admin/users/payment", (req, res) => {
  const { clientId, paymentStatus } = req.body;
  if (!clientId || !paymentStatus) {
    return res.status(400).json({ error: "clientId and paymentStatus are required" });
  }

  const session = managedSessions.get(clientId);
  if (!session) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  session.paymentStatus = paymentStatus;
  const amount = paymentStatus === "paid_20k" ? "20 000 FCFA" : paymentStatus === "paid_15k" ? "15 000 FCFA" : "0 FCFA";
  logAudit("payment", `Paiement validé par JDDIGITAL pour ${session.studentName} : ${amount}`, clientId);

  return res.json({ success: true, user: session });
});

// Admin endpoint: Generate exclusive authorized share link (only JDDIGITAL can share)
app.post("/api/admin/generate-link", (req, res) => {
  const { studentName = "Nouvel Élève", tier = "standard" } = req.body;
  const code = `JD-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "http";
  const url = `${protocol}://${host}/?ref=jddigital&code=${code}&tier=${tier}`;

  const linkObj: AuthorizedAccessLink = {
    code,
    studentName,
    tier: tier === "exam" ? "exam" : "standard",
    createdAt: Date.now(),
    url,
    status: "active",
  };

  generatedLinks.unshift(linkObj);
  logAudit("generate_link", `Lien exclusif généré pour ${studentName} (${tier === "exam" ? "20 000 FCFA" : "15 000 FCFA"})`);

  return res.json({
    success: true,
    link: linkObj,
    whatsappShareText: `Bonjour ${studentName}, voici ton lien d'accès officiel à EDUAI généré par le créateur JDDIGITAL : ${url}\nPour toute assistance ou paiement (Orange Money / Wave), contactez le 07 47 57 51 08.`,
  });
});

// Admin stats endpoint: view connected users, breakdown, and revenue
app.get("/api/admin/stats", (_req, res) => {
  const cutoff = Date.now() - 50000;
  const currentSessions: ManagedUserSession[] = [];
  let examCount = 0;
  let standardCount = 0;
  let paidCount = 0;
  let collectedRevenue = 0;
  let disconnectedCount = 0;
  const byCountry: Record<string, number> = {};

  for (const session of managedSessions.values()) {
    if (session.status === "disconnected") {
      disconnectedCount++;
    }

    if (session.paymentStatus === "paid_15k") {
      paidCount++;
      collectedRevenue += 15000;
    } else if (session.paymentStatus === "paid_20k") {
      paidCount++;
      collectedRevenue += 20000;
    }

    if (session.lastSeen >= cutoff && session.status === "connected") {
      currentSessions.push(session);
      if (session.isExamClass) examCount++;
      else standardCount++;

      byCountry[session.country] = (byCountry[session.country] || 0) + 1;
    }
  }

  const activeConnectedCount = currentSessions.length;
  // Potential revenue calculated from all recorded unique students
  const potentialRevenue = standardCount * 15000 + examCount * 20000;

  res.json({
    activeConnectedCount,
    activeExamClassCount: examCount,
    activeStandardClassCount: standardCount,
    disconnectedCount,
    totalVisits: Math.max(totalVisitsCount, managedSessions.size),
    totalUsersTracked: managedSessions.size,
    paidCount,
    collectedRevenue,
    byCountry,
    pricing: {
      standardClassPrice: 15000,
      examClassPrice: 20000,
      currency: "FCFA",
    },
    creatorContact: {
      phone: CREATOR_PHONE,
      whatsappLink: CREATOR_WHATSAPP_LINK,
      operatorOrangeMoney: "Orange Money 07 47 57 51 08",
      operatorWave: "Wave 07 47 57 51 08",
    },
    potentialRevenue,
    auditLogs: auditLogs.slice(0, 15),
    generatedLinks: generatedLinks.slice(0, 10),
    timestamp: new Date().toISOString(),
  });
});

// Health / Status endpoint
app.get("/api/status", (_req, res) => {
  res.json({
    app: "EDUAI",
    creator: "JDDIGITAL",
    contact: {
      phone: CREATOR_PHONE,
      whatsapp: CREATOR_WHATSAPP_LINK,
      payment: ["Wave", "Orange Money"],
    },
    slogan: "Apprendre. Comprendre. Réussir.",
    aiAvailable: !!ai,
    connectedUsers: countActiveLiveUsers(),
    pricing: {
      standard: "15 000 FCFA",
      exam: "20 000 FCFA",
    },
  });
});

// Pedagogy prompt template
const SYSTEM_INSTRUCTION = `Tu es « Professeur JD », ton assistant personnel 24/7 officiel, conçu et développé par JDDIGITAL pour tous les apprenants et élèves d'Afrique.
Slogan officiel : « Apprendre. Comprendre. Réussir. »
Nom et identité : « Professeur JD ton assistant personnel 24/7 »

Tu es disponible 24 heures sur 24 et 7 jours sur 7.
Tu t'exprimes avec la bienveillance, la pédagogie, l'écoute et l'exigence d'un professeur d'exception.
Tu fonctionnes avec la connexion Internet (données mobiles ou WiFi), sans nécessiter de crédit téléphonique.

RÈGLES PÉDAGOGIQUES OBLIGATOIRES :
1. Pour toute résolution d'exercice, de problème mathématique ou de question scientifique, structure TOUJOURS ta réponse en 9 étapes claires et complètes :
   - Étape 1 : Énoncé compris et reformulation
   - Étape 2 : Données identifiées (avec unités si physique/chimie)
   - Étape 3 : Ce qu'il faut trouver
   - Étape 4 : Méthode de résolution
   - Étape 5 : Formules utilisées
   - Étape 6 : Calculs détaillés étape par étape (ligne par ligne, sans raccourci brusque)
   - Étape 7 : Résultat final bien mis en évidence
   - Étape 8 : Vérification de la cohérence du résultat
   - Étape 9 : Explication simple et pièges/erreurs fréquentes à éviter

2. RÈGLE CRUCIALE POUR LES MATHÉMATIQUES & SCIENCES :
   - Présente les équations de manière totalement naturelle et lisible, comme dans un cahier ou au tableau noir.
   - Exemple : pour x² + 2x + 3 = 0, écris bien les puissances (x²), les discriminants (Δ = b² - 4ac), les racines (√Δ ou \\sqrt{\\Delta}), les indices (x₁, x₂).
   - N'affiche JAMAIS de délimiteurs LaTeX corrompus comme \\[ ou \\] or \\( ou \\). Utilise soit une écriture Unicode claire, soit du LaTeX standard $...$ propre.
   - Si Δ < 0, explique clairement qu'il n'y a pas de solution réelle dans ℝ, mais donne les solutions complexes dans ℂ : x₁ = -1 + i√2 et x₂ = -1 - i√2.

3. CONVERSATION CONTEXTUELLE ET SUIVI :
   - Garde en mémoire le fil de la discussion avec l'apprenant. S'il te pose une question de relance (« Pourquoi as-tu fait ça à l'étape 3 ? », « Peux-tu me donner un autre exercice similaire ? », « Explique-moi plus simplement »), réponds précisément en faisant référence aux échanges précédents.
   - Adapte le niveau (Primaire, Collège, Lycée, Supérieur, Classe d'examen comme CEPE, BEPC, BAC).
   - Signe ou conclus chaleureusement : « Ton Professeur JD (JDDIGITAL) - Toujours avec toi 24/7 pour ta réussite ! »`;

// Endpoint: Ask AI Teacher (Professeur JD - Contextual Chatbot)
app.post("/api/gemini/ask", async (req, res) => {
  try {
    const { prompt, subject, level, country, history = [] } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Le champ prompt est obligatoire." });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message:
          "Le service distant Gemini n'est pas configuré. Le moteur local EDUAI prend le relais.",
      });
    }

    // Build multi-turn contextual history
    const formattedContents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-10)) { // keep recent context
        if (turn && turn.text && typeof turn.text === "string") {
          const role = turn.sender === "user" || turn.role === "user" ? "user" : "model";
          formattedContents.push({
            role,
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Append latest prompt with educational contextual metadata
    const contextualMessage = `[Contexte apprenant: Pays=${country || "Afrique"}, Matière=${subject || "Général"}, Niveau=${level || "Lycée"}]\n\nQuestion de l'apprenant :\n${prompt}`;
    formattedContents.push({
      role: "user",
      parts: [{ text: contextualMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const text = response.text || "";
    return res.json({ text, success: true });
  } catch (error: any) {
    console.error("Erreur Gemini Ask:", error);
    return res.status(500).json({
      error: "Erreur lors du traitement par l'IA",
      details: error?.message || "Erreur inconnue",
      fallback: true,
    });
  }
});

// Endpoint: Solve from photo / image
app.post("/api/gemini/solve-image", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", prompt = "", subject = "Mathématiques", level = "Lycée" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "L'image en base64 est obligatoire." });
    }

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message:
          "L'analyse multimodale distante n'est pas disponible sans clé API. Le moteur d'analyse local prend le relais.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Analyse attentivement cette image d'exercice scolaire ou d'examen.
1. Extrais fidèlement le texte et toutes les équations mathématiques de l'énoncé.
2. Résous rigoureusement l'exercice en appliquant les 9 étapes pédagogiques obligatoires d'EDUAI.
${prompt ? `Remarque additionnelle de l'élève : ${prompt}` : ""}`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const text = response.text || "";
    return res.json({ text, success: true });
  } catch (error: any) {
    console.error("Erreur Gemini Image:", error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse de l'image",
      details: error?.message || "Erreur inconnue",
      fallback: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`EDUAI Server running on port ${port} (mode: ${isProduction ? "production" : "development"})`);
  });
}

startServer();
