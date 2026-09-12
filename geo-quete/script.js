/* ==========================================================================
   GéoQuête - boîte à outils géométrique (coordonnées "monde", en pas)
   ========================================================================== */

function dist(p, q) { return Math.hypot(q.x - p.x, q.y - p.y); }

function mid(p, q) { return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; }

function norm(v) {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
}

function projectOnLine(p, a, b) {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (l2 === 0) return { x: a.x, y: a.y };
  const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
}

function distToLine(p, a, b) { return dist(p, projectOnLine(p, a, b)); }

function lineLine(p1, p2, p3, p4) {
  const d = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(d) < 1e-9) return null;
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
  return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
}

function circleCircle(x0, y0, r0, x1, y1, r1) {
  const d = Math.hypot(x1 - x0, y1 - y0);
  if (d > r0 + r1 || d < Math.abs(r0 - r1) || d === 0) return [];
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h2 = r0 * r0 - a * a;
  const h = Math.sqrt(Math.max(0, h2));
  const xm = x0 + (a * (x1 - x0)) / d;
  const ym = y0 + (a * (y1 - y0)) / d;
  const p = { x: xm + (h * (y1 - y0)) / d, y: ym - (h * (x1 - x0)) / d };
  const q = { x: xm - (h * (y1 - y0)) / d, y: ym + (h * (x1 - x0)) / d };
  return h < 1e-6 ? [p] : [p, q];
}

function lineCircle(a, b, cx, cy, r) {
  const foot = projectOnLine({ x: cx, y: cy }, a, b);
  const dc = dist(foot, { x: cx, y: cy });
  if (dc > r) return [];
  const u = norm({ x: b.x - a.x, y: b.y - a.y });
  const k = Math.sqrt(Math.max(0, r * r - dc * dc));
  if (k < 1e-6) return [foot];
  return [
    { x: foot.x + u.x * k, y: foot.y + u.y * k },
    { x: foot.x - u.x * k, y: foot.y - u.y * k }
  ];
}

function circumcenter(a, b, c) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null;
  const sa = a.x * a.x + a.y * a.y, sb = b.x * b.x + b.y * b.y, sc = c.x * c.x + c.y * c.y;
  return {
    x: (sa * (b.y - c.y) + sb * (c.y - a.y) + sc * (a.y - b.y)) / d,
    y: (sa * (c.x - b.x) + sb * (a.x - c.x) + sc * (b.x - a.x)) / d
  };
}
/* ==========================================================================
   GéoQuête - données des niveaux
   Toutes les coordonnées sont exprimées dans le "monde" du jeu :
   1000 x 700 pas. 1 unité = 1 pas. L'affichage s'adapte, les maths non.
   ========================================================================== */

const WORLD_W = 1000;
const WORLD_H = 700;

