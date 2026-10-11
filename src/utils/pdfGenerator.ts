import { jsPDF } from "jspdf";
import { ExamItem, ExamSolution, CourseSheet, QuizResult } from "../types";
import { cleanNaturalMath } from "./mathRenderer";

/**
 * Creates standard EDUAI PDF header
 */
function addDocumentHeader(doc: jsPDF, title: string, category: string, subtitle?: string): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top banner background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("EDUAI", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("par JDDIGITAL  |  « Apprendre. Comprendre. Réussir. »", 14, 18);

  // Category badge right
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(category.toUpperCase(), pageWidth - 14, 15, { align: "right" });

  let currentY = 38;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(title, pageWidth - 28);
  doc.text(titleLines, 14, currentY);
  currentY += titleLines.length * 7 + 2;

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 14, currentY);
    currentY += 8;
  }

  // Thin separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 8;

  return currentY;
}

/**
 * Helper to write multi-line text with automatic page break handling
 */
function writeSection(
  doc: jsPDF,
  title: string,
  content: string | string[],
  startY: number,
  options?: { isCallout?: boolean; badgeColor?: [number, number, number] }
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = startY;

  // Check page overflow for section header
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(title, margin, currentY);
  currentY += 6;

  // Section content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const textArray = Array.isArray(content) ? content : [content];

  for (const paragraph of textArray) {
    const cleanParagraph = cleanNaturalMath(paragraph);
    const lines = doc.splitTextToSize(cleanParagraph, contentWidth);

    for (const line of lines) {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(line, margin, currentY);
      currentY += 5.2;
    }
    currentY += 2;
  }

  currentY += 4;
  return currentY;
}

/**
 * Download Exam & Solution as PDF
 */
