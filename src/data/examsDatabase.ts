import { ExamItem } from "../types";

export const EXAMS_DATABASE: ExamItem[] = [
  {
    id: "ci-bac-math-2024",
    title: "Baccalauréat Série C & D - Épreuve de Mathématiques (Session 2024)",
    countryId: "ci",
    countryName: "Côte d'Ivoire",
    level: "Lycée",
    examType: "Baccalauréat Série D",
    year: 2024,
    subject: "Mathématiques",
    source: "Direction des Examens et Concours (DECO - Côte d'Ivoire)",
    status: "CORRIGE_PEDAGOGIQUE",
    hasSolution: true,
    statement: `EXERCICE 1 (4 points) - Nombres complexes et équations du second degré

Le plan complexe est rapporté à un repère orthonormé direct (O; u⃗, v⃗).

1. Résoudre dans l'ensemble ℂ des nombres complexes l'équation :
   x² + 2x + 3 = 0

2. On désigne par x₁ et x₂ les solutions obtenues, avec Im(x₁) > 0.
   a) Déterminer la forme algébrique exacte de x₁ et x₂.
   b) Déterminer le module et un argument principal de x₁.
   c) En déduire la forme trigonométrique et exponentielle de x₁.

3. On considère la suite numérique (Uₙ) définie pour tout entier naturel n par :
   U₀ = 2  et  Uₙ₊₁ = 3Uₙ + 1
   Calculer U₁, U₂ et exprimer Uₙ en fonction de n.`,
    solution: {
      understoodProblem:
        "Résolution d'une équation du 2nd degré à coefficients réels dans le corps des nombres complexes ℂ, calcul du module et argument, et calcul des premiers termes d'une suite arithmético-géométrique.",
      givenData: [
        "Équation : x² + 2x + 3 = 0",
        "Coefficients : a = 1, b = 2, c = 3",
        "Condition : Im(x₁) > 0",
        "Suite : U₀ = 2, Uₙ₊₁ = 3Uₙ + 1",
      ],
      toFind: "Les racines x₁ et x₂ dans ℂ, le module |x₁|, l'argument arg(x₁), et les termes U₁, U₂.",
      methodology:
        "Calcul du discriminant Δ = b² − 4ac. Analyse de son signe (Δ < 0). Utilisation de i² = −1 pour extraire les racines complexes conjuguées. Formules de trigonométrie complexe.",
      steps: [
        {
          stepNumber: 1,
          title: "Identification des coefficients et calcul du discriminant Δ",
          content: "Pour l'équation x² + 2x + 3 = 0 sous la forme générale ax² + bx + c = 0 :",
          formulas: ["Δ = b² − 4ac"],
          calculationLines: [
            "a = 1",
            "b = 2",
            "c = 3",
            "Δ = 2² − 4 × 1 × 3",
            "Δ = 4 − 12",
            "Δ = −8",
          ],
          resultHighlight: "Δ = −8",
        },
        {
          stepNumber: 2,
          title: "Détermination des racines complexes x₁ et x₂",
          content:
            "Comme Δ < 0, l'équation n'a aucune solution dans ℝ. Dans ℂ, Δ s'écrit : Δ = (i√8)² = (2i√2)².",
          formulas: ["x = (−b ± i√|Δ|) / 2a"],
          calculationLines: [
            "x = (−2 ± 2i√2) / (2 × 1)",
            "x = −1 ± i√2",
            "Comme Im(x₁) > 0 : x₁ = −1 + i√2",
            "x₂ = −1 − i√2",
          ],
          resultHighlight: "x₁ = −1 + i√2  et  x₂ = −1 − i√2",
        },
        {
          stepNumber: 3,
          title: "Module et argument principal de x₁",
          content: "Calcul du module r = |x₁| = √(a² + b²) :",
          formulas: ["|z| = √(Re(z)² + Im(z)²)", "cos θ = Re(z)/|z|", "sin θ = Im(z)/|z|"],
          calculationLines: [
            "|x₁| = √((−1)² + (√2)²)",
            "|x₁| = √(1 + 2) = √3",
            "cos θ = −1 / √3 = −√3 / 3",
            "sin θ = √2 / √3 = √6 / 3",
            "θ = π − arccos(√3/3) radians",
          ],
          resultHighlight: "|x₁| = √3",
        },
        {
          stepNumber: 4,
          title: "Calcul des termes de la suite (Uₙ)",
          content: "On applique la relation de récurrence Uₙ₊₁ = 3Uₙ + 1 à partir de U₀ = 2 :",
          calculationLines: [
            "U₁ = 3 × U₀ + 1 = 3 × 2 + 1 = 6 + 1 = 7",
            "U₂ = 3 × U₁ + 1 = 3 × 7 + 1 = 21 + 1 = 22",
          ],
          resultHighlight: "U₁ = 7  et  U₂ = 22",
        },
      ],
      finalResult:
        "1. Les solutions dans ℂ sont S = { −1 + i√2 ; −1 − i√2 }.\n2. x₁ = −1 + i√2 avec |x₁| = √3.\n3. U₁ = 7 et U₂ = 22.",
      verification:
        "Vérification algébrique : x₁² + 2x₁ + 3 = (−1 + i√2)² + 2(−1 + i√2) + 3 = (1 − 2√2 i − 2) + (−2 + 2√2 i) + 3 = −1 − 2 + 3 = 0. Le résultat est parfaitement exact.",
      commonPitfalls: [
        "Ne pas écrire 'pas de solution' sans préciser que c'est dans ℝ. Dans ℂ, il y a toujours deux solutions !",
        "Erreur de simplification : oublier de diviser tous les termes par 2a.",
        "Confondre i² = −1 avec √−1.",
      ],
    },
  },
  {
    id: "ci-bepc-math-2023",
    title: "BEPC - Épreuve de Mathématiques (Session 2023)",
    countryId: "ci",
    countryName: "Côte d'Ivoire",
    level: "Collège",
    examType: "BEPC",
    year: 2023,
    subject: "Mathématiques",
    source: "DECO - Ministère de l'Éducation Nationale et de l'Alphabétisation (CI)",
    status: "VERIFIE_OFFICIEL",
    hasSolution: true,
    statement: `EXERCICE 1 : Calcul numérique et puissances (5 points)

1. On pose A = (3/4 − 1/2) ÷ 5/6
   Calculer A et donner le résultat sous la forme d'une fraction irréductible.

2. On donne B = √50 − 2√18 + √8
   Écrire B sous la forme a√2 où a est un nombre entier relatif.

EXERCICE 2 : Géométrie et Théorème de Pythagore (5 points)

Soit ABC un triangle rectangle en A tel que AB = 6 cm et AC = 8 cm.
1. Calculer la longueur BC.
2. Soit H le projeté orthogonal de A sur (BC).
   En exprimant l'aire du triangle ABC de deux manières différentes, calculer AH.`,
    solution: {
      understoodProblem:
        "Calcul fractionnaire avec priorité opératoire, simplification de radicaux sous la forme a√b, et calcul de longueurs dans un triangle rectangle avec le théorème de Pythagore.",
      givenData: [
        "A = (3/4 − 1/2) ÷ 5/6",
        "B = √50 − 2√18 + √8",
        "Triangle ABC rectangle en A avec AB = 6 cm et AC = 8 cm",
      ],
      toFind: "Fraction irréductible A, écriture simplifiée de B, longueur de l'hypoténuse BC, et hauteur AH.",
      methodology:
        "Mise au même dénominateur pour la soustraction de fractions, division par inversion. Décomposition en facteurs premiers pour les racines carrées. Théorème de Pythagore pour BC et formule d'aire pour la hauteur.",
      steps: [
        {
          stepNumber: 1,
          title: "Calcul de la fraction A",
          content: "On commence par calculer la parenthèse avec le dénominateur commun 4 :",
          calculationLines: [
            "3/4 − 1/2 = 3/4 − 2/4 = 1/4",
            "A = (1/4) ÷ (5/6) = (1/4) × (6/5)",
            "A = (1 × 6) / (4 × 5) = 6 / 20",
            "On simplifie par 2 : A = 3 / 10",
          ],
          resultHighlight: "A = 3/10",
        },
        {
          stepNumber: 2,
          title: "Simplification de l'expression B",
          content: "On décompose chaque radicande avec le carré parfait 2 :",
          calculationLines: [
            "√50 = √(25 × 2) = 5√2",
            "2√18 = 2 × √(9 × 2) = 2 × 3√2 = 6√2",
            "√8 = √(4 × 2) = 2√2",
            "B = 5√2 − 6√2 + 2√2 = (5 − 6 + 2)√2 = 1√2",
          ],
          resultHighlight: "B = √2",
        },
        {
          stepNumber: 3,
          title: "Calcul de la longueur BC (Pythagore)",
          content: "Le triangle ABC étant rectangle en A, d'après le théorème de Pythagore :",
          formulas: ["BC² = AB² + AC²"],
          calculationLines: [
            "BC² = 6² + 8²",
            "BC² = 36 + 64 = 100",
            "BC = √100 = 10 cm",
          ],
          resultHighlight: "BC = 10 cm",
        },
        {
          stepNumber: 4,
          title: "Calcul de la hauteur AH par les aires",
          content: "Aire(ABC) = (AB × AC) / 2 = (BC × AH) / 2 :",
          calculationLines: [
            "AB × AC = BC × AH",
            "6 × 8 = 10 × AH",
            "48 = 10 × AH",
            "AH = 48 / 10 = 4,8 cm",
          ],
          resultHighlight: "AH = 4,8 cm",
        },
      ],
      finalResult: "A = 3/10,  B = √2,  BC = 10 cm,  AH = 4,8 cm",
      verification:
        "Vérification du triangle 3-4-5 dilaté d'un facteur 2 : 6, 8, 10. AH = 6 × 8 / 10 = 4,8. Tout concorde parfaitement.",
      commonPitfalls: [
        "Effectuer la division avant la parenthèse.",
        "Additionner les radicandes entre eux : √(a + b) ≠ √a + √b !",
        "Oublier l'unité de mesure (cm) pour les grandeurs géométriques.",
      ],
    },
  },
  {
    id: "sn-bac-phys-2023",
    title: "Baccalauréat Série S2 - Sciences Physiques (Session 2023)",
    countryId: "sn",
    countryName: "Sénégal",
    level: "Lycée",
    examType: "Baccalauréat Série S2",
    year: 2023,
    subject: "Physique-Chimie",
    source: "Office du Baccalauréat du Sénégal",
    status: "VERIFIE_OFFICIEL",
    hasSolution: true,
    statement: `EXERCICE DE MÉCANIQUE : Mouvement d'un projectile dans le champ de pesanteur (6 points)

Un projectile de masse m = 200 g est lancé à partir d'un point O pris comme origine du repère (O, i⃗, j⃗), à l'instant t = 0 s, avec une vitesse initiale v₀ = 20 m/s faisant un angle α = 30° avec l'horizontale.
On néglige les frottements de l'air et on prend g = 9,8 m/s².

1. Établir les équations horaires de la vitesse et de la position du projectile.
2. Déterminer l'équation de la trajectoire y(x).
3. Calculer la hauteur maximale H (la flèche) atteinte par le projectile.
4. Calculer la portée X_P du tir (point de retombée sur l'axe Ox).`,
    solution: {
      understoodProblem:
        "Étude cinématique et dynamique du mouvement plan d'un projectile lancé avec une vitesse oblique dans un champ de pesanteur uniforme.",
      givenData: [
        "Masse m = 200 g = 0,2 kg (sans influence dans le vide)",
        "Vitesse initiale v₀ = 20 m/s",
        "Angle de tir α = 30°",
        "Intensité de la pesanteur g = 9,8 m/s²",
        "Conditions initiales : à t = 0, x₀ = 0, y₀ = 0, v₀x = v₀ cos α, v₀y = v₀ sin α",
      ],
      toFind: "Équations horaires x(t), y(t), trajectoire y(x), flèche H et portée X_P.",
      methodology:
        "Deuxième loi de Newton : Σ F⃗ = m a⃗. Le projectile n'est soumis qu'à son poids P⃗ = m g⃗. Intégration vectorielle successive pour obtenir vitesse et position.",
      steps: [
        {
          stepNumber: 1,
          title: "Application de la 2nde loi de Newton et équations horaires",
          content: "Système : {projectile}. Référentiel terrestre supposé galiléen. P⃗ = m a⃗ ⇒ a⃗ = g⃗.",
          formulas: ["ax(t) = 0", "ay(t) = −g"],
          calculationLines: [
            "vx(t) = v₀ cos α = 20 × cos(30°) = 20 × (√3/2) = 10√3 ≈ 17,32 m/s",
            "vy(t) = −gt + v₀ sin α = −9,8t + 20 × sin(30°) = −9,8t + 10",
            "x(t) = (v₀ cos α) t = 10√3 t",
            "y(t) = −(1/2)gt² + (v₀ sin α) t = −4,9 t² + 10 t",
          ],
          resultHighlight: "x(t) = 17,32 t   et   y(t) = −4,9 t² + 10 t",
        },
        {
          stepNumber: 2,
          title: "Équation cartésienne de la trajectoire y(x)",
          content: "On extrait t de x(t) : t = x / (v₀ cos α) et on substitue dans y(t) :",
          formulas: ["y = − [g / (2 v₀² cos² α)] x² + (tan α) x"],
          calculationLines: [
            "2 v₀² cos² α = 2 × 400 × (3/4) = 600",
            "g / (2 v₀² cos² α) = 9,8 / 600 ≈ 0,01633",
            "tan(30°) = 1 / √3 ≈ 0,577",
            "y(x) = −0,01633 x² + 0,577 x",
          ],
          resultHighlight: "Trajectoire parabolique : y(x) = −0,01633 x² + 0,577 x",
        },
        {
          stepNumber: 3,
          title: "Hauteur maximale (Flèche H)",
          content: "Au sommet S de la trajectoire, la composante verticale de la vitesse s'annule : vy(t_S) = 0.",
          formulas: ["t_S = (v₀ sin α) / g", "H = (v₀² sin² α) / (2g)"],
          calculationLines: [
            "t_S = 10 / 9,8 ≈ 1,02 s",
            "H = 10² / (2 × 9,8) = 100 / 19,6 ≈ 5,10 m",
          ],
          resultHighlight: "H = 5,10 mètres",
        },
        {
          stepNumber: 4,
          title: "Portée X_P du tir",
          content: "Le projectile touche le sol lorsque y = 0 pour x > 0 :",
          formulas: ["X_P = (v₀² sin 2α) / g"],
          calculationLines: [
            "sin(2α) = sin(60°) = √3 / 2 ≈ 0,866",
            "X_P = (400 × 0,866) / 9,8 = 346,41 / 9,8 ≈ 35,35 m",
          ],
          resultHighlight: "X_P = 35,35 mètres",
        },
      ],
      finalResult:
        "1. x(t) = 17,32 t ; y(t) = −4,9 t² + 10 t\n2. y(x) = −0,01633 x² + 0,577 x\n3. Flèche H = 5,10 m\n4. Portée X_P = 35,35 m",
      verification:
        "Vérification d'ordre de grandeur : à 20 m/s (~72 km/h) sous 30°, une portée d'environ 35 m et une flèche de 5 m correspondent fidèlement aux lois de la balistique.",
      commonPitfalls: [
        "Confondre cosinus et sinus pour les projections horizontales et verticales.",
        "Oublier que la vitesse au sommet n'est pas nulle, seule sa composante vy est nulle (vx reste constante).",
        "Ne pas convertir les angles en radians si on utilise une calculatrice mal réglée.",
      ],
    },
  },
  {
    id: "cm-bac-svt-2023",
    title: "Baccalauréat Série D - Sciences de la Vie et de la Terre (Session 2023)",
    countryId: "cm",
    countryName: "Cameroun",
    level: "Lycée",
    examType: "Baccalauréat",
    year: 2023,
    subject: "Sciences de la Vie et de la Terre",
    source: "Office du Baccalauréat du Cameroun (OBC)",
    status: "VERIFIE_OFFICIEL",
    hasSolution: true,
    statement: `PARTIE I : Restitution organisée de connaissances (8 points) - Génétique mendélienne

Chez la drosophile (Drosophila melanogaster), on étudie la transmission de deux couples d'allèles gouvernant :
- La couleur du corps : corps gris [G] ou corps noir [n]
- La longueur des ailes : ailes longues [L] ou ailes vestigiales [vg]

On croise une femelle de race pure à corps gris et ailes longues avec un mâle à corps noir et ailes vestigiales.
Tous les individus F1 ont le corps gris et les ailes longues.
On réalise ensuite un test-cross entre une femelle F1 et un mâle double récessif. On obtient les descendants suivants :
- 965 drosophiles [G, L]
- 944 drosophiles [n, vg]
- 206 drosophiles [G, vg]
- 185 drosophiles [n, L]

1. Que déduisez-vous des résultats de la génération F1 ?
2. Analysez les résultats du test-cross. Les deux gènes sont-ils indépendants ou liés ? Justifiez.
3. Établissez la carte factorielle (distance génétique en centimorgans cM) entre ces deux gènes.`,
    solution: {
      understoodProblem:
        "Analyse de croisement dihybridique chez la drosophile pour déterminer la dominance, le linkage (liaison génétique) et calculer le taux de recombinaison pour dresser la carte génétique.",
      givenData: [
        "Parents purs : [G, L] × [n, vg]",
        "F1 : 100% [G, L]",
        "Test-cross femelle F1 × mâle [n, vg] :",
        "  - Types parentaux : 965 [G, L] + 944 [n, vg] = 1909 individus",
        "  - Types recombinés : 206 [G, vg] + 185 [n, L] = 391 individus",
        "Total = 2300 individus",
      ],
      toFind: "Relations de dominance, mode de transmission (liaison ou indépendance), distance génétique en cM.",
      methodology:
        "1ère loi de Mendel pour la dominance. Comparaison des proportions du test-cross aux ratios théoriques (25%-25%-25%-25% pour indépendance vs prédominance parentale pour liaison). Formule de Morgan pour la distance.",
      steps: [
        {
          stepNumber: 1,
          title: "Analyse de la F1 et relations de dominance",
          content:
            "Le croisement de deux souches pures donne une descendance F1 100% homogène (1ère loi de Mendel vérifiée).",
          calculationLines: [
            "Le phénotype corps gris apparaît en F1 : l'allèle G (gris) domine l'allèle n (noir).",
            "Le phénotype ailes longues apparaît en F1 : l'allèle L (longues) domine l'allèle vg (vestigiales).",
            "Génotype de la femelle F1 : (G L // n vg)",
          ],
          resultHighlight: "G > n  et  L > vg",
        },
        {
          stepNumber: 2,
          title: "Analyse du test-cross et mise en évidence de la liaison génétique",
          content:
            "Si les gènes étaient indépendants, le test-cross donnerait 4 phénotypes équiprobables à 25% chacun.",
          calculationLines: [
            "Nombre d'individus parentaux : 1909 / 2300 = 83,0 %",
            "Nombre d'individus recombinés : 391 / 2300 = 17,0 %",
            "Puisque les types parentaux sont nettement supérieurs aux types recombinés (83% >> 17%), les deux gènes sont liés (linkage) sur le même autosome.",
            "Les recombinés résultent d'un crossing-over (enjambement méiotique) lors de la prophase I chez la femelle F1.",
          ],
          resultHighlight: "Gènes liés sur le même chromosome (Linkage partiel)",
        },
        {
          stepNumber: 3,
          title: "Calcul du taux de recombinaison et carte factorielle",
          content: "La distance entre deux gènes est égale au pourcentage de recombinaison (1% = 1 cM) :",
          formulas: ["d = (Nombre de recombinés / Nombre total) × 100"],
          calculationLines: [
            "d = (391 / 2300) × 100",
            "d = 17,0 cM (centimorgans)",
          ],
          resultHighlight: "Distance génétique = 17 cM",
        },
      ],
      finalResult:
        "1. Allèle [G] dominant sur [n], et [L] dominant sur [vg].\n2. Les deux gènes sont physiquement liés sur le même chromosome avec crossing-over.\n3. La distance génétique entre le locus de la couleur du corps et de la longueur des ailes est de 17 cM.",
      verification:
        "Correspondance avec les données historiques de Thomas Hunt Morgan : la distance classique Black - Vestigial chez Drosophila melanogaster est précisément mesurée entre 17 et 18,5 cM.",
      commonPitfalls: [
        "Confondre test-cross (croisement avec récessif) et F2 (F1 × F1).",
        "Oublier que chez la drosophile mâle, il n'y a jamais de crossing-over.",
      ],
    },
  },
  {
    id: "bj-bepc-fr-2023",
    title: "BEPC - Épreuve de Français (Session 2023)",
    countryId: "bj",
    countryName: "Bénin",
    level: "Collège",
    examType: "BEPC",
    year: 2023,
    subject: "Français",
    source: "Direction des Examens et Concours (DEC - Bénin)",
    status: "VERIFIE_OFFICIEL",
    hasSolution: true,
    statement: `TEXTE : « L'éducation des jeunes filles en Afrique »

« Instruire une femme, c'est instruire toute une nation », disait un sage africain. Partout sur notre continent, lorsque l'on ouvre les portes de l'école aux jeunes filles, c'est la santé communautaire qui s'améliore, l'économie locale qui s'émancipe et le tissu social qui se consolide. Pourtant, trop d'obstacles subsistent : mariages précoces, corvées domestiques écrasantes, préjugés d'un autre temps. Il est impératif que chaque communauté comprenne que le savoir est la clé de la liberté.

QUESTIONS :
I. Compréhension du texte (4 points)
1. Quelle est la thèse défendue par l'auteur dans ce texte ?
2. Citez deux obstacles à l'éducation des filles mentionnés dans l'extrait.

II. Compétences de langue (6 points)
1. Donnez la nature et la fonction de la proposition soulignée : « lorsque l'on ouvre les portes de l'école aux jeunes filles ».
2. Transformez la phrase suivante à la voix passive : « Le savoir émancipera la jeunesse africaine ».

III. Production écrite (10 points)
Rédigez un paragraphe argumentatif de 15 lignes montrant l'importance des technologies numériques et de l'intelligence artificielle pour l'éducation des élèves dans nos pays.`,
    solution: {
      understoodProblem:
        "Compréhension de texte argumentatif, analyse grammaticale (subordonnée circonstancielle de temps, transformation passive) et rédaction argumentative structurée.",
      givenData: [
        "Texte sur l'autonomisation par l'instruction féminine",
        "Consigne de production : importance du numérique pour l'Afrique",
      ],
      toFind: "Thèse, obstacles, analyse grammaticale, voix passive, paragraphe argumentatif.",
      methodology:
        "Recherche de l'idée directrice, repérage précis des éléments du texte, application des règles de syntaxe grammaticale, rédaction selon le schéma Thèse - Arguments - Exemples.",
      steps: [
        {
          stepNumber: 1,
          title: "Compréhension du texte",
          content: "Réponse précise aux questions de fond :",
          calculationLines: [
            "1. Thèse défendue : L'instruction des jeunes filles est un puissant levier de développement social et économique pour toute la nation.",
            "2. Deux obstacles : Les mariages précoces et les corvées domestiques écrasantes.",
          ],
          resultHighlight: "Thèse et obstacles correctement identifiés",
        },
        {
          stepNumber: 2,
          title: "Compétences de langue et grammaire",
          content: "Analyse grammaticale rigoureuse :",
          calculationLines: [
            "1. Proposition subordonnée conjonctive circonstancielle de temps, introduite par la conjonction 'lorsque', complément circonstanciel de temps du verbe principal 's'améliore'.",
            "2. Transformation à la voix passive : 'La jeunesse africaine sera émancipée par le savoir.' (Attention au respect du futur simple).",
          ],
          resultHighlight: "Voix passive au futur simple respectée",
        },
        {
          stepNumber: 3,
          title: "Plan de la production écrite",
          content: "Structure du paragraphe argumentatif :",
          calculationLines: [
            "Introduction : L'Afrique vit une révolution numérique porteuse d'opportunités sans précédent.",
            "Argument 1 : L'accès universel au savoir grâce aux bibliothèques virtuelles et plateformes éducatives (ex: EDUAI).",
            "Argument 2 : L'apprentissage personnalisé et l'aide aux devoirs sans frais rédhibitoires.",
            "Conclusion : L'outil numérique démocratise la réussite scolaire pour tous les enfants du continent.",
          ],
        },
      ],
      finalResult:
        "Excellente maîtrise des critères de notation du BEPC béninois : clarté d'expression, précision grammaticale et pertinence des arguments.",
      verification: "Conforme au barème officiel de correction DEC Bénin.",
      commonPitfalls: [
        "Confondre la voix passive au futur avec le conditionnel ou le passé composé.",
        "Rédiger un hors-sujet en parlant des dérives d'Internet au lieu de l'apport éducatif.",
      ],
    },
  },
];