const LEVELS = [
  {
    id: 1,
    title: "Le Secret de l'Ancre",
    niveau: "6e",
    notion: "Report de longueurs au compas",
    competence: "Construire un point situé à deux distances données de deux points connus.",
    outils: "Compas, Pointeur",
    points: [
      { id: 'A', x: 250, y: 420, label: "L'Ancre", color: '#e63946' },
      { id: 'B', x: 650, y: 180, label: 'Le Palmier', color: '#2a9d8f' }
    ],
    lines: [],
    quest: `L'antique légende raconte :<br><br>
      « Le trésor d'Euclide repose à exactement <strong class="hl">300 pas</strong> du repère de l'Ancre (A)
      et à <strong class="hl">260 pas</strong> du repère du Palmier (B). On dit aussi qu'il a été enterré
      <strong>le plus au Nord</strong> possible. »`,
    hint: "Prends le Compas, clique sur A puis étire jusqu'à lire 300 pas. Recommence depuis B avec 260 pas. Les deux cercles se croisent en deux endroits : le Nord est en haut de la carte.",
    question: "Pourquoi obtient-on deux points possibles, et pas un seul ?",
    solve(P) {
      const inter = circleCircle(P.A.x, P.A.y, 300, P.B.x, P.B.y, 260);
      return [inter.reduce((a, b) => (a.y < b.y ? a : b))];
    }
  },

  {
    id: 2,
    title: "Le Phare Oublié",
    niveau: "6e",
    notion: "Droite perpendiculaire à une droite passant par un point",
    competence: "Construire la perpendiculaire à une droite passant par un point donné, et reconnaître un pied de perpendiculaire.",
    outils: "Règle, Équerre",
    points: [
      { id: 'A', x: 200, y: 500, label: 'Rocher', color: '#778da9' },
      { id: 'B', x: 800, y: 350, label: 'Arbre', color: '#2a9d8f' },
      { id: 'C', x: 420, y: 150, label: 'Phare', color: '#e63946' }
    ],
    lines: [],
    quest: `« Le trésor dort sous le Pont invisible. Ce pont est la droite qui passe par le Rocher (A)
      et par l'Arbre (B). Et depuis le Phare (C), le trésor se trouve exactement
      <strong class="hl">au plus court</strong> : à la perpendiculaire. »`,
    hint: "Trace d'abord la droite (AB) à la Règle. Puis prends l'Équerre : survole la droite (elle s'éclaire), puis clique sur le Phare. Le trésor est au pied de cette perpendiculaire.",
    question: "Le « plus court chemin » du Phare au Pont, c'est la distance du point à la droite. Pourquoi est-ce forcément la perpendiculaire ?",
    solve(P) {
      return [projectOnLine(P.C, P.A, P.B)];
    }
  },

  {
    id: 3,
    title: "La Voie du Navire",
    niveau: "6e",
    notion: "Mesurer et construire un angle au rapporteur",
    competence: "Construire une demi-droite formant un angle donné avec une direction de référence.",
    outils: "Rapporteur",
    points: [
      { id: 'S', x: 250, y: 600, label: 'Statue', color: '#d4af37' },
      { id: 'C', x: 250, y: 250, label: 'Chêne', color: '#2a9d8f' }
    ],
    lines: [
      { x1: 650, y1: 0, x2: 750, y2: 700, color: '#4a90d9', label: 'Rivière', lt: 0.12 }
    ],
    quest: `« Place-toi à la Statue (S). Regarde droit vers le grand Chêne (C).
      Tourne de exactement <strong class="hl">45° vers ta droite</strong>, puis marche tout droit
      jusqu'à la Rivière. Creuse là où tes pieds touchent l'eau. »`,
    hint: "Rapporteur : premier clic sur la Statue (le sommet de l'angle), deuxième clic sur le Chêne (la direction du 0°). Bouge ensuite la souris : l'angle s'affiche et se cale de 5° en 5°.",
    question: "Si l'explorateur avait tourné de 45° vers la gauche, où serait-il arrivé ?",
    solve(P, L) {
      const base = Math.atan2(P.C.y - P.S.y, P.C.x - P.S.x);
      const a = base + (45 * Math.PI) / 180;
      const far = { x: P.S.x + Math.cos(a) * 3000, y: P.S.y + Math.sin(a) * 3000 };
      return [lineLine(P.S, far, { x: L[0].x1, y: L[0].y1 }, { x: L[0].x2, y: L[0].y2 })];
    }
  },

  {
    id: 4,
    title: "Le Trésor des Jumeaux",
    niveau: "5e",
    notion: "Médiatrice d'un segment",
    competence: "Caractériser la médiatrice comme l'ensemble des points équidistants de deux points, et la construire.",
    outils: "Compas, Règle",
    points: [
      { id: 'A', x: 320, y: 560, label: 'Campement', color: '#e63946' },
      { id: 'B', x: 680, y: 500, label: 'Épave', color: '#2a9d8f' }
    ],
    lines: [
      { x1: 0, y1: 250, x2: 1000, y2: 180, color: '#cfd8dc', label: 'Muraille de Glace', lt: 0.1 }
    ],
    quest: `« Le trésor est scellé dans la Grande Muraille de Glace. Il est à
      <strong class="hl">égale distance</strong> du Campement (A) et de l'Épave (B). »`,
    hint: "Les points à égale distance de A et de B forment la médiatrice de [AB]. Deux cercles de même rayon centrés en A et en B se coupent en deux points : la droite qui les joint est cette médiatrice.",
    question: "Traduis l'énoncé en langage mathématique : quelle égalité de longueurs le trésor vérifie-t-il ?",
    solve(P, L) {
      const m = mid(P.A, P.B);
      const p2 = { x: m.x - (P.B.y - P.A.y), y: m.y + (P.B.x - P.A.x) };
      return [lineLine(m, p2, { x: L[0].x1, y: L[0].y1 }, { x: L[0].x2, y: L[0].y2 })];
    }
  },

  {
    id: 5,
    title: "La Faille de l'Île",
    niveau: "4e",
    notion: "Droite des milieux",
    competence: "Utiliser le théorème de la droite des milieux dans un triangle.",
    outils: "Milieu, Règle",
    points: [
      { id: 'V', x: 500, y: 150, label: 'Volcan', color: '#e63946' },
      { id: 'T', x: 250, y: 560, label: 'Temple', color: '#d4af37' },
      { id: 'G', x: 760, y: 520, label: 'Grotte', color: '#778da9' }
    ],
    lines: [
      { x1: 500, y1: 0, x2: 500, y2: 700, color: '#f1c40f', label: 'Méridien Zéro', lt: 0.07 },
      { x1: 500, y1: 150, x2: 250, y2: 560, color: 'rgba(255,255,255,0.5)', label: '' },
      { x1: 250, y1: 560, x2: 760, y2: 520, color: 'rgba(255,255,255,0.5)', label: '' },
      { x1: 760, y1: 520, x2: 500, y2: 150, color: 'rgba(255,255,255,0.5)', label: '' }
    ],
    quest: `Trois lieux forment un triangle : le Volcan (V), le Temple (T) et la Grotte (G).<br><br>
      « Le trésor se trouve sur la droite qui relie le milieu du chemin [VT]
      au milieu du chemin [VG], là où elle franchit le <strong class="hl">Méridien Zéro</strong>. »`,
    hint: "Place les deux milieux avec l'outil Milieu (un clic sur chaque extrémité), puis joins-les à la Règle. Cette droite est parallèle à (TG) : c'est la droite des milieux.",
    question: "Mesure [TG] puis le segment qui joint les deux milieux. Quel rapport obtiens-tu, et pourquoi ?",
    solve(P, L) {
      const m1 = mid(P.V, P.T), m2 = mid(P.V, P.G);
      return [lineLine(m1, m2, { x: L[0].x1, y: L[0].y1 }, { x: L[0].x2, y: L[0].y2 })];
    }
  },

  {
    id: 6,
    title: "Les Deux Rives",
    niveau: "5e",
    notion: "Bissectrice d'un angle",
    competence: "Construire la bissectrice d'un angle et l'interpréter comme axe de symétrie de l'angle.",
    outils: "Bissectrice, Compas",
    points: [
      { id: 'O', x: 480, y: 380, label: 'Le Fort', color: '#e63946' },
      { id: 'R', x: 900, y: 250, label: 'Rive Nord', color: '#4a90d9' },
      { id: 'S', x: 700, y: 700, label: 'Rive Sud', color: '#4a90d9' }
    ],
    lines: [
      { x1: 480, y1: 380, x2: 900, y2: 250, color: '#4a90d9', label: '' },
      { x1: 480, y1: 380, x2: 700, y2: 700, color: '#4a90d9', label: '' }
    ],
    quest: `Deux rives partent du Fort (O) : l'une vers la Rive Nord (R), l'autre vers la Rive Sud (S).<br><br>
      « Le trésor est à <strong class="hl">égale distance des deux rives</strong>,
      et à <strong class="hl">250 pas</strong> du Fort. »`,
    hint: "Outil Bissectrice : clique sur R, puis sur le sommet O, puis sur S. Trace ensuite un cercle de 250 pas centré en O : le trésor est à l'intersection.",
    question: "Un point de la bissectrice est à égale distance des deux côtés de l'angle. Quelles longueurs compare-t-on exactement ?",
    solve(P) {
      const u1 = norm({ x: P.R.x - P.O.x, y: P.R.y - P.O.y });
      const u2 = norm({ x: P.S.x - P.O.x, y: P.S.y - P.O.y });
      const d = norm({ x: u1.x + u2.x, y: u1.y + u2.y });
      return [{ x: P.O.x + d.x * 250, y: P.O.y + d.y * 250 }];
    }
  },

  {
    id: 7,
    title: "Le Moulin et la Route",
    niveau: "6e",
    notion: "Droite parallèle à une droite passant par un point",
    competence: "Construire la parallèle à une droite passant par un point donné.",
    outils: "Parallèle, Règle",
    points: [
      { id: 'M', x: 300, y: 560, label: 'Le Moulin', color: '#d4af37' }
    ],
    lines: [
      { x1: 100, y1: 200, x2: 900, y2: 320, color: '#b0865a', label: 'Route Royale', lt: 0.1 },
      { x1: 720, y1: 700, x2: 620, y2: 0, color: '#4a90d9', label: 'Canal', lt: 0.08 }
    ],
    quest: `« Depuis le Moulin (M), suis un sentier qui ne coupe <strong class="hl">jamais</strong>
      la Route Royale, quelle que soit la distance parcourue. Le trésor t'attend là où ce sentier
      rencontre le Canal. »`,
    hint: "Un sentier qui ne coupe jamais la route lui est parallèle. Outil Parallèle : survole la Route Royale, puis clique sur le Moulin.",
    question: "Deux droites parallèles n'ont aucun point commun. Pourquoi le sentier coupe-t-il quand même le Canal ?",
    solve(P, L) {
      const dir = { x: L[0].x2 - L[0].x1, y: L[0].y2 - L[0].y1 };
      const p2 = { x: P.M.x + dir.x, y: P.M.y + dir.y };
      return [lineLine(P.M, p2, { x: L[1].x1, y: L[1].y1 }, { x: L[1].x2, y: L[1].y2 })];
    }
  },

  {
    id: 8,
    title: "Le Reflet de la Falaise",
    niveau: "6e",
    notion: "Symétrie axiale",
    competence: "Construire le symétrique d'un point par rapport à une droite.",
    outils: "Équerre, Compas",
    points: [
      { id: 'P', x: 300, y: 520, label: 'La Cabane', color: '#e63946' }
    ],
    lines: [
      { x1: 150, y1: 100, x2: 850, y2: 600, color: '#9aa5b1', label: 'La Falaise', lt: 0.12 }
    ],
    quest: `« La Falaise est un miroir. Le trésor est le <strong class="hl">reflet exact</strong>
      de la Cabane (P) de l'autre côté de la Falaise. »`,
    hint: "Trace la perpendiculaire à la Falaise passant par P (Équerre). Le pied de cette perpendiculaire est le milieu entre P et son reflet : reporte la même longueur au Compas de l'autre côté.",
    question: "Note H le pied de la perpendiculaire et P' le reflet. Quelles deux propriétés caractérisent P' ?",
    solve(P, L) {
      const A = { x: L[0].x1, y: L[0].y1 }, B = { x: L[0].x2, y: L[0].y2 };
      const h = projectOnLine(P.P, A, B);
      return [{ x: 2 * h.x - P.P.x, y: 2 * h.y - P.P.y }];
    }
  },

  {
    id: 9,
    title: "Le Puits Sans Fond",
    niveau: "5e",
    notion: "Symétrie centrale",
    competence: "Construire le symétrique d'un point par rapport à un point.",
    outils: "Règle, Compas",
    points: [
      { id: 'O', x: 500, y: 350, label: 'Le Puits', color: '#f1c40f' },
      { id: 'C', x: 280, y: 540, label: 'La Chapelle', color: '#e63946' }
    ],
    lines: [],
    quest: `« Fais demi-tour autour du Puits (O). Le trésor est le point tel que le Puits soit
      exactement le <strong class="hl">milieu</strong> du chemin qui va de la Chapelle (C) au trésor. »`,
    hint: "Trace la droite (CO) à la Règle, prolonge-la au-delà du Puits, puis reporte la longueur OC au Compas depuis O. Le trésor est de l'autre côté.",
    question: "Le symétrique de C par rapport à O est aussi l'image de C par une rotation. Laquelle ?",
    solve(P) {
      return [{ x: 2 * P.O.x - P.C.x, y: 2 * P.O.y - P.C.y }];
    }
  },

  {
    id: 10,
    title: "Le Conseil des Trois",
    niveau: "5e",
    notion: "Point équidistant de trois points",
    competence: "Construire le centre du cercle circonscrit à un triangle par intersection de deux médiatrices.",
    outils: "Compas, Règle",
    points: [
      { id: 'A', x: 250, y: 250, label: 'Tour du Nord', color: '#778da9' },
      { id: 'B', x: 750, y: 230, label: 'Tour de l\'Est', color: '#2a9d8f' },
      { id: 'C', x: 480, y: 620, label: 'Tour du Sud', color: '#e63946' }
    ],
    lines: [],
    quest: `Trois tours veillent sur l'île.<br><br>
      « Le trésor est enterré à <strong class="hl">égale distance des trois tours</strong>. »`,
    hint: "Une seule médiatrice ne suffit pas : elle donne tous les points à égale distance de deux tours. Trace deux médiatrices et prends leur point d'intersection.",
    question: "Pourquoi la troisième médiatrice passe-t-elle forcément par ce même point ?",
    solve(P) {
      return [circumcenter(P.A, P.B, P.C)];
    }
  },

  {
    id: 11,
    title: "La Corde de l'Arpenteur",
    niveau: "4e",
    notion: "Théorème de Pythagore",
    competence: "Calculer une longueur dans un triangle rectangle, puis la reporter au compas.",
    outils: "Équerre, Compas",
    points: [
      { id: 'A', x: 300, y: 500, label: 'La Ruine', color: '#e63946' },
      { id: 'B', x: 700, y: 500, label: 'La Borne', color: '#2a9d8f' }
    ],
    lines: [
      { x1: 100, y1: 500, x2: 900, y2: 500, color: '#b0865a', label: 'Vieille Route', lt: 0.06 }
    ],
    quest: `La Ruine (A) et la Borne (B) sont distantes de <strong class="hl">400 pas</strong> sur la Vieille Route.<br><br>
      « Quitte la Borne <strong>perpendiculairement</strong> à la route, marche vers le Nord,
      et arrête-toi quand la Ruine sera à <strong class="hl">500 pas</strong> de toi. »`,
    hint: "Le triangle est rectangle en B. Tu connais l'hypoténuse (500 pas) et un côté (400 pas) : Pythagore te donne la distance à parcourir depuis la Borne. Trace la perpendiculaire puis reporte cette longueur.",
    question: "Calcule BT sans l'app. Que remarques-tu sur le triplet (300 ; 400 ; 500) ?",
    solve(P) {
      const bt = Math.sqrt(500 * 500 - 400 * 400);
      return [{ x: P.B.x, y: P.B.y - bt }];
    }
  },

  {
    id: 12,
    title: "L'Œil du Cyclope",
    niveau: "3e",
    notion: "Angle droit et cercle de diamètre donné",
    competence: "Utiliser le fait qu'un point voyant un segment sous un angle droit appartient au cercle de diamètre ce segment.",
    outils: "Milieu, Compas",
    points: [
      { id: 'A', x: 250, y: 400, label: 'Colonne A', color: '#e63946' },
      { id: 'B', x: 750, y: 400, label: 'Colonne B', color: '#2a9d8f' }
    ],
    lines: [
      { x1: 250, y1: 400, x2: 750, y2: 400, color: '#b0865a', label: '' }
    ],
    quest: `Les deux Colonnes A et B sont distantes de <strong class="hl">500 pas</strong>.<br><br>
      « Depuis le trésor, on voit les deux Colonnes sous un <strong class="hl">angle droit</strong>.
      Et le trésor est à <strong class="hl">250 pas</strong> de la Colonne A, au Nord de la route. »`,
    hint: "L'ensemble des points qui voient [AB] sous un angle droit est le cercle de diamètre [AB]. Place le milieu de [AB], trace ce cercle, puis croise-le avec le cercle de 250 pas centré en A.",
    question: "Vérifie ta réponse avec Pythagore : mesure TA et TB, puis compare TA² + TB² à AB².",
    solve(P) {
      const m = mid(P.A, P.B);
      const r = dist(P.A, P.B) / 2;
      const inter = circleCircle(P.A.x, P.A.y, 250, m.x, m.y, r);
      return [inter.reduce((a, b) => (a.y < b.y ? a : b))];
    }
  }
];
/* ==========================================================================
   GéoQuête - moteur
   ========================================================================== */