export function generateExamPDF(exam: ExamItem) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("fr-FR");

  let y = addDocumentHeader(
    doc,
    `${exam.title} (${exam.year})`,
    `${exam.subject} - ${exam.examType}`,
    `Pays: ${exam.countryName} | Niveau: ${exam.level} | Source: ${exam.source} | Date d'export: ${dateStr}`
  );

  // Énoncé de l'examen
  y = writeSection(doc, "1. ÉNONCÉ OFFICIEL DU SUJET", exam.statement, y);

  // Corrigé détaillé
  if (exam.solution) {
    const sol = exam.solution;

    y = writeSection(doc, "2. COMPRÉHENSION ET DONNÉES", [
      `Énoncé compris : ${sol.understoodProblem}`,
      `Données identifiées : ${sol.givenData.join(", ")}`,
      `Objectif / Ce qu'il faut trouver : ${sol.toFind}`,
      `Méthode appliquée : ${sol.methodology}`,
    ], y);

    // Étapes de résolution
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    if (y > doc.internal.pageSize.getHeight() - 25) {
      doc.addPage();
      y = 20;
    }
    doc.text("3. ÉTAPES DU RAISONNEMENT ET CALCULS DÉTAILLÉS", 14, y);
    y += 7;

    sol.steps.forEach((step) => {
      const stepLines: string[] = [step.content];
      if (step.formulas && step.formulas.length > 0) {
        stepLines.push(`Formule : ${step.formulas.join(" | ")}`);
      }
      if (step.calculationLines && step.calculationLines.length > 0) {
        stepLines.push(...step.calculationLines.map((l) => `  → ${l}`));
      }
      if (step.resultHighlight) {
        stepLines.push(`Résultat intermédiaire : ${step.resultHighlight}`);
      }
      y = writeSection(doc, `Étape ${step.stepNumber} : ${step.title}`, stepLines, y);
    });

    // Résultat final & Vérification
    y = writeSection(doc, "4. RÉSULTAT FINAL & VÉRIFICATION", [
      `Résultat final : ${sol.finalResult}`,
      `Vérification de cohérence : ${sol.verification}`,
    ], y);

    // Erreurs fréquentes
    if (sol.commonPitfalls && sol.commonPitfalls.length > 0) {
      y = writeSection(
        doc,
        "5. ERREURS FRÉQUENTES À ÉVITER",
        sol.commonPitfalls.map((p, idx) => `• [Piège ${idx + 1}] ${p}`),
        y
      );
    }
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `EDUAI par JDDIGITAL  •  Page ${i} sur ${pageCount}  •  Document Officiel d'Étude & d'Examen`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  const filename = `EDUAI_${exam.countryName}_${exam.examType}_${exam.subject}_${exam.year}.pdf`
    .replace(/\s+/g, "_")
    .replace(/['’]/g, "");
  doc.save(filename);
}

/**
 * Download Course Revision Sheet as PDF
 */
export function generateCoursePDF(sheet: CourseSheet) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("fr-FR");

  let y = addDocumentHeader(
    doc,
    sheet.title,
    `${sheet.subject} - ${sheet.level}`,
    `Chapitre: ${sheet.chapter} | Fiche de révision certifiée EDUAI | Exporté le: ${dateStr}`
  );

  // Objectifs
  y = writeSection(
    doc,
    "1. OBJECTIFS DU COURS",
    sheet.objectives.map((o) => `• ${o}`),
    y
  );

  // Définitions essentielles
  const defs = sheet.definitions.map((d) => `• ${d.term} : ${d.definition}`);
  y = writeSection(doc, "2. DÉFINITIONS ESSENTIELLES", defs, y);

  // Formules clés
  const formulas = sheet.keyFormulas.map(
    (f) => `• ${f.name} : ${f.formula}${f.note ? ` (${f.note})` : ""}`
  );
  y = writeSection(doc, "3. FORMULES & RÈGLES CLÉS", formulas, y);

  // Exemples d'application
  const examples = sheet.examples.map(
    (ex) => `[${ex.title}]\nÉnoncé: ${ex.problem}\nRésolution: ${ex.resolution}`
  );
  y = writeSection(doc, "4. EXEMPLES D'APPLICATION RÉSOLUS", examples, y);

  // Erreurs fréquentes
  const mistakes = sheet.commonMistakes.map((m) => `⚠️ ${m}`);
  y = writeSection(doc, "5. PIÈGES ET ERREURS FRÉQUENTES", mistakes, y);

  // Résumé express
  y = writeSection(doc, "6. RÉSUMÉ EXPRESS (À RETENIR POUR L'EXAMEN)", sheet.summary, y);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `EDUAI par JDDIGITAL  •  Page ${i} sur ${pageCount}  •  Fiche de Révision Officielle EDUAI`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  const filename = `EDUAI_Cours_${sheet.subject}_${sheet.title}.pdf`
    .replace(/\s+/g, "_")
    .replace(/['’]/g, "");
  doc.save(filename);
}

/**
 * Download Quiz Result as PDF
 */
export function generateQuizResultPDF(result: QuizResult) {
  const doc = new jsPDF();
  const dateStr = result.date || new Date().toLocaleDateString("fr-FR");

  let y = addDocumentHeader(
    doc,
    `Résultats : ${result.quizTitle}`,
    `${result.subject} - ${result.level}`,
    `Score : ${result.score}/${result.totalQuestions} (${result.percentage}%) | Date : ${dateStr}`
  );

  // Recap banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Score Final : ${result.score} sur ${result.totalQuestions} (${result.percentage}%)`, 20, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const mention =
    result.percentage >= 80
      ? "Mention Très Bien - Excellente maîtrise !"
      : result.percentage >= 50
      ? "Mention Assez Bien - Notions comprises, continue à t'entraîner !"
      : "À revoir - Consulte la fiche de cours et réessaie !";
  doc.text(mention, 20, y + 14);
  y += 26;

  // Questions breakdown
  result.userAnswers.forEach((item, index) => {
    const statusIcon = item.isCorrect ? "✅ [CORRECT]" : "❌ [INCORRECT]";
    const lines = [
      `${statusIcon} Question: ${item.question}`,
      `Ta réponse : ${item.selectedAnswer}`,
      `Bonne réponse : ${item.correctAnswer}`,
      `Explication : ${item.explanation}`,
    ];
    y = writeSection(doc, `Question ${index + 1}`, lines, y);
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `EDUAI par JDDIGITAL  •  Page ${i} sur ${pageCount}  •  Bilan d'Évaluation`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  doc.save(`EDUAI_Quiz_${result.quizTitle.replace(/\s+/g, "_")}.pdf`);
}

/**
 * Download AI Teacher or Photo solution as PDF
 */
export function generateSolutionPDF(title: string, solution: ExamSolution, questionPrompt?: string) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("fr-FR");

  let y = addDocumentHeader(
    doc,
    title,
    "RÉSOLUTION PÉDAGOGIQUE COMPLÈTE",
    `Généré par EDUAI (JDDIGITAL) | Date : ${dateStr}`
  );

  if (questionPrompt) {
    y = writeSection(doc, "1. ÉNONCÉ DE LA QUESTION", questionPrompt, y);
  }

  y = writeSection(doc, "2. COMPRÉHENSION DU PROBLÈME", [
    `Énoncé compris : ${solution.understoodProblem}`,
    `Données : ${solution.givenData.join(", ")}`,
    `Ce qu'il faut trouver : ${solution.toFind}`,
    `Méthode : ${solution.methodology}`,
  ], y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  if (y > doc.internal.pageSize.getHeight() - 25) {
    doc.addPage();
    y = 20;
  }
  doc.text("3. ÉTAPES DE CALCUL ET RAISONNEMENT", 14, y);
  y += 7;

  solution.steps.forEach((step) => {
    const stepLines: string[] = [step.content];
    if (step.formulas) stepLines.push(`Formules : ${step.formulas.join(" | ")}`);
    if (step.calculationLines) stepLines.push(...step.calculationLines.map((l) => `  → ${l}`));
    if (step.resultHighlight) stepLines.push(`Résultat : ${step.resultHighlight}`);
    y = writeSection(doc, `Étape ${step.stepNumber} : ${step.title}`, stepLines, y);
  });

  y = writeSection(doc, "4. RÉSULTAT FINAL & VÉRIFICATION", [
    `Résultat : ${solution.finalResult}`,
    `Vérification : ${solution.verification}`,
  ], y);

  if (solution.commonPitfalls && solution.commonPitfalls.length > 0) {
    y = writeSection(
      doc,
      "5. PIÈGES ET ERREURS À ÉVITER",
      solution.commonPitfalls.map((p) => `• ${p}`),
      y
    );
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `EDUAI par JDDIGITAL  •  Page ${i} sur ${pageCount}  •  Document Officiel de Résolution`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  doc.save(`EDUAI_Resolution_${title.slice(0, 25).replace(/\s+/g, "_")}.pdf`);
}
