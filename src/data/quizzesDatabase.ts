import { QuizQuestion } from "../types";

export const QUIZZES_DATABASE: QuizQuestion[] = [
  {
    id: "q-math-1",
    subject: "Mathématiques",
    level: "Lycée",
    difficulty: "Intermédiaire",
    question: "Pour l'équation x² + 2x + 3 = 0, quelle est la valeur exacte du discriminant Δ ?",
    mathExpression: "\\Delta = b^2 - 4ac",
    options: ["Δ = 8", "Δ = −8", "Δ = 4", "Δ = −12"],
    correctIndex: 1,
    explanation: "Δ = b² − 4ac = 2² − 4(1)(3) = 4 − 12 = −8.",
  },
  {
    id: "q-math-2",
    subject: "Mathématiques",
    level: "Lycée",
    difficulty: "Difficile",
    question: "Quelles sont les solutions de l'équation x² + 2x + 3 = 0 dans l'ensemble ℂ des nombres complexes ?",
    options: [
      "x₁ = −1 + i√2  et  x₂ = −1 − i√2",
      "x₁ = 1 + i√2  et  x₂ = 1 − i√2",
      "x₁ = −2 + i√8  et  x₂ = −2 − i√8",
      "Aucune solution dans ℂ",
    ],
    correctIndex: 0,
    explanation:
      "Puisque Δ = −8 = (i√8)² = (2i√2)², les racines sont x = (−2 ± 2i√2) / 2 = −1 ± i√2.",
  },
  {
    id: "q-math-3",
    subject: "Mathématiques",
    level: "Collège",
    difficulty: "Facile",
    question: "Dans un triangle rectangle dont les côtés de l'angle droit mesurent 6 cm et 8 cm, quelle est la longueur de l'hypoténuse ?",
    options: ["14 cm", "10 cm", "12 cm", "7 cm"],
    correctIndex: 1,
    explanation:
      "D'après le théorème de Pythagore : L² = 6² + 8² = 36 + 64 = 100, d'où L = √100 = 10 cm.",
  },
  {
    id: "q-math-4",
    subject: "Mathématiques",
    level: "Collège",
    difficulty: "Facile",
    question: "Quelle est la valeur de (3/4 − 1/2) ÷ 5/6 sous forme de fraction irréductible ?",
    options: ["3/10", "1/5", "5/8", "2/3"],
    correctIndex: 0,
    explanation:
      "3/4 − 1/2 = 1/4. Puis (1/4) ÷ (5/6) = (1/4) × (6/5) = 6/20 = 3/10.",
  },
  {
    id: "q-phys-1",
    subject: "Physique-Chimie",
    level: "Lycée",
    difficulty: "Intermédiaire",
    question: "Quelle est l'unité de la constante de gravitation universelle ou de la pesanteur g dans le Système International ?",
    options: ["m/s", "m/s² ou N/kg", "kg/m²", "Joule/s"],
    correctIndex: 1,
    explanation:
      "L'intensité de pesanteur g s'exprime en mètres par seconde carrée (m/s²) ou en Newtons par kilogramme (N/kg).",
  },
  {
    id: "q-phys-2",
    subject: "Physique-Chimie",
    level: "Lycée",
    difficulty: "Intermédiaire",
    question: "Quelle est la relation définissant le pH d'une solution aqueuse diluée ?",
    options: [
      "pH = −log[H₃O⁺]",
      "pH = log[OH⁻]",
      "pH = 14 − [H₃O⁺]",
      "pH = 1 / [H₃O⁺]",
    ],
    correctIndex: 0,
    explanation:
      "Par définition de Sørensen, le potentiel hydrogène est donné par pH = −log[H₃O⁺].",
  },
  {
    id: "q-svt-1",
    subject: "Sciences de la Vie et de la Terre",
    level: "Lycée",
    difficulty: "Intermédiaire",
    question: "Quel phénomène biologique est responsable du brassage intrachromosomique lors de la méiose ?",
    options: [
      "Le crossing-over (enjambement) en prophase I",
      "La mitose en anaphase",
      "La transcription de l'ARN",
      "La duplication de l'ADN en interphase",
    ],
    correctIndex: 0,
    explanation:
      "Le crossing-over en prophase I de méiose permet l'échange réciproque d'allèles entre chromatides homologues.",
  },
  {
    id: "q-fr-1",
    subject: "Français",
    level: "Collège",
    difficulty: "Facile",
    question: "Quelle est la voix passive correcte de la phrase : « Le professeur corrige l'épreuve » ?",
    options: [
      "L'épreuve est corrigée par le professeur.",
      "L'épreuve a été corrigée par le professeur.",
      "Le professeur a corrigé l'épreuve.",
      "L'épreuve sera corrigée par le professeur.",
    ],
    correctIndex: 0,
    explanation:
      "Le verbe étant au présent ('corrige'), la transformation passive utilise l'auxiliaire être au présent : 'est corrigée'.",
  },
  {
    id: "q-philo-1",
    subject: "Philosophie",
    level: "Lycée",
    difficulty: "Intermédiaire",
    question: "Qui est l'auteur de la célèbre formule : « L'homme est condamné à être libre » ?",
    options: ["Jean-Paul Sartre", "René Descartes", "Emmanuel Kant", "Platon"],
    correctIndex: 0,
    explanation:
      "Jean-Paul Sartre formule cette thèse dans 'L'existentialisme est un humanisme' (1946).",
  },
  {
    id: "q-geo-1",
    subject: "Histoire-Géographie",
    level: "Collège",
    difficulty: "Facile",
    question: "Quel est le plus long fleuve du continent africain ?",
    options: ["Le Nil", "Le fleuve Congo", "Le fleuve Niger", "Le Zambèze"],
    correctIndex: 0,
    explanation:
      "Le Nil est le plus long fleuve d'Afrique (environ 6 650 km), suivi du fleuve Congo qui est le plus puissant en débit.",
  },
];