const TOOLS = [
  { id: 'pointer',    icon: '✛', name: 'Pointeur',    key: '1', clicks: 1 },
  { id: 'ruler',      icon: '📏', name: 'Règle',       key: '2', clicks: 2 },
  { id: 'compass',    icon: '⭕', name: 'Compas',      key: '3', clicks: 2 },
  { id: 'square',     icon: '📐', name: 'Équerre',     key: '4', clicks: 2 },
  { id: 'parallel',   icon: '⇉', name: 'Parallèle',   key: '5', clicks: 2 },
  { id: 'midpoint',   icon: '◉', name: 'Milieu',      key: '6', clicks: 2 },
  { id: 'protractor', icon: '∠', name: 'Rapporteur', key: '7', clicks: 3 },
  { id: 'bisector',   icon: '⋔', name: 'Bissectrice', key: '8', clicks: 3 }
];

const PROMPTS = {
  pointer:    ["Clique à l'endroit où tu veux creuser."],
  ruler:      ["Règle : clique sur le premier point de la droite.", "Clique sur le deuxième point."],
  compass:    ["Compas : clique sur le centre du cercle.", "Éloigne le curseur, puis clique pour fixer le rayon."],
  square:     ["Équerre : clique sur la droite de référence.", "Clique sur le point par lequel doit passer la perpendiculaire."],
  parallel:   ["Parallèle : clique sur la droite de référence.", "Clique sur le point par lequel doit passer la parallèle."],
  midpoint:   ["Milieu : clique sur la première extrémité.", "Clique sur la seconde extrémité."],
  protractor: ["Rapporteur : clique sur le sommet de l'angle.", "Clique sur le point qui donne la direction du 0°.", "Choisis l'angle, puis clique pour tracer."],
  bisector:   ["Bissectrice : clique sur un point du premier côté.", "Clique sur le sommet de l'angle.", "Clique sur un point du second côté."]
};

