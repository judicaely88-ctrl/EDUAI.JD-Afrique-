import { CourseSheet } from "../types";

export const COURSES_DATABASE: CourseSheet[] = [
  {
    id: "math-second-degre",
    title: "Les Équations du Second Degré dans ℝ et ℂ",
    subject: "Mathématiques",
    level: "Lycée",
    chapter: "Polynômes & Équations",
    objectives: [
      "Maîtriser la forme canonique d'un trinôme du second degré.",
      "Calculer le discriminant Δ = b² − 4ac sans erreur de signe.",
      "Déterminer les solutions dans ℝ (cas Δ > 0 et Δ = 0) et dans ℂ (cas Δ < 0).",
      "Factoriser le trinôme et déterminer son signe.",
    ],
    definitions: [
      {
        term: "Trinôme du second degré",
        definition: "Toute fonction polynôme de la forme P(x) = ax² + bx + c où a, b, c sont des réels avec a ≠ 0.",
      },
      {
        term: "Discriminant (Δ)",
        definition: "Le nombre réel noté Δ défini par Δ = b² − 4ac qui caractérise l'existence et la nature des racines.",
      },
      {
        term: "Nombre imaginaire i",
        definition: "L'unité imaginaire définie par la relation fondamentale i² = −1.",
      },
    ],
    keyFormulas: [
      {
        name: "Discriminant",
        formula: "Δ = b² − 4ac",
        note: "Prendre garde au calcul de (-b)² qui est toujours positif",
      },
      {
        name: "Solutions si Δ > 0",
        formula: "x₁ = (−b − √Δ) / 2a  et  x₂ = (−b + √Δ) / 2a",
        note: "Deux racines réelles distinctes",
      },
      {
        name: "Racine double si Δ = 0",
        formula: "x₀ = −b / 2a",
        note: "Une seule racine réelle",
      },
      {
        name: "Solutions dans ℂ si Δ < 0",
        formula: "x₁ = (−b + i√|Δ|) / 2a  et  x₂ = (−b − i√|Δ|) / 2a",
        note: "Deux racines complexes conjuguées",
      },
      {
        name: "Somme et produit des racines",
        formula: "S = x₁ + x₂ = −b/a   et   P = x₁ × x₂ = c/a",
        note: "Permet de vérifier instantanément ses calculs",
      },
    ],
    examples: [
      {
        title: "Cas Δ < 0 : Résolution de x² + 2x + 3 = 0",
        problem: "Résoudre dans ℂ l'équation x² + 2x + 3 = 0",
        resolution: `1. Coefficients : a = 1, b = 2, c = 3
2. Calcul du discriminant : Δ = 2² − 4 × 1 × 3 = 4 − 12 = −8
3. Comme Δ < 0, l'équation ne possède aucune solution réelle dans ℝ.
4. Dans ℂ, Δ = (i√8)² = (2i√2)².
5. Les solutions sont :
   x₁ = (−2 + 2i√2) / 2 = −1 + i√2
   x₂ = (−2 − 2i√2) / 2 = −1 − i√2
   S = { −1 + i√2 ; −1 − i√2 }`,
      },
      {
        title: "Cas Δ > 0 : Résolution de 2x² − 5x + 2 = 0",
        problem: "Résoudre dans ℝ l'équation 2x² − 5x + 2 = 0",
        resolution: `1. a = 2, b = −5, c = 2
2. Δ = (−5)² − 4 × 2 × 2 = 25 − 16 = 9
3. √Δ = √9 = 3
4. x₁ = (5 − 3) / (2 × 2) = 2 / 4 = 1/2
   x₂ = (5 + 3) / (2 × 2) = 8 / 4 = 2
   S = { 1/2 ; 2 }`,
      },
    ],
    commonMistakes: [
      "Oublier les parenthèses lors du calcul de b² lorsque b est négatif (ex: (-3)² = 9, et non -9).",
      "Écrire que l'équation n'a pas de solution lorsque Δ < 0, sans préciser 'dans ℝ' (au lycée et au Bac, on attend les solutions dans ℂ).",
      "Oublier de multiplier le dénominateur par a : c'est 2a, pas 2 !",
    ],
    summary:
      "Pour résoudre ax² + bx + c = 0 : toujours ordonner l'expression, calculer Δ = b² − 4ac. Si Δ > 0 : 2 racines réelles. Si Δ = 0 : 1 racine double −b/2a. Si Δ < 0 : pas de racine dans ℝ, 2 racines complexes conjuguées (−b ± i√|Δ|)/2a dans ℂ.",
    quickQuiz: [
      {
        question: "Quel est le discriminant de l'équation x² + 2x + 3 = 0 ?",
        options: ["Δ = 8", "Δ = −8", "Δ = 16", "Δ = −12"],
        correctIndex: 1,
        explanation: "Δ = b² − 4ac = 2² − 4(1)(3) = 4 − 12 = −8.",
      },
      {
        question: "Si Δ < 0, quelles sont les solutions de ax² + bx + c = 0 dans ℝ ?",
        options: ["Une infinité", "Deux solutions réelles", "Aucune solution réelle (S = ∅)", "Une solution nulle"],
        correctIndex: 2,
        explanation: "Un carré dans ℝ ne pouvant pas être strictement négatif, il n'existe aucune solution réelle.",
      },
    ],
  },
  {
    id: "phys-newton-mouvement",
    title: "Cinématique et Deuxième Loi de Newton",
    subject: "Physique-Chimie",
    level: "Lycée",
    chapter: "Mécanique du point",
    objectives: [
      "Définir les vecteurs position, vitesse et accélération.",
      "Énoncer la 2nde loi de Newton (principe fondamental de la dynamique).",
      "Établir les équations horaires du mouvement dans un champ uniforme.",
    ],
    definitions: [
      {
        term: "Vecteur Vitesse",
        definition: "Dérivée temporelle du vecteur position : v⃗(t) = d(OG⃗)/dt.",
      },
      {
        term: "Vecteur Accélération",
        definition: "Dérivée temporelle du vecteur vitesse : a⃗(t) = d(v⃗)/dt.",
      },
      {
        term: "Référentiel galiléen",
        definition: "Référentiel dans lequel le principe d'inertie (1ère loi de Newton) est rigoureusement vérifié.",
      },
    ],
    keyFormulas: [
      {
        name: "Deuxième loi de Newton",
        formula: "Σ F⃗_ext = m · a⃗",
        note: "Valable en référentiel galiléen avec masse m constante en kg",
      },
      {
        name: "Chute libre sans frottement",
        formula: "a⃗ = g⃗",
        note: "L'accélération est indépendante de la masse du corps",
      },
      {
        name: "Portée d'un tir parabolique",
        formula: "X_P = (v₀² sin 2α) / g",
        note: "Portée maximale obtenue pour un angle α = 45°",
      },
    ],
    examples: [
      {
        title: "Calcul de l'accélération d'un véhicule",
        problem: "Une voiture de masse m = 1200 kg accélère sous une force motrice nette F = 2400 N. Calculer a.",
        resolution: `1. Formule : a = F / m
2. Application numérique : a = 2400 / 1200 = 2 m/s²
3. L'accélération constante du véhicule est de 2 m/s².`,
      },
    ],
    commonMistakes: [
      "Confondre poids (P = mg en Newtons) et masse (m en kilogrammes).",
      "Oublier de projeter les forces sur les axes du repère avant d'écrire les équations scalaires.",
    ],
    summary:
      "La cinématique décrit le mouvement sans se préoccuper de ses causes. La dynamique relie le mouvement aux forces grâce à Σ F⃗ = m a⃗. Dans un champ de pesanteur uniforme sans frottement, la trajectoire d'un projectile est parabolique.",
    quickQuiz: [
      {
        question: "Pour quel angle de tir la portée d'un projectile est-elle maximale (sur sol plat) ?",
        options: ["30°", "45°", "60°", "90°"],
        correctIndex: 1,
        explanation: "La portée s'exprime par (v₀² sin 2α)/g. La fonction sin(2α) atteint son maximum 1 pour 2α = 90°, soit α = 45°.",
      },
    ],
  },
  {
    id: "svt-genetique-mendel",
    title: "Génétique et Brassage Génétique des Caractères",
    subject: "Sciences de la Vie et de la Terre",
    level: "Lycée",
    chapter: "Génétique fondamentale",
    objectives: [
      "Distinguer phénotype, génotype, allèle dominant et récessif.",
      "Comprendre les lois de Mendel (uniformité de F1, ségrégation indépendante).",
      "Distinguer gènes indépendants (brassage interchromosomique) et gènes liés (brassage intrachromosomique / crossing-over).",
    ],
    definitions: [
      {
        term: "Gène et Allèle",
        definition: "Un gène est une séquence d'ADN codant pour un caractère. Les allèles sont les différentes versions alternatives de ce gène.",
      },
      {
        term: "Test-cross (croisement-test)",
        definition: "Croisement d'un individu de génotype inconnu ou hétérozygote avec un individu homozygote double récessif.",
      },
      {
        term: "Crossing-over (enjambement)",
        definition: "Échange réciproque de segments de chromatides non-sœurs entre chromosomes homologues en prophase I de méiose.",
      },
    ],
    keyFormulas: [
      {
        name: "Distance génétique (Centimorgan)",
        formula: "d = (Nombre de recombinés / Nombre total d'individus) × 100",
        note: "1 cM = 1% de recombinaison",
      },
    ],
    examples: [
      {
        title: "Test-cross avec 17% de recombinés",
        problem: "Un test-cross donne 83% de types parentaux et 17% de types recombinés. Interpréter.",
        resolution: `1. Types parentaux > 50% : les gènes sont portés par le même chromosome (gènes liés).
2. Taux de recombinaison = 17%.
3. La distance factorielle entre les deux gènes est d = 17 cM.`,
      },
    ],
    commonMistakes: [
      "Penser que le test-cross donne toujours 4 phénotypes à 25% : ce n'est vrai que si les gènes sont indépendants !",
    ],
    summary:
      "La méiose assure deux brassages majeurs : intrachromosomique (crossing-over en prophase I pour les gènes liés) et interchromosomique (séparation aléatoire des bivalents en anaphase I pour les gènes indépendants).",
    quickQuiz: [
      {
        question: "Que signifie un résultat de test-cross donnant 83% de types parentaux et 17% de recombinés ?",
        options: ["Les gènes sont indépendants", "Les gènes sont liés avec crossing-over", "La première loi de Mendel est fausse", "Il y a eu mutation létale"],
        correctIndex: 1,
        explanation: "La prédominance des phénotypes parentaux (> 50%) prouve la liaison physique des deux gènes sur le même chromosome.",
      },
    ],
  },
  {
    id: "philo-methode-dissertation",
    title: "Méthodologie de la Dissertation Philosophique",
    subject: "Philosophie",
    level: "Lycée",
    chapter: "Méthodologie du Baccalauréat",
    objectives: [
      "Maîtriser les 3 temps de l'introduction : amorce, problème/paradoxe, annonce du plan.",
      "Construire un plan dialectique rigoureux (Thèse, Antithèse, Synthèse/Dépassement).",
      "Rédiger des transitions argumentées et une conclusion qui résout le problème posé.",
    ],
    definitions: [
      {
        term: "Problématique",
        definition: "La tension interne ou le paradoxe intellectuel qui émerge de l'analyse attentive du sujet posé.",
      },
      {
        term: "Plan dialectique",
        definition: "Structure en 3 parties examinant successivement une première thèse évidente, ses limites (antithèse), puis un dépassement réflexif.",
      },
    ],
    keyFormulas: [
      {
        name: "Structure de l'introduction",
        formula: "Amorce contextuelle → Définition des termes → Paradoxe / Problématique → Annonce du plan",
      },
    ],
    examples: [
      {
        title: "Sujet : « La liberté consiste-t-elle à faire tout ce qui nous plaît ? »",
        problem: "Formuler la problématique de ce sujet classique.",
        resolution: `Paradoxe : Si la liberté semble au premier abord consister dans la satisfaction immédiate de tous ses désirs (licence), ne risque-t-elle pas alors de nous soumettre à la tyrannie de nos pulsions et de détruire la vie en société ? Être libre, n'est-ce pas plutôt obéir à la loi que la raison s'est donnée ?`,
      },
    ],
    commonMistakes: [
      "Répondre simplement 'oui' puis 'non' sans véritable problématisation.",
      "Empiler des citations de philosophes sans expliquer le raisonnement.",
    ],
    summary:
      "La dissertation n'est pas un catalogue d'opinions personnelles, mais une enquête philosophique méthodique où chaque idée est justifiée par un argument rationnel et illustrée par un exemple précis.",
    quickQuiz: [
      {
        question: "Quel est l'élément le plus capital d'une introduction de philosophie ?",
        options: ["La date de naissance des auteurs", "La problématique (le paradoxe)", "Le style poétique", "Le résumé de sa vie"],
        correctIndex: 1,
        explanation: "La problématique est le cœur de la dissertation : elle montre pourquoi la question mérite d'être posée.",
      },
    ],
  },
];