const TOL = 18;          // tolérance de réussite, en pas
const SNAP_PX = 13;      // rayon d'aimantation, en pixels écran
const RADIUS_STEP = 5;   // le compas se règle de 5 pas en 5 pas
const ANGLE_STEP = 5;    // le rapporteur se règle de 5° en 5°
const INK = 'rgba(126, 200, 227, 0.9)';       // couleur des tracés de l'élève
const INK_SOFT = 'rgba(126, 200, 227, 0.55)';

/* ------------------------------------------------------------------ DOM */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mapContainer = document.getElementById('map-container');
const levelSelect = document.getElementById('level-select');
const questText = document.getElementById('quest-text');
const toolGrid = document.getElementById('tool-grid');
const btnDig = document.getElementById('btn-dig');
const btnNext = document.getElementById('btn-next');
const btnUndo = document.getElementById('btn-undo');
const btnClear = document.getElementById('btn-clear');
const btnHint = document.getElementById('btn-hint');
const btnReveal = document.getElementById('btn-reveal');
const hintBox = document.getElementById('hint-box');
const feedbackMsg = document.getElementById('feedback-msg');
const statusBar = document.getElementById('status-bar');
const elNiveau = document.getElementById('lvl-niveau');
const elNotion = document.getElementById('lvl-notion');
const elCompetence = document.getElementById('lvl-competence');
const elOutils = document.getElementById('lvl-outils');

/* ------------------------------------------------------------------ État */

let level = null;
let tool = 'pointer';
let refPoints = [];      // repères de la mission
let refLines = [];       // droites déjà tracées par la mission
let userPoints = [];     // points construits par l'élève (milieux...)
let items = [];          // tracés de l'élève : cercles, droites, demi-droites
let history = [];        // pile d'annulation : 'item' | 'point'
let solutions = [];
let solved = new Set();
let done = false;
let digSite = null;
let reveal = false;

let pending = [];        // clics déjà enregistrés pour l'outil courant
let pendingLine = null;  // droite sélectionnée (équerre, parallèle)
let hoverLine = null;
let preview = null;
let mouse = { x: 0, y: 0 };   // en coordonnées monde
let hasMouse = false;

/* ------------------------------------------- Repère écran <-> repère monde */

let scale = 1, offX = 0, offY = 0;

function computeTransform() {
  const w = mapContainer.clientWidth, h = mapContainer.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pad = 18;
  scale = Math.min((w - 2 * pad) / WORLD_W, (h - 2 * pad) / WORLD_H);
  offX = (w - WORLD_W * scale) / 2;
  offY = (h - WORLD_H * scale) / 2;
}

const sx = p => offX + p.x * scale;
const sy = p => offY + p.y * scale;
const toWorld = (px, py) => ({ x: (px - offX) / scale, y: (py - offY) / scale });
const snapR = () => SNAP_PX / scale;

/* ------------------------------------------------------------- Aimantation */

function allLines() {
  return [...refLines, ...items.filter(i => i.type === 'line' || i.type === 'ray')];
}

function snapTargets() {
  const pts = [...refPoints, ...userPoints].map(p => ({ x: p.x, y: p.y, kind: 'ref' }));
  const lines = allLines();
  const circles = items.filter(i => i.type === 'circle');

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const p = lineLine(
        { x: lines[i].x1, y: lines[i].y1 }, { x: lines[i].x2, y: lines[i].y2 },
        { x: lines[j].x1, y: lines[j].y1 }, { x: lines[j].x2, y: lines[j].y2 });
      if (p) pts.push({ ...p, kind: 'inter' });
    }
  }
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      circleCircle(circles[i].x, circles[i].y, circles[i].r, circles[j].x, circles[j].y, circles[j].r)
        .forEach(p => pts.push({ ...p, kind: 'inter' }));
    }
    for (const L of lines) {
      lineCircle({ x: L.x1, y: L.y1 }, { x: L.x2, y: L.y2 }, circles[i].x, circles[i].y, circles[i].r)
        .forEach(p => pts.push({ ...p, kind: 'inter' }));
    }
  }
  return pts;
}

function snap(p) {
  let best = null, bd = snapR();
  for (const t of snapTargets()) {
    const d = dist(t, p);
    if (d < bd) { bd = d; best = t; }
  }
  return best ? { x: best.x, y: best.y, snapped: best.kind } : { x: p.x, y: p.y, snapped: null };
}

function closestLine(p) {
  let best = null, bd = 14 / scale;
  for (const L of allLines()) {
    const d = distToLine(p, { x: L.x1, y: L.y1 }, { x: L.x2, y: L.y2 });
    if (d < bd) { bd = d; best = L; }
  }
  return best;
}

/* --------------------------------------------------------- Mise en place */

function buildSelect() {
  levelSelect.innerHTML = LEVELS.map(L =>
    `<option value="${L.id}">${solved.has(L.id) ? '✓ ' : ''}Mission ${L.id} · ${L.title} (${L.niveau})</option>`
  ).join('');
  if (level) levelSelect.value = level.id;
}

function buildTools() {
  toolGrid.innerHTML = TOOLS.map(t =>
    `<button class="tool-btn${t.id === 'pointer' ? ' active' : ''}" data-tool="${t.id}" title="${t.name} (touche ${t.key})">
       <span class="icon">${t.icon}</span><span class="tool-name">${t.name}</span>
     </button>`).join('');
  toolGrid.querySelectorAll('.tool-btn').forEach(b =>
    b.addEventListener('click', () => setTool(b.dataset.tool)));
}

function setTool(id) {
  tool = id;
  toolGrid.querySelectorAll('.tool-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tool === id));
  cancelPending();
  render();
}

function cancelPending() {
  pending = [];
  pendingLine = null;
  preview = null;
  render();
}

function loadLevel(id) {
  level = LEVELS.find(L => L.id === Number(id)) || LEVELS[0];

  refPoints = level.points.map(p => ({ ...p }));
  refLines = level.lines.map(l => ({ ...l }));
  userPoints = [];
  items = [];
  history = [];
  digSite = null;
  done = false;
  reveal = false;
  btnReveal.classList.remove('on');
  btnNext.hidden = true;
  btnDig.disabled = true;
  feedbackMsg.className = 'feedback-msg';
  feedbackMsg.textContent = '';
  hintBox.hidden = true;
  btnHint.classList.remove('on');

  const P = {};
  refPoints.forEach(p => (P[p.id] = p));
  solutions = (level.solve(P, refLines) || []).filter(Boolean);

  elNiveau.textContent = level.niveau;
  elNotion.textContent = level.notion;
  elCompetence.textContent = level.competence;
  elOutils.textContent = level.outils;
  hintBox.innerHTML = level.hint;
  questText.innerHTML = level.quest +
    (level.question ? `<span class="q">À noter sur le cahier : ${level.question}</span>` : '');

  levelSelect.value = level.id;
  setTool('pointer');
}

/* ------------------------------------------------------- Clics sur la carte */

function pushItem(it) { items.push(it); history.push('item'); }
function pushPoint(p) { userPoints.push(p); history.push('point'); }

function onClick(w) {
  if (done) return;
  const p = snap(w);

  if (tool === 'pointer') {
    digSite = p;
    btnDig.disabled = false;
    feedbackMsg.className = 'feedback-msg info';
    feedbackMsg.textContent = 'Prêt à creuser.';
    return;
  }

  if (tool === 'square' || tool === 'parallel') {
    if (!pendingLine) {
      const L = closestLine(w);
      if (L) pendingLine = L;
      return;
    }
    const a = { x: pendingLine.x1, y: pendingLine.y1 };
    const b = { x: pendingLine.x2, y: pendingLine.y2 };
    const dir = tool === 'parallel'
      ? { x: b.x - a.x, y: b.y - a.y }
      : { x: -(b.y - a.y), y: b.x - a.x };
    pushItem(infinite(p, { x: p.x + dir.x, y: p.y + dir.y }));
    cancelPending();
    return;
  }

  pending.push(p);
  const need = TOOLS.find(t => t.id === tool).clicks;
  if (pending.length < need) return;

  if (tool === 'ruler') {
    if (dist(pending[0], pending[1]) > 3) pushItem(infinite(pending[0], pending[1]));
  } else if (tool === 'compass') {
    const r = snapRadius(dist(pending[0], pending[1]));
    if (r >= 10) pushItem({ type: 'circle', x: pending[0].x, y: pending[0].y, r });
  } else if (tool === 'midpoint') {
    const m = mid(pending[0], pending[1]);
    pushPoint({ id: 'M' + (userPoints.length + 1), x: m.x, y: m.y, label: 'milieu', color: '#ffb703' });
  } else if (tool === 'protractor') {
    const ray = protractorRay(pending[0], pending[1], pending[2]);
    if (ray) pushItem(ray);
  } else if (tool === 'bisector') {
    const ray = bisectorRay(pending[1], pending[0], pending[2]);
    if (ray) pushItem(ray);
  }
  cancelPending();
}

function infinite(p1, p2) {
  const d = norm({ x: p2.x - p1.x, y: p2.y - p1.y });
  const K = 4000;
  return {
    type: 'line',
    x1: p1.x - d.x * K, y1: p1.y - d.y * K,
    x2: p1.x + d.x * K, y2: p1.y + d.y * K,
    a: { ...p1 }, b: { ...p2 }
  };
}

const snapRadius = r => Math.round(r / RADIUS_STEP) * RADIUS_STEP;

function angleFrom(vertex, ref, target) {
  const base = Math.atan2(ref.y - vertex.y, ref.x - vertex.x);
  const cur = Math.atan2(target.y - vertex.y, target.x - vertex.x);
  let d = ((cur - base) * 180) / Math.PI;
  while (d <= -180) d += 360;
  while (d > 180) d -= 360;
  return { base, deg: Math.round(d / ANGLE_STEP) * ANGLE_STEP };
}

function protractorRay(vertex, ref, target) {
  if (dist(vertex, ref) < 5) return null;
  const { base, deg } = angleFrom(vertex, ref, target);
  const a = base + (deg * Math.PI) / 180;
  return {
    type: 'ray', x1: vertex.x, y1: vertex.y,
    x2: vertex.x + Math.cos(a) * 4000, y2: vertex.y + Math.sin(a) * 4000,
    tag: `${Math.abs(deg)}°`, at: { ...vertex }
  };
}

function bisectorRay(vertex, p1, p2) {
  if (dist(vertex, p1) < 5 || dist(vertex, p2) < 5) return null;
  const u1 = norm({ x: p1.x - vertex.x, y: p1.y - vertex.y });
  const u2 = norm({ x: p2.x - vertex.x, y: p2.y - vertex.y });
  const s = { x: u1.x + u2.x, y: u1.y + u2.y };
  if (Math.hypot(s.x, s.y) < 1e-6) return null;
  const d = norm(s);
  return {
    type: 'ray', x1: vertex.x, y1: vertex.y,
    x2: vertex.x + d.x * 4000, y2: vertex.y + d.y * 4000,
    tag: 'bissectrice', at: { ...vertex }
  };
}

/* ------------------------------------------------------------- Aperçu live */

function updatePreview() {
  preview = null;
  const w = mouse;

  if (tool === 'square' || tool === 'parallel') {
    hoverLine = pendingLine || closestLine(w);
    if (pendingLine) {
      const a = { x: pendingLine.x1, y: pendingLine.y1 };
      const b = { x: pendingLine.x2, y: pendingLine.y2 };
      const p = snap(w);
      const dir = tool === 'parallel'
        ? { x: b.x - a.x, y: b.y - a.y }
        : { x: -(b.y - a.y), y: b.x - a.x };
      preview = infinite(p, { x: p.x + dir.x, y: p.y + dir.y });
    }
    return;
  }
  hoverLine = null;

  if (!pending.length) return;
  const p = snap(w);

  if (tool === 'ruler') preview = infinite(pending[0], p);
  else if (tool === 'compass') {
    preview = { type: 'circle', x: pending[0].x, y: pending[0].y, r: snapRadius(dist(pending[0], p)), live: true };
  } else if (tool === 'midpoint') preview = { type: 'seg', a: pending[0], b: p, showMid: true };
  else if (tool === 'protractor') {
    if (pending.length === 1) preview = { type: 'seg', a: pending[0], b: p };
    else preview = protractorRay(pending[0], pending[1], p);
  } else if (tool === 'bisector') {
    if (pending.length === 1) preview = { type: 'seg', a: pending[0], b: p };
    else preview = { type: 'seg', a: pending[1], b: p };
  }
}

/* ------------------------------------------------------------------ Creuser */

btnDig.addEventListener('click', () => {
  if (!digSite || done) return;
  let best = Infinity;
  solutions.forEach(s => (best = Math.min(best, dist(digSite, s))));

  if (best < TOL) {
    done = true;
    solved.add(level.id);
    buildSelect();
    feedbackMsg.className = 'feedback-msg success';
    feedbackMsg.textContent = 'Le coffre est là ! Mission accomplie.';
    btnDig.disabled = true;
    btnNext.hidden = !LEVELS.some(L => L.id === level.id + 1);
  } else if (best < 3 * TOL) {
    feedbackMsg.className = 'feedback-msg near';
    feedbackMsg.textContent = "Tout près, mais pas exact. Aimante ton point sur une intersection de tracés.";
    digSite = null;
    btnDig.disabled = true;
  } else {
    feedbackMsg.className = 'feedback-msg error';
    feedbackMsg.textContent = "Rien ici. Relis l'énoncé et vérifie tes constructions.";
    digSite = null;
    btnDig.disabled = true;
  }
  render();
});

btnNext.addEventListener('click', () => loadLevel(level.id + 1));
levelSelect.addEventListener('change', e => loadLevel(e.target.value));

btnUndo.addEventListener('click', undo);
function undo() {
  if (done) return;
  const last = history.pop();
  if (last === 'item') items.pop();
  else if (last === 'point') userPoints.pop();
  cancelPending();
}

btnClear.addEventListener('click', () => {
  if (done) return;
  items = []; userPoints = []; history = []; digSite = null;
  btnDig.disabled = true;
  feedbackMsg.className = 'feedback-msg';
  feedbackMsg.textContent = '';
  cancelPending();
});

btnHint.addEventListener('click', () => {
  hintBox.hidden = !hintBox.hidden;
  btnHint.classList.toggle('on', !hintBox.hidden);
});

btnReveal.addEventListener('click', () => {
  reveal = !reveal;
  btnReveal.classList.toggle('on', reveal);
  render();
});

/* -------------------------------------------------------------- Événements */

canvas.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  mouse = toWorld(e.clientX - r.left, e.clientY - r.top);
  hasMouse = true;
  updatePreview();
  render();
});
canvas.addEventListener('pointerleave', () => { hasMouse = false; render(); });
canvas.addEventListener('pointerdown', e => {
  const r = canvas.getBoundingClientRect();
  mouse = toWorld(e.clientX - r.left, e.clientY - r.top);
  hasMouse = true;
  if (e.button === 2) { cancelPending(); return; }
  onClick(mouse);
  updatePreview();
  render();
});
canvas.addEventListener('contextmenu', e => { e.preventDefault(); cancelPending(); });

window.addEventListener('keydown', e => {
  if (e.target.tagName === 'SELECT') return;
  const t = TOOLS.find(t => t.key === e.key);
  if (t) { setTool(t.id); return; }
  const k = e.key.toLowerCase();
  if (k === 'a') undo();
  else if (k === 'e') btnClear.click();
  else if (k === 'escape') cancelPending();
  else if (k === 'enter') { if (!btnNext.hidden) btnNext.click(); else if (!btnDig.disabled) btnDig.click(); }
});

window.addEventListener('resize', () => { computeTransform(); render(); });

/* -------------------------------------------------------------- Rendu */

function line(a, b, color, w, dash) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dash || []);
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.moveTo(sx(a), sy(a));
  ctx.lineTo(sx(b), sy(b));
  ctx.stroke();
  ctx.restore();
}

function circle(c, r, color, w, dash) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dash || []);
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.arc(sx(c), sy(c), r * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function text(str, p, color, font, dx, dy) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(str, sx(p) + (dx || 0), sy(p) + (dy || 0));
}

function drawGrid() {
  const o = { x: 0, y: 0 }, e = { x: WORLD_W, y: WORLD_H };
  ctx.save();
  ctx.beginPath();
  ctx.rect(sx(o), sy(o), WORLD_W * scale, WORLD_H * scale);
  ctx.clip();

  for (let x = 0; x <= WORLD_W; x += 50) {
    line({ x, y: 0 }, { x, y: WORLD_H }, x % 100 ? 'rgba(212,175,55,0.055)' : 'rgba(212,175,55,0.11)', 1);
  }
  for (let y = 0; y <= WORLD_H; y += 50) {
    line({ x: 0, y }, { x: WORLD_W, y }, y % 100 ? 'rgba(212,175,55,0.055)' : 'rgba(212,175,55,0.11)', 1);
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(212,175,55,0.35)';
  ctx.lineWidth = 1.5;
  ctx.rect(sx(o), sy(o), WORLD_W * scale, WORLD_H * scale);
  ctx.stroke();
  ctx.restore();

  // échelle : 100 pas
  const y0 = WORLD_H - 20, x0 = WORLD_W - 145, c = 'rgba(230,232,230,0.55)';
  line({ x: x0, y: y0 }, { x: x0 + 100, y: y0 }, c, 2);
  line({ x: x0, y: y0 - 5 }, { x: x0, y: y0 + 5 }, c, 2);
  line({ x: x0 + 100, y: y0 - 5 }, { x: x0 + 100, y: y0 + 5 }, c, 2);
  text('100 pas', { x: x0 + 26, y: y0 - 9 }, c, '11px sans-serif');
}

function clipWorld() {
  ctx.beginPath();
  ctx.rect(sx({ x: 0, y: 0 }), sy({ x: 0, y: 0 }), WORLD_W * scale, WORLD_H * scale);
  ctx.clip();
}

function render() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);

  drawGrid();

  ctx.save();
  clipWorld();

  // droites de la mission
  refLines.forEach(L => {
    line({ x: L.x1, y: L.y1 }, { x: L.x2, y: L.y2 }, L.color || '#fff', 3);
    if (L.label) {
      const t = L.lt === undefined ? 0.5 : L.lt;
      const at = { x: L.x1 + (L.x2 - L.x1) * t, y: L.y1 + (L.y2 - L.y1) * t };
      text(L.label, at, L.color || '#fff', 'bold 13px sans-serif', 9, -7);
    }
  });

  // droite survolée / sélectionnée (équerre, parallèle)
  const hl = pendingLine || hoverLine;
  if (hl && (tool === 'square' || tool === 'parallel')) {
    line({ x: hl.x1, y: hl.y1 }, { x: hl.x2, y: hl.y2 },
      pendingLine ? 'rgba(247,215,116,0.75)' : 'rgba(255,255,255,0.3)', 6);
  }

  // tracés de l'élève
  items.forEach(it => {
    if (it.type === 'circle') {
      circle(it, it.r, INK, 1.6);
      text(`${it.r} pas`, { x: it.x, y: it.y - it.r }, INK, '11px sans-serif', 6, -5);
    } else {
      line({ x: it.x1, y: it.y1 }, { x: it.x2, y: it.y2 }, INK, 1.6);
      if (it.tag) text(it.tag, it.at, INK, 'bold 12px sans-serif', 10, 16);
    }
  });

  // aperçu
  if (preview) {
    const c = 'rgba(255,255,255,0.85)';
    if (preview.type === 'circle') {
      circle(preview, preview.r, c, 1.5, [6, 5]);
      line(preview, mouse, c, 1, [3, 4]);
      text(`${preview.r} pas`, mouse, '#fff', 'bold 12px sans-serif', 12, -12);
    } else if (preview.type === 'seg') {
      line(preview.a, preview.b, c, 1.5, [6, 5]);
      if (preview.showMid) {
        const m = mid(preview.a, preview.b);
        ctx.beginPath();
        ctx.arc(sx(m), sy(m), 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,183,3,0.8)';
        ctx.fill();
        text(`${Math.round(dist(preview.a, preview.b))} pas`, m, '#fff', '11px sans-serif', 8, -8);
      }
    } else {
      line({ x: preview.x1, y: preview.y1 }, { x: preview.x2, y: preview.y2 }, c, 1.5, [6, 5]);
      if (preview.tag) text(preview.tag, mouse, '#fff', 'bold 13px sans-serif', 12, -12);
    }
  }

  // points construits par l'élève
  userPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(sx(p), sy(p), 4.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    text(p.id, p, '#ffb703', 'bold 12px sans-serif', 8, -7);
  });

  // repères de la mission
  refPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(sx(p), sy(p), 6, 0, Math.PI * 2);
    ctx.fillStyle = p.color || '#fff';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    text(p.id, p, '#fff', 'bold 14px sans-serif', 11, -10);
    text(p.label, p, 'rgba(255,255,255,0.78)', '12px sans-serif', 11, 6);
  });

  // zone de la solution (mode prof)
  if (reveal) {
    solutions.forEach(s => {
      circle(s, TOL, 'rgba(255,183,3,0.9)', 2, [5, 4]);
      text('solution', s, 'rgba(255,183,3,0.9)', 'bold 11px sans-serif', 22, 4);
    });
  }

  // croix de fouille
  if (digSite) {
    const a = 9;
    ctx.save();
    ctx.strokeStyle = done ? '#4ecdc4' : '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx(digSite) - a, sy(digSite) - a);
    ctx.lineTo(sx(digSite) + a, sy(digSite) + a);
    ctx.moveTo(sx(digSite) + a, sy(digSite) - a);
    ctx.lineTo(sx(digSite) - a, sy(digSite) + a);
    ctx.stroke();
    ctx.restore();
  }

  // trésor
  if (done && solutions[0]) {
    const s = solutions[0];
    ctx.save();
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#f7d774';
    ctx.beginPath();
    ctx.arc(sx(s), sy(s), 11, 0, Math.PI * 2);
    ctx.fillStyle = '#f1c40f';
    ctx.fill();
    ctx.restore();
    circle(s, 22 / scale, '#d4af37', 2.5);
  }

  // curseur aimanté
  if (hasMouse && !done) {
    const p = snap(mouse);
    ctx.beginPath();
    ctx.arc(sx(p), sy(p), p.snapped ? 7 : 3, 0, Math.PI * 2);
    ctx.strokeStyle = p.snapped ? '#4ecdc4' : 'rgba(212,175,55,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
  updateStatus();
}

function updateStatus() {
  if (done) {
    statusBar.innerHTML = `<strong>Mission ${level.id} réussie.</strong> ${solved.size} / ${LEVELS.length} trésors trouvés.`;
    return;
  }
  const steps = PROMPTS[tool] || [''];
  let idx = pending.length;
  if (tool === 'square' || tool === 'parallel') idx = pendingLine ? 1 : 0;
  const msg = steps[Math.min(idx, steps.length - 1)];
  const pos = hasMouse ? ` &nbsp;·&nbsp; ${Math.round(mouse.x)} ; ${Math.round(mouse.y)} pas` : '';
  statusBar.innerHTML = `<strong>${msg}</strong>${pos}`;
}

/* ------------------------------------------------------------------ Départ */

buildTools();
buildSelect();
computeTransform();
loadLevel(1);
render();
