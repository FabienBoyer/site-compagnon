const DATA = {
calculs_algebre: {
        name: "Calculs & Algèbre",
        icon: "➕",
        subtopics: [
            { id: 'fractions', name: "Fractions, Puissances, Racines & Ordre", questions: [
                { q: "Calculer l'expression suivante : \\(\\dfrac{1}{2} + \\dfrac{1}{4}\\).", ans: "0.75", type: "input", expl: "\\(\\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4} = 0{,}75\\)" },
                { q: "Calculer l'expression suivante : \\(10^3 \\times 10^{-2}\\).", ans: "10", type: "input", expl: "\\(10^{3+(-2)} = 10^1 = 10\\)" },
                { q: "Calculer l'expression suivante : \\(\\dfrac{5}{3} \\times \\dfrac{3}{5}\\).", ans: "1", type: "input", expl: "Les fractions sont inverses l'une de l'autre : le produit vaut 1." },
                { q: "Calculer l'expression suivante : \\(2^3 \\times 2^{-1}\\).", ans: "4", type: "input", expl: "\\(2^2 = 4\\)." },
                { q: "Calculer l'expression suivante : \\(10^5 / 10^2\\).", ans: "1000", type: "input", expl: "\\(10^3 = 1000\\)." },
                { q: "Quel est l'inverse de \\(0.2\\) ?", ans: "5", type: "input", expl: "\\(1/0.2 = 5\\)." },
                { q: "Calculer l'expression suivante : \\(2/3 - 1/6\\).", ans: "0.5", type: "input", expl: "\\(4/6 - 1/6 = 3/6 = 0.5\\)." },
                { q: "Simplifier l'expression suivante : \\((10^2)^2\\).", ans: "10^4", type: "input", expl: "\\(10^{2 \\times 2} = 10^4\\)." },
                { q: "Calculer l'expression suivante : \\(1 - 1/3\\).", ans: "2/3", type: "input", expl: "\\(3/3 - 1/3 = 2/3\\)." },
                { q: "Donner l'écriture décimale du nombre \\(4 \\times 10^{-1}\\).", ans: "0.4", type: "input", expl: "On décale la virgule d'un rang." },
                { q: "Calculer l'expression suivante : \\(\\dfrac{3}{4} \\times 8\\).", ans: "6", type: "input", expl: "\\(\\frac{3 \\times 8}{4} = \\frac{24}{4} = 6\\)." },
                { q: "Quel est l'inverse de 4/5 ?", ans: "1.25", type: "input", expl: "\\(5/4 = 1.25\\)." },
                { q: "Calculer l'expression suivante : \\(10^{-2}\\).", ans: "0.01", type: "input", expl: "\\(1/100 = 0.01\\)." },
                { q: "Calculer l'expression suivante : \\(0.5^2\\).", ans: "0.25", type: "input", expl: "\\(0.5 \\times 0.5 = 0.25\\)." },
                { q: "Calculer l'expression suivante : \\(\\dfrac{1}{3} + \\dfrac{1}{3} + \\dfrac{1}{3}\\).", ans: "1", type: "input", expl: "\\(\\frac{3}{3} = 1\\). Somme de trois tiers." },
                { q: "Calculer l'expression suivante : \\(100 \\times 0{,}01\\).", ans: "1", type: "input", expl: "\\(0{,}01 = \\frac{1}{100}\\), donc \\(100 \\times \\frac{1}{100} = 1\\)." },
                { q: "Donner l'écriture scientifique du nombre 0.0005.", ans: "5*10^(-4)", type: "input", expl: "4 rangs après la virgule." },
                { q: "Donner l'écriture scientifique du nombre 1230.", ans: "1.23*10^3", type: "input", expl: "3 rangs avant la virgule." },
                { q: "Calculer l'expression suivante : \\(2^4\\).", ans: "16", type: "input", expl: "\\(2 \\times 2 \\times 2 \\times 2 = 16\\)." },
                { q: "Calculer l'expression suivante : \\(3^0\\).", ans: "1", type: "input", expl: "Tout nombre non nul à la puissance 0 vaut 1." },
                { q: "Calculer la moitié de \\(10^2\\).", ans: "50", type: "input", expl: "\\(100 / 2 = 50\\)." },
                { q: "Quel est le triple de \\(1/3\\) ?", ans: "1", type: "input", expl: "\\(3 \\times 1/3 = 1\\)." },
                { q: "Calculer l'expression suivante : \\(0.1^3\\).", ans: "0.001", type: "input", expl: "\\(10^{-3} = 0.001\\)." },
                { q: "Combien de dizaines y a-t-il dans 450 ?", ans: "45", type: "input", expl: "\\(450 / 10 = 45\\)." },
                { q: "Calculer l'expression suivante : \\(7/2 - 1.5\\).", ans: "2", type: "input", expl: "\\(3.5 - 1.5 = 2\\)." },
                { q: "Calculer l'expression suivante : \\(\\sqrt{25}\\).", ans: "5", type: "input", expl: "\\(5 \\times 5 = 25\\)." },
                { q: "Simplifier l'écriture de \\(\\sqrt{50}\\).", ans: "5*sqrt(2)", type: "input", expl: "\\(\\sqrt{25 \\times 2} = 5\\sqrt{2}\\)." },
                { q: "Calculer l'expression suivante : \\(\\sqrt{9} + \\sqrt{16}\\).", ans: "7", type: "input", expl: "\\(3 + 4 = 7\\)." },
                { q: "Calculer l'expression suivante : \\(\\sqrt{9 + 16}\\).", ans: "5", type: "input", expl: "\\(\\sqrt{25} = 5\\)." },
                { q: "Calculer l'expression suivante : \\((\\sqrt{3})^2\\).", ans: "3", type: "input", expl: "Le carré annule la racine pour un nombre positif." },
                { q: "Calculer l'expression suivante : \\(\\dfrac{\\sqrt{12}}{\\sqrt{3}}\\).", ans: "2", type: "input", expl: "\\(\\sqrt{12/3} = \\sqrt{4} = 2\\)." },
                { 
                    id: "dyn_priorites_1", 
                    type: "input", 
                    generate: function() {
                        let a = Math.floor(Math.random() * 10) + 1;
                        let b = Math.floor(Math.random() * 10) + 1;
                        let c = Math.floor(Math.random() * 5) + 2;
                        let rep = a - b * c;
                        return {
                            q: "Calculer l'expression suivante : \\(" + a + " - " + b + " \\times " + c + "\\).",
                            ans: rep.toString(),
                            expl: "La multiplication est prioritaire : \\(" + a + " - " + (b*c) + " = " + rep + "\\)."
                        };
                    },
                },
                { 
                    id: "dyn_priorites_2", 
                    type: "input", 
                    generate: function() {
                        let a = Math.floor(Math.random() * 10) + 1;
                        let b = Math.floor(Math.random() * 10) + 1;
                        let c = Math.floor(Math.random() * 5) + 2;
                        let rep = (a - b) * c;
                        return {
                            q: "Calculer l'expression suivante : \\((" + a + " - " + b + ") \\times " + c + "\\).",
                            ans: rep.toString(),
                            expl: "Les parenthèses sont prioritaires : \\(" + (a-b) + " \\times " + c + " = " + rep + "\\)."
                        };
                    },
                },
                { q: "Calculer l'expression suivante : \\(10 - 2^3\\).", ans: "2", type: "input", expl: "La puissance est prioritaire : \\(10 - 8 = 2\\)." },
                { q: "Calculer l'expression suivante : \\(5 + 5 \\times 2\\).", ans: "15", type: "input", expl: "La multiplication est prioritaire : \\(5 + 10 = 15\\)." },
                { q: "Calculer l'expression suivante : \\(-3^2\\).", ans: "-9", type: "input", expl: "Le carré ne s'applique qu'au 3, pas au signe moins." },
                { q: "Calculer l'expression suivante : \\((-3)^2\\).", ans: "9", type: "input", expl: "Le carré s'applique à l'ensemble \\((-3)\\) : \\((-3) \\times (-3) = 9\\)." },
                { q: "Écrire \\(3/4\\) sous forme de pourcentage.", ans: "75", type: "input", expl: "\\(3/4 = 0.75 = 75\\%\\)." },
                { q: "Si \\(A - B = -5\\), alors quel est le plus grand nombre ?", ans: "B", type: "mcq", opts: ["A", "B", "Égaux"], expl: "\\(A - B < 0 \\implies A < B\\)." },
                { q: "Si \\(x/y = 0.8\\) (avec \\(x, y > 0\\)), comparer \\(x\\) et \\(y\\).", ans: "x < y", type: "mcq", opts: ["x < y", "x > y", "x = y"], expl: "Le quotient est inférieur à 1." }
            ]},
            { id: 'unites_ordres', name: "Unités & Ordres de grandeur", questions: [
                { q: "Convertir \\(1,5\\) heure en minutes.", ans: "90", type: "input", expl: "\\(1,5 \\times 60 = 90\\)." },
                { q: "Convertir \\(3\\text{ m}^2\\) en \\(\\text{cm}^2\\).", ans: "30000", type: "input", expl: "\\(1\\text{ m}^2 = 10\\,000\\text{ cm}^2\\)." },
                { q: "Convertir \\(72\\text{ km/h}\\) en \\(\\text{m/s}\\).", ans: "20", type: "input", expl: "\\(72 \\div 3.6 = 20\\)." },
                { q: "Convertir \\(2,5\\text{ L}\\) en \\(\\text{cm}^3\\).", ans: "2500", type: "input", expl: "\\(1\\text{ L} = 1\\text{ dm}^3 = 1000\\text{ cm}^3\\)." },
                { q: "Quel est l'ordre de grandeur de \\(19 \\times 52\\) ?", ans: "1000", type: "mcq", opts: ["100", "1000", "10000", "10"], expl: "\\(20 \\times 50 = 1000\\)." },
                { q: "Est-il possible qu'une distance soit égale à \\(-5\\text{ m}\\) ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "Une distance est toujours positive." },
                { q: "Ordre de grandeur de \\(995 + 1005 + 1002\\) ?", ans: "3000", type: "mcq", opts: ["300", "3000", "30000"], expl: "\\(1000 \\times 3 = 3000\\)." },
                { q: "Convertir \\(1\\text{ m}^3\\) en litres.", ans: "1000", type: "input", expl: "\\(1\\text{ m}^3 = 1000\\text{ dm}^3 = 1000\\text{ L}\\)." }
            ]},

            { id: 'literal', name: "Calcul Littéral", questions: [
                { q: "Réduire l'expression suivante : \\(3x - (2-x)\\).", ans: "4x-2", type: "input", expl: "Le signe moins change les signes dans la parenthèse." },
                { q: "Factoriser l'expression suivante : \\(2x^2 + 4x\\).", ans: "2x(x+2)", type: "input", expl: "Facteur commun \\(2x\\)." },
                { q: "Isoler la variable \\(h\\) dans l'équation \\(V = Bh\\).", ans: "V/B", type: "input", expl: "On divise par B." },
                { q: "Si \\(2x+3 = 11\\), alors \\(x=\\)", ans: "4", type: "input", expl: "\\(2x=8 \\implies x=4\\)." },
                { q: "Développer l'expression suivante : \\(-2(x-5)\\).", ans: "-2x+10", type: "input", expl: "Distributivité simple." },
                { q: "Réduire l'expression suivante : \\(x^2 + 3x - x^2 + 1\\).", ans: "3x+1", type: "input", expl: "Les \\(x^2\\) s'annulent." },
                { q: "Factoriser l'expression suivante : \\(x^2-6x+9\\).", ans: "(x-3)^2", type: "input", expl: "Carré parfait." },
                { q: "Résoudre l'équation suivante : \\(3x=0\\).", ans: "0", type: "input", expl: "Seul 0 multiplié par 3 donne 0." },
                { q: "Développer l'expression suivante : \\(x(x+1)\\).", ans: "x^2+x", type: "input", expl: "Distributivité simple." },
                { q: "Réduire l'expression suivante : \\(5a - 2a\\).", ans: "3a", type: "input", expl: "Soustraction de termes semblables." },
                { q: "Factoriser l'expression suivante : \\(x^2+x\\).", ans: "x(x+1)", type: "input", expl: "Facteur commun x." },
                { q: "Isoler la variable \\(x\\) dans l'équation \\(y=ax\\).", ans: "y/a", type: "input", expl: "On divise par a." },
                { q: "Développer l'expression suivante : \\((x-1)^2\\).", ans: "x^2-2x+1", type: "input", expl: "\\((a-b)^2 = a^2-2ab+b^2\\)." },
                { q: "Réduire l'expression suivante : \\(x^2+x+x^2\\).", ans: "2x^2+x", type: "input", expl: "Regroupement des carrés." },
                { q: "Calculer la valeur de \\(2x-5\\) pour \\(x=3\\).", ans: "1", type: "input", expl: "\\(2(3)-5 = 1\\)." },
                { q: "Factoriser l'expression suivante : \\(3x-3\\).", ans: "3(x-1)", type: "input", expl: "Facteur commun 3." },
                { q: "Si \\(x/2 = 5\\), alors \\(x=\\)", ans: "10", type: "input", expl: "On multiplie par 2." },
                { q: "Développer l'expression suivante : \\((x+5)(x-5)\\).", ans: "x^2-25", type: "input", expl: "Différence de deux carrés." },
                { q: "Réduire l'expression suivante : \\(-(x+1)\\).", ans: "-x-1", type: "input", expl: "Le signe moins se distribue." },
                { q: "Factoriser l'expression suivante : \\(4x^2-1\\).", ans: "(2x-1)(2x+1)", type: "input", expl: "\\((2x)^2 - 1^2\\)." },
                { q: "Résoudre l'équation suivante : \\(x^2=25\\) (solution positive).", ans: "5", type: "input", expl: "\\(\\sqrt{25}=5\\)." },
                { q: "Isoler la variable \\(r\\) dans l'équation \\(L=2\\pi r\\).", ans: "L/(2*pi)", type: "input", expl: "On divise par \\(2\\pi\\)." },
                { q: "Calculer la valeur de \\(x^2+2x+1\\) pour \\(x=-1\\).", ans: "0", type: "input", expl: "\\((-1+1)^2 = 0\\)." },
                { q: "Développer l'expression suivante : \\(2(x+3)(x-3)\\).", ans: "2x^2-18", type: "input", expl: "\\(2(x^2-9)\\)." },
                {
                    id: "dyn_eq_1",
                    type: "input",
                    generate: function() {
                        let a = Math.floor(Math.random()*5)+2; // 2 to 6
                        let c = Math.floor(Math.random()*4)+1; // 1 to 4
                        let b = Math.floor(Math.random()*10)+1;
                        let x = Math.floor(Math.random()*6)+2; // solution entière
                        let d = (a - c)*x - b; // ax+b = cx+d => ax-cx = d-b => x(a-c) = d-b
                        return {
                            q: "Résoudre l'équation : \\(" + a + "x + " + b + " = " + c + "x + " + (d+b) + "\\).",
                            ans: x.toString(),
                            expl: "On regroupe les x : \\(" + (a-c) + "x = " + d + "\\), donc \\(x=" + x + "\\)."
                        };
                    },
                },
                { q: "Réduire l'expression suivante : \\(x/2 + x/3\\).", ans: "5x/6", type: "input", expl: "\\(3x/6 + 2x/6 = 5x/6\\)." },
                { q: "Factoriser l'expression suivante : \\(x^2+10x+25\\).", ans: "(x+5)^2", type: "input", expl: "Carré parfait." },
                { q: "Développer l'expression suivante : \\((3x-2)^2\\).", ans: "9x^2-12x+4", type: "input", expl: "\\((a-b)^2\\)." },
                { q: "Résoudre l'équation suivante : \\(x/3 = -1\\).", ans: "-3", type: "input", expl: "On multiplie par 3." },
                { q: "Isoler la variable \\(a\\) dans l'équation \\(F=ma\\).", ans: "F/m", type: "input", expl: "On divise par m." },
                { q: "Réduire l'expression suivante : \\(2x^2 - (x^2-1)\\).", ans: "x^2+1", type: "input", expl: "Changement de signes." },
                { q: "Factoriser l'expression suivante : \\(9x^2-16\\).", ans: "(3x-4)(3x+4)", type: "input", expl: "Identité \\(a^2-b^2\\)." },
                { q: "Si \\(5x+2=2\\), alors \\(x=\\)", ans: "0", type: "input", expl: "\\(5x=0\\)." },
                { q: "Développer l'expression suivante : \\(x^2(x-1)\\).", ans: "x^3-x^2", type: "input", expl: "Distributivité." },
                { q: "Isoler la variable \\(b\\) dans l'équation \\(y=ax+b\\).", ans: "y-ax", type: "input", expl: "On soustrait ax." },
                { q: "Factoriser l'expression suivante : \\(x^2-2x+1\\).", ans: "(x-1)^2", type: "input", expl: "Carré parfait." },
                { q: "Réduire l'expression suivante : \\(3ab - ab\\).", ans: "2ab", type: "input", expl: "Soustraction de termes." },
                { q: "Calculer la valeur de \\(x^3\\) pour \\(x=-2\\).", ans: "-8", type: "input", expl: "\\((-2)^3 = -8\\)." },
                { q: "Si \\(2(x+1)=6\\), alors \\(x=\\)", ans: "2", type: "input", expl: "\\(x+1=3 \\implies x=2\\)." },
                { q: "Développer l'expression suivante : \\((x+1)(x+2)\\).", ans: "x^2+3x+2", type: "input", expl: "Double distributivité." },
                { q: "Factoriser l'expression suivante : \\(x^2+2x\\).", ans: "x(x+2)", type: "input", expl: "Facteur commun x." }
            ]}
        ]
    },
proportions: {
        name: "Proportions & Évolutions",
        icon: "📊",
        subtopics: [
            { id: 'taux', name: "Proportions & CM", questions: [
                { q: "Calculer l'expression suivante : 20% de 80.", ans: "16", type: "input", expl: "\\(0.2 \\times 80 = 16\\)." },
                { q: "Calculer l'expression suivante : 5% de 200.", ans: "10", type: "input", expl: "\\(200 / 20 = 10\\)." },
                { q: "Un coefficient multiplicateur de 2 correspond à une augmentation de quel pourcentage ?", ans: "100%", type: "input", expl: "\\(2-1 = 1 = 100/100\\)." },
                { q: "Par quel nombre doit-on multiplier pour augmenter une valeur de 25% ?", ans: "1.25", type: "input", expl: "\\(1+25/100 = 1.25\\)." },
                { q: "Par quel nombre doit-on multiplier pour diminuer une valeur de 40% ?", ans: "0.6", type: "input", expl: "\\(1-0.4 = 0.6\\)." },
                { q: "Multiplier une valeur par 1.05 correspond à une augmentation de quel pourcentage ?", ans: "5%", type: "input", expl: "\\(1.05-1 = 0.05 = 5/100\\)." },
                { q: "Multiplier une valeur par 0.9 correspond à une baisse de quel pourcentage ?", ans: "10%", type: "input", expl: "\\(1-0.9 = 0.1 = 10/100\\)." },
                {
                    id: "dyn_pourcentage_part",
                    type: "input",
                    generate: function() {
                        let p = [10, 20, 25, 30, 40, 50, 75][Math.floor(Math.random()*7)];
                        let total = Math.floor(Math.random()*15 + 2) * 10;
                        let res = (p * total) / 100;
                        return {
                            q: "Calculer " + p + "% de " + total + ".",
                            ans: res.toString(),
                            expl: "\\(" + (p/100) + " \\times " + total + " = " + res + "\\)."
                        };
                    },
                },
                { q: "Un coefficient multiplicateur de 0.5 correspond à une baisse de quel pourcentage ?", ans: "50%", type: "input", expl: "\\(1-0.5 = 0.5 = 50/100\\)." },
                { q: "Calculer l'expression suivante : 50% de 12.4.", ans: "6.2", type: "input", expl: "On prend la moitié." },
                { q: "Un article coûte 100€ et subit une baisse de 15%. Quel est son nouveau prix ?", ans: "85", type: "input", expl: "\\(100 - 15 = 85\\)." },
                { q: "Par quel nombre doit-on multiplier pour augmenter une valeur de 100% ?", ans: "2", type: "input", expl: "\\(1+1=2\\)." },
                { q: "Calculer l'expression suivante : 10% de 3500.", ans: "350", type: "input", expl: "\\(3500/10 = 350\\)." },
                { q: "Multiplier une valeur par 1.15 correspond à une augmentation de quel pourcentage ?", ans: "15%", type: "input", expl: "\\(1.15-1 = 0.15\\)." },
                { q: "Multiplier une valeur par 0.85 correspond à une baisse de quel pourcentage ?", ans: "15%", type: "input", expl: "\\(1-0.85 = 0.15\\)." },
                { q: "Un coefficient multiplicateur de 1.01 correspond à une augmentation de quel pourcentage ?", ans: "1%", type: "input", expl: "\\(0.01 = 1%\\)." },
                { q: "Une quantité passe de 40 à 50. Quel est le taux d'évolution en pourcentage ?", ans: "25%", type: "input", expl: "\\((50-40)/40 = 0.25 = 25\\%\\)." },
                { q: "20% d'une somme représente 8€. Quel est le total ?", ans: "40", type: "input", expl: "\\(8 / 0.20 = 40\\)." },
                { q: "Exprimer la proportion 0,45 sous forme de pourcentage.", ans: "45%", type: "input", expl: "\\(0.45 = 45/100 = 45\\%\\)." },
                { q: "Un article à 50€ passe à 45€. Quel est le taux de réduction en pourcentage ?", ans: "10%", type: "input", expl: "\\((50-45)/50 = 0.1 = 10\\%\\)." }
            ]},
            { id: 'evol', name: "Évolutions Successives", questions: [
                { q: "Hausse de 10% suivie d'une hausse de 10% : CM global ?", ans: "1.21", type: "input", expl: "\\(1.1 \\times 1.1 = 1.21\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une baisse de 50% suivie d'une hausse de 50% ?", ans: "0.75", type: "input", expl: "\\(0.5 \\times 1.5 = 0.75\\)." },
                { q: "Évolution réciproque d'une hausse de 25% ?", ans: "-20%", type: "input", expl: "\\(1/1.25 = 0.8 \\implies -20%\\)." },
                { q: "Doubler un prix c'est l'augmenter de :", ans: "100%", type: "input", expl: "\\(CM=2 \\implies +100%\\)." },
                { q: "Diviser un prix par 2 c'est le baisser de :", ans: "50%", type: "input", expl: "\\(CM=0.5 \\implies -50%\\)." },
                { q: "Hausse de 20% suivie d'une baisse de 20% : CM global ?", ans: "0.96", type: "input", expl: "\\(1.2 \\times 0.8 = 0.96\\)." },
                { q: "Évolution réciproque d'une baisse de 50% ?", ans: "100%", type: "input", expl: "\\(1/0.5 = 2 \\implies +100%\\)." },
                { q: "Triple hausse de 10%. CM global ?", ans: "1.331", type: "input", expl: "\\(1.1^3 = 1.331\\)." },
                { q: "Une baisse de 20% suivie d'une hausse de 25% donne :", ans: "1", type: "input", expl: "\\(0.8 \\times 1.25 = 1\\) (stagnation)." },
                { q: "Quel est le taux d'évolution global pour deux hausses successives de 20% ?", ans: "44%", type: "input", expl: "\\(1.2 \\times 1.2 = 1.44\\)." },
                { q: "Évolution réciproque d'une hausse de 100% ?", ans: "-50%", type: "input", expl: "\\(1/2 = 0.5\\)." },
                { q: "Si un prix triple, le taux d'évolution est :", ans: "200%", type: "input", expl: "\\(CM=3 \\implies 3-1 = 2\\)." },
                { q: "Calculer le coefficient multiplicateur global pour une baisse de 10% suivie d'une hausse de 20%.", ans: "1.08", type: "input", expl: "\\(0.9 \\times 1.2 = 1.08\\)." },
                { q: "Évolution globale de +5% puis +5% ?", ans: "10.25%", type: "input", expl: "\\(1.05 \\times 1.05 = 1.1025\\)." },
                { q: "Une baisse de 100% donne un CM de :", ans: "0", type: "input", expl: "On multiplie par 0." },
                { q: "Si un prix baisse de 20%, pour revenir au prix initial il faut augmenter de :", ans: "25%", type: "input", expl: "\\(1/0.8 = 1.25\\)." },
                { q: "Deux baisses successives de 50% correspondent à une baisse de :", ans: "75%", type: "input", expl: "\\(0.5 \\times 0.5 = 0.25 \\implies -75%\\)." },
                { q: "Multiplier par 1.5 puis par 0.5 revient à multiplier par :", ans: "0.75", type: "input", expl: "\\(1.5 \\times 0.5 = 0.75\\)." },
                { q: "Augmenter de 10% puis baisser de 10%. Résultat global ?", ans: "-1%", type: "input", expl: "\\(1.1 \\times 0.9 = 0.99 \\implies -1%\\)." },
                { q: "Un coefficient multiplicateur de 4 correspond à une augmentation de quel pourcentage ?", ans: "300%", type: "input", expl: "\\(4-1 = 3\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une baisse de 75% ?", ans: "0.25", type: "input", expl: "\\(1 - 0.75 = 0.25\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une hausse de 0.5% ?", ans: "1.005", type: "input", expl: "\\(1 + 0.005\\)." },
                { q: "Multiplier une valeur par 3 correspond à une augmentation de quel pourcentage ?", ans: "200%", type: "input", expl: "\\(3-1=2\\)." },
                { q: "Une hausse de 20% suivie d'une hausse de 30% : CM ?", ans: "1.56", type: "input", expl: "\\(1.2 \\times 1.3 = 1.56\\)." },
                { q: "Évolution réciproque d'une hausse de 400% ?", ans: "-80%", type: "input", expl: "\\(1/5 = 0.2\\)." },
                { q: "Quel est le coefficient multiplicateur global pour une hausse de 100% suivie d'une baisse de 50% ?", ans: "1", type: "input", expl: "\\(2 \\times 0.5 = 1\\)." },
                { q: "Quel est le taux d'évolution associé à un coefficient multiplicateur de 1.125 ?", ans: "12.5%", type: "input", expl: "\\(0.125 = 12.5%\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une baisse de 1% suivie d'une hausse de 1% ?", ans: "0.9999", type: "input", expl: "\\(0.99 \\times 1.01 = 0.9999\\)." },
                { q: "Multiplier une valeur par 0.1 correspond à une baisse de quel pourcentage ?", ans: "90%", type: "input", expl: "\\(1-0.1 = 0.9\\)." },
                { q: "Si un prix est divisé par 4, la baisse est de :", ans: "75%", type: "input", expl: "\\(CM=0.25\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une hausse de 10% puis baisse de 5% ?", ans: "1.045", type: "input", expl: "\\(1.1 \\times 0.95 = 1.045\\)." },
                { q: "Évolution réciproque d'une hausse de 300% ?", ans: "-75%", type: "input", expl: "\\(1/4 = 0.25\\)." },
                { q: "Quel est le coefficient multiplicateur global pour 10 hausses successives de 10% ?", ans: "2.59", type: "input", expl: "\\(1.1^{10} \\approx 2.59\\)." },
                { q: "Un CM de 0.01 c'est une baisse de :", ans: "99%", type: "input", expl: "\\(1-0.01 = 0.99\\)." },
                { q: "Hausse de 20% puis baisse de 25%. CM global ?", ans: "0.9", type: "input", expl: "\\(1.2 \\times 0.75 = 0.9\\)." },
                { q: "Évolution réciproque d'une baisse de 20% ?", ans: "25%", type: "input", expl: "\\(1/0.8 = 1.25\\)." },
                { q: "Multiplier par 1.2 puis par 0.8 revient à :", ans: "baisser de 4%", type: "mcq", opts: ["augmenter de 4%", "baisser de 4%", "stagnation"], expl: "\\(0.96 = 1-0.04\\)." },
                { q: "Si un prix quadruple, le taux d'évolution est :", ans: "300%", type: "input", expl: "\\(4-1 = 3 = 300%\\)." },
                { q: "Un coefficient multiplicateur de 0.75 correspond à une baisse de quel pourcentage ?", ans: "25%", type: "input", expl: "\\(1-0.75 = 0.25\\)." },
                { q: "Quel est le coefficient multiplicateur global associé à une hausse de 10% suivie d'une baisse de 20% ?", ans: "0.88", type: "input", expl: "\\(1.1 \\times 0.8 = 0.88\\)." },
                { q: "Évolution globale de +50% puis -50% :", ans: "-25%", type: "input", expl: "\\(1.5 \\times 0.5 = 0.75\\)." },
                { q: "Pour doubler un prix, il faut l'augmenter de :", ans: "100%", type: "input", expl: "\\(CM=2\\)." },
                { q: "Une baisse de 10% par an pendant 2 ans : CM ?", ans: "0.81", type: "input", expl: "\\(0.9^2 = 0.81\\)." },
                { q: "Calculer le coefficient multiplicateur global pour trois hausses successives de 10%.", ans: "1.331", type: "input", expl: "\\(1.1^3 = 1.331\\)." }
            ]}
        ]
    },
fonctions: {
        name: "Fonctions & Graphes",
        icon: "📉",
        subtopics: [
            { id: 'lecture', name: "Lecture Graphique", questions: [
                { 
                    q: "Lire graphiquement l'ordonnée à l'origine de cette droite :", 
                    ans: "2", 
                    type: "graph-input", 
                    expl: "La droite coupe l'axe des ordonnées (axe vertical) au point de coordonnées (0, 2).",
                    renderGraph: function(board) {
                        board.create('line', [[0, 2], [2, 6]], {strokeColor: '#3498db', strokeWidth: 3});
                        board.create('point', [0, 2], {name: '', size: 3, color: '#e74c3c'});
                    },
                },
                { q: "Si la courbe de \\(f\\) passe par \\((2,5)\\), alors \\(f(2)=\\)", ans: "5", type: "input", expl: "L'ordonnée est l'image." },
                { q: "Déterminer l'antécédent de 0 sachant que la courbe coupe l'axe des abscisses en 3 :.", ans: "3", type: "input", expl: "L'abscisse du point d'intersection." },
                { q: "Quel est le coefficient directeur de la droite \\(y=3x-2\\) : ?", ans: "3", type: "input", expl: "C'est le coefficient de \\(x\\)." },
                { q: "Quelle est l'ordonnée à l'origine de la droite d'équation \\(y=x+4\\) ?", ans: "4", type: "input", expl: "C'est la valeur pour \\(x=0\\)." },
                { q: "Si \\(f(x)=-2x+6\\), alors \\(f(3)=\\)", ans: "0", type: "input", expl: "\\(-2(3)+6 = 0\\)." },
                { q: "Une droite passe par \\(A(0,2)\\) et \\(B(1,5)\\). Pente ?", ans: "3", type: "input", expl: "\\((5-2)/(1-0) = 3\\)." },
                { q: "Déterminer l'image de -1 par la fonction \\(f(x)=x^2+1\\).", ans: "2", type: "input", expl: "\\((-1)^2+1 = 2\\)." },
                { q: "Si \\(f(4)=0\\), on dit que 4 est un :", ans: "antécédent de 0", type: "mcq", opts: ["antécédent de 0", "image de 0", "coefficient", "sommet"], expl: "Calculer la valeur de x pour laquelle f(x)=0.." },
                { q: "L'axe des ordonnées a pour équation :", ans: "x=0", type: "input", expl: "Tous les points ont une abscisse nulle." },
                { q: "L'axe des abscisses a pour équation :", ans: "y=0", type: "input", expl: "Tous les points ont une ordonnée nulle." },
                { q: "Quel est le coefficient directeur de la droite \\(x=2\\) : ?", ans: "indéfini", type: "mcq", opts: ["indéfini", "0", "2", "1"], expl: "Une droite verticale n'a pas de pente finie." },
                { q: "Si \\(f(x)=ax+b\\) et \\(b=0\\), la fonction est :", ans: "linéaire", type: "mcq", opts: ["linéaire", "affine non linéaire", "constante"], expl: "Propriété du cours." },
                { q: "Calculer l'expression suivante : \\(f(0)\\) pour \\(f(x)=x^2-3x+7\\).", ans: "7", type: "input", expl: "L'ordonnée à l'origine." },
                { q: "Si la droite descend, le coefficient directeur est :", ans: "négatif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "Pente négative." },
                { q: "Quelle est l'ordonnée à l'origine de la droite \\(y=2x-1\\) ?", ans: "-1", type: "input", expl: "Calculer la valeur exacte de la constante.." },
                { 
                    q: "Lire graphiquement l'image de 2 par la fonction représentée :", 
                    ans: "4", 
                    type: "graph-input", 
                    expl: "On se place à x=2, on rejoint la courbe verticalement puis on lit l'ordonnée correspondante (y=4).",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return x*x; }], {strokeColor: '#e74c3c', strokeWidth: 3});
                        board.setBoundingBox([-5, 10, 5, -2]);
                    },
                },
                { 
                    q: "Résoudre graphiquement l'équation \\(f(x) = 3\\). Donner la solution positive :", 
                    ans: "2", 
                    type: "graph-input", 
                    expl: "On cherche les abscisses des points d'ordonnée 3. La courbe passe par (2, 3).",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return -0.5*x*x + 5; }], {strokeColor: '#3498db', strokeWidth: 3});
                        board.create('line', [[-5, 3], [5, 3]], {strokeColor: '#2ecc71', dash: 2});
                        board.setBoundingBox([-5, 6, 5, -2]);
                    },
                },
                { 
                    q: "Donner le signe de \\(f(x)\\) sur l'intervalle \\([1; +\\infty[\\) :", 
                    ans: "négatif", 
                    type: "mcq", 
                    opts: ["positif", "négatif", "nul"],
                    expl: "La courbe est en dessous de l'axe des abscisses pour x > 1.",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return -2*x + 2; }], {strokeColor: '#9b59b6', strokeWidth: 3});
                        board.setBoundingBox([-2, 5, 4, -5]);
                    },
                },
                { 
                    q: "Déterminer graphiquement le coefficient directeur de cette droite :", 
                    ans: "2", 
                    type: "graph-input", 
                    expl: "Quand on avance de 1 unité vers la droite, on monte de 2 unités.",
                    renderGraph: function(board) {
                        board.create('line', [[0, 1], [1, 3]], {strokeColor: '#e67e22', strokeWidth: 3});
                        board.create('point', [0, 1], {name: '', size: 3, color: '#2c3e50'});
                        board.create('point', [1, 3], {name: '', size: 3, color: '#2c3e50'});
                        board.setBoundingBox([-2, 5, 3, -2]);
                    }
                },
                { 
                    q: "Lire graphiquement l'image de -1 par la fonction affine représentée :", 
                    ans: "3", 
                    type: "graph-input", 
                    expl: "À l'abscisse -1, on lit une ordonnée de 3 sur la droite.",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return -2*x + 1; }], {strokeColor: '#f39c12', strokeWidth: 3});
                        board.setBoundingBox([-4, 5, 4, -3]);
                    },
                },
                { 
                    q: "Lire graphiquement l'image de 2 par cette fonction (polynôme de degré 3) :", 
                    ans: "0", 
                    type: "graph-input", 
                    expl: "La courbe coupe l'axe des abscisses en x=2, donc f(2)=0.",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return 0.5*x*x*x - 2*x; }], {strokeColor: '#8e44ad', strokeWidth: 3});
                        board.setBoundingBox([-4, 5, 4, -5]);
                    },
                },
                { 
                    q: "Résoudre graphiquement l'inéquation \\(f(x) < 0\\). La solution est l'intervalle ]-a ; a[. Que vaut a ?", 
                    ans: "2", 
                    type: "graph-input", 
                    expl: "La parabole est sous l'axe des abscisses entre x=-2 et x=2.",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return x*x - 4; }], {strokeColor: '#c0392b', strokeWidth: 3});
                        board.setBoundingBox([-4, 5, 4, -5]);
                    },
                },
                { 
                    q: "Résoudre graphiquement l'équation \\(f(x) = 0\\). Donner la solution négative :", 
                    ans: "-2", 
                    type: "graph-input", 
                    expl: "La courbe coupe l'axe des abscisses en x=-2 (et touche l'axe en x=1).",
                    renderGraph: function(board) {
                        board.create('functiongraph', [function(x){ return x*x*x - 3*x + 2; }], {strokeColor: '#16a085', strokeWidth: 3});
                        board.setBoundingBox([-3, 5, 3, -3]);
                    }
                }
            ]},
            { id: 'affine', name: "Signe & Variations", questions: [
                { q: "Quel est le signe de \\(f(x)=2x-4\\) pour \\(x > 2\\) ?", ans: "positif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "\\(2(x-2) > 0\\)." },
                { q: "Si \\(a < 0\\), la fonction affine \\(ax+b\\) est :", ans: "décroissante", type: "mcq", opts: ["croissante", "décroissante", "constante"], expl: "Le coefficient directeur est négatif." },
                { q: "Équation d'une droite horizontale passant par \\((1,3)\\) :", ans: "y=3", type: "input", expl: "L'ordonnée est constante." },
                { q: "Calculer la valeur exacte de \\(x\\) où \\(f(x)=5x-10\\) s'annule :.", ans: "2", type: "input", expl: "\\(5x=10 \\implies x=2\\)." },
                { q: "Si une droite monte, son coefficient directeur est :", ans: "positif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "Pente ascendante." },
                { q: "Quel est le signe de \\(-3x+9\\) pour \\(x < 3\\) ?", ans: "positif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "La fonction décroît et s'annule en 3." },
                { q: "Quel est le coefficient directeur de la droite \\(AB\\) avec \\(A(1,2)\\) et \\(B(3,2)\\) ?", ans: "0", type: "input", expl: "La droite est horizontale." },
                { q: "La fonction \\(f(x)=5\\) est une fonction :", ans: "constante", type: "mcq", opts: ["constante", "linéaire", "affine", "carrée"], expl: "Ne dépend pas de x." },
                { q: "Une fonction linéaire passe toujours par :", ans: "l'origine", type: "mcq", opts: ["l'origine", "(1,1)", "(0,1)", "(1,0)"], expl: "Car \\(f(0)=a \\times 0 = 0\\)." },
                { q: "Si \\(f\\) est décroissante sur \\(\\mathbb{R}\\), alors \\(f(5) ... f(2)\\)", ans: "<", type: "mcq", opts: ["<", ">", "=", "on ne sait pas"], expl: "Elle inverse l'ordre." },
                { q: "Quelle est la valeur charnière du signe de \\(ax+b\\) ?", ans: "-b/a", type: "input", expl: "C'est l'abscisse où f s'annule." },
                { q: "Si \\(f(x)=-x+1\\), \\(f(10) =\\)", ans: "-9", type: "input", expl: "\\(-10+1 = -9\\)." },
                { q: "Quelle est la pente d'une droite parallèle à l'axe des abscisses ?", ans: "0", type: "input", expl: "Pente nulle." },
                { q: "Si \\(f(2)=3\\) et \\(f(4)=3\\), la fonction est probablement :", ans: "constante", type: "mcq", opts: ["constante", "croissante", "décroissante"], expl: "Même image pour x différents." },
                { q: "Une fonction affine est définie sur :", ans: "R", type: "input", expl: "Ensemble des réels." },
                { q: "Si \\(f(x)=2x+1\\), la droite coupe l'axe y en :", ans: "1", type: "input", expl: "Ordonnée à l'origine." },
                { q: "Quel est le coefficient directeur de \\(y = -x\\) ?", ans: "-1", type: "input", expl: "Coefficient de x." },
                { q: "Si \\(f(x)=3x-6\\), alors \\(f(x)=0 \\iff x=\\)", ans: "2", type: "input", expl: "\\(3x=6\\)." },
                { q: "Quel est le signe de \\(5x+10\\) pour \\(x < -2\\) ?", ans: "négatif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "La fonction croît et s'annule en -2." },
                { q: "La fonction \\(f(x)=x^2\\) est-elle affine ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "C'est une fonction du second degré." },
                { q: "Si \\(a=0\\), la fonction \\(ax+b\\) est :", ans: "constante", type: "mcq", opts: ["constante", "linéaire", "croissante"], expl: "Pente nulle." },
                { q: "Une droite verticale a-t-elle un coefficient directeur ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "La division par 0 est impossible." },
                { q: "Déterminer l'image de 10 par la fonction \\(f(x)=0.5x+2\\).", ans: "7", type: "input", expl: "\\(5+2=7\\)." },
                { q: "Si \\(f(x)=-2x\\), c'est une fonction :", ans: "linéaire", type: "mcq", opts: ["linéaire", "affine non linéaire", "carrée"], expl: "Passe par l'origine." },
                { q: "Calculer la pente de la droite passant par \\((0,0)\\) et \\((2,4)\\).", ans: "2", type: "input", expl: "\\(4/2=2\\)." },
                { q: "Quelle est l'ordonnée à l'origine de \\(y=x\\) ?", ans: "0", type: "input", expl: "\\(b=0\\)." },
                { q: "Si \\(f\\) est croissante, \\(f(2) ... f(3)\\)", ans: "<", type: "mcq", opts: ["<", ">", "=", "on ne sait pas"], expl: "Elle conserve l'ordre." },
                { q: "Une fonction affine est représentée par :", ans: "une droite", type: "input", expl: "C'est sa courbe représentative." },
                { q: "Si \\(f(x)=x-5\\), l'antécédent de 0 est :", ans: "5", type: "input", expl: "\\(x-5=0\\)." },
                { q: "Quel est le signe de \\(-2x-2\\) pour \\(x > -1\\) ?", ans: "négatif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "Elle décroît et s'annule en -1." },
                { q: "La droite \\(y=3\\) est :", ans: "horizontale", type: "mcq", opts: ["horizontale", "verticale", "oblique"], expl: "Pente nulle." },
                { q: "Si \\(f(x)=ax+b\\), alors \\(f(1)-f(0) =\\)", ans: "a", type: "input", expl: "C'est la définition de la pente." },
                { q: "L'image de 0 par une fonction affine est :", ans: "b", type: "input", expl: "Ordonnée à l'origine." },
                { q: "Une fonction constante a une pente de :", ans: "0", type: "input", expl: "Pas de variation." },
                { q: "Si \\(f(x)=x-3\\), l'image de 0 est :", ans: "-3", type: "input", expl: "Ordonnée à l'origine." },
                { q: "Quel est le signe de \\(x+5\\) pour \\(x < -5\\) ?", ans: "négatif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "S'annule en -5." },
                { q: "Une fonction affine est croissante si \\(a ... 0\\)", ans: ">", type: "mcq", opts: [">", "<", "="], expl: "Pente positive." },
                { q: "Calculer la valeur de \\(f(2)\\) pour \\(f(x)=-x+5\\).", ans: "3", type: "input", expl: "\\(-2+5=3\\)." },
                { q: "Quel est le coefficient directeur de \\(y=10\\) ?", ans: "0", type: "input", expl: "Droite horizontale." },
                { q: "Si \\(f(1)=2\\) et \\(f(2)=4\\) (affine), la pente est :", ans: "2", type: "input", expl: "\\((4-2)/(2-1)=2\\)." },
                { q: "La droite \\(y=x\\) passe par \\((5,5)\\) ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "Abscisse = Ordonnée." },
                { q: "Si \\(b < 0\\), la droite coupe l'axe y :", ans: "sous l'origine", type: "mcq", opts: ["au-dessus de l'origine", "sous l'origine", "à l'origine"], expl: "Ordonnée négative." },
                { q: "L'antécédent de 10 pour \\(f(x)=2x\\) est :", ans: "5", type: "input", expl: "\\(2x=10 \\implies x=5\\)." }
            ]}
        ]
    },
stats_proba: {
        name: "Stats & Probabilités",
        icon: "🎲",
        subtopics: [
            { id: 'stats', name: "Indicateurs Statistiques", questions: [
                { q: "Calculer la moyenne de la série de valeurs : 10, 12, 14.", ans: "12", type: "input", expl: "\\((10+12+14)/3 = 12\\)." },
                { q: "Déterminer la médiane de la série de valeurs : 5, 8, 12, 15, 20.", ans: "12", type: "input", expl: "Valeur centrale d'une série ordonnée." },
                { q: "Calculer l'étendue de la série statistique suivante : 2, 5, 10, 15.", ans: "13", type: "input", expl: "\\(15 - 2 = 13\\)." },
                { q: "Si on ajoute 2 à chaque note, la moyenne augmente de :", ans: "2", type: "input", expl: "Propriété de la moyenne." },
                { q: "Quelle est la fréquence d'apparition de la valeur 4 dans la série suivante : 4, 4, 5, 7 ?", ans: "0.5", type: "input", expl: "\\(2/4 = 0.5\\)." },
                { q: "Calculer la moyenne de la série de valeurs : 2 et 8.", ans: "5", type: "input", expl: "\\((2+8)/2 = 5\\)." },
                { q: "Dans une classe de 30, il y a 12 filles. Fréquence ?", ans: "0.4", type: "input", expl: "\\(12/30 = 4/10 = 0.4\\)." },
                { q: "Déterminer la médiane de la série de valeurs : 1, 2, 3, 4.", ans: "2.5", type: "input", expl: "Moyenne entre les deux valeurs centrales." },
                { q: "Si on double toutes les données, la moyenne est :", ans: "doublée", type: "mcq", opts: ["doublée", "inchangée", "augmentée de 2", "quadruplée"], expl: "Linéarité." },
                { q: "Quelle est la somme de toutes les fréquences d'une série statistique ?", ans: "1", type: "input", expl: "Soit 100%." },
                { q: "Premier quartile \\(Q_1\\) d'une série de 4 valeurs :", ans: "la 1ère valeur", type: "mcq", opts: ["la 1ère valeur", "la 2ème valeur", "la moyenne", "la médiane"], expl: "\\(4 \\times 0.25 = 1\\)." },
                { q: "Troisième quartile \\(Q_3\\) d'une série de 4 valeurs :", ans: "la 3ème valeur", type: "mcq", opts: ["la 3ème valeur", "la 4ème valeur", "la moyenne", "la médiane"], expl: "\\(4 \\times 0.75 = 3\\)." },
                { q: "L'écart interquartile est \\(Q_3 - Q_1\\) ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "C'est sa définition." },
                { q: "Dans un diagramme circulaire, 25% correspond à un angle de :", ans: "90", type: "input", expl: "\\(0.25 \\times 360 = 90\\)." },
                { q: "Moyenne de \\(x\\) et \\(y\\) est \\((x+y)/2\\) ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "Formule de base." },
                { 
                    q: "Lire la médiane sur ce diagramme en boîte :", 
                    ans: "12", 
                    type: "graph-input", 
                    expl: "La médiane correspond au trait vertical à l'intérieur de la boîte.",
                    renderGraph: function(board) {
                        board.create('line', [[5, 2], [8, 2]], {straightFirst:false, straightLast:false, strokeWidth: 2});
                        board.create('line', [[15, 2], [20, 2]], {straightFirst:false, straightLast:false, strokeWidth: 2});
                        board.create('polygon', [[8, 1.5], [15, 1.5], [15, 2.5], [8, 2.5]], {fillColor: '#3498db', fillOpacity: 0.3});
                        board.create('line', [[12, 1.5], [12, 2.5]], {straightFirst:false, straightLast:false, strokeWidth: 3, strokeColor: '#e74c3c'});
                        board.create('line', [[5, 1.8], [5, 2.2]], {straightFirst:false, straightLast:false});
                        board.create('line', [[20, 1.8], [20, 2.2]], {straightFirst:false, straightLast:false});
                        board.setBoundingBox([0, 4, 25, 0]);
                    },
                },
                { 
                    q: "Lire le premier quartile (Q1) sur ce diagramme en boîte :", 
                    ans: "8", 
                    type: "graph-input", 
                    expl: "Le premier quartile correspond au bord gauche de la boîte.",
                    renderGraph: function(board) {
                        board.create('line', [[5, 2], [8, 2]], {straightFirst:false, straightLast:false, strokeWidth: 2});
                        board.create('line', [[15, 2], [20, 2]], {straightFirst:false, straightLast:false, strokeWidth: 2});
                        board.create('polygon', [[8, 1.5], [15, 1.5], [15, 2.5], [8, 2.5]], {fillColor: '#2ecc71', fillOpacity: 0.3});
                        board.create('line', [[12, 1.5], [12, 2.5]], {straightFirst:false, straightLast:false, strokeWidth: 2, strokeColor: '#2c3e50'});
                        board.create('line', [[5, 1.8], [5, 2.2]], {straightFirst:false, straightLast:false});
                        board.create('line', [[20, 1.8], [20, 2.2]], {straightFirst:false, straightLast:false});
                        board.setBoundingBox([0, 4, 25, 0]);
                    },
                },
                { 
                    q: "Lire l'effectif de la modalité 2 sur ce diagramme en barres :", 
                    ans: "3", 
                    type: "graph-input", 
                    expl: "La barre au-dessus de 2 s'élève jusqu'à l'ordonnée 3.",
                    renderGraph: function(board) {
                        board.create('chart', [[1, 2, 3], [5, 3, 4]], {chartStyle:'bar', width:0.5, color: '#3498db'});
                        board.setBoundingBox([0, 6, 4, -1]);
                    },
                },
                { 
                    q: "Lire l'ordonnée du point d'abscisse 3 sur ce nuage de points :", 
                    ans: "4", 
                    type: "graph-input", 
                    expl: "Le point d'abscisse 3 a pour ordonnée 4.",
                    renderGraph: function(board) {
                        board.create('point', [1, 2], {name:'', size:4, color:'#e74c3c'});
                        board.create('point', [2, 5], {name:'', size:4, color:'#e74c3c'});
                        board.create('point', [3, 4], {name:'', size:4, color:'#e74c3c'});
                        board.setBoundingBox([0, 6, 5, -1]);
                    },
                },
                { q: "10 élèves ont 10/20 et 20 élèves ont 13/20. Quelle est la moyenne ?", ans: "12", type: "input", expl: "((10*10) + (20*13)) / 30 = 360 / 30 = 12." }
            ]},
            { id: 'proba', name: "Probabilités", questions: [
                { q: "Quelle est la probabilité de tirer un 6 avec un dé équilibré ?", ans: "1/6", type: "input", expl: "1 issue favorable sur 6 possibles." },
                { q: "Si \\(P(A) = 0.3\\), alors \\(P(\\text{non } A) =\\)", ans: "0.7", type: "input", expl: "\\(1 - 0.3 = 0.7\\)." },
                { q: "Quelle est la probabilité d'un événement certain ?", ans: "1", type: "input", expl: "Par définition." },
                { q: "Dans un jeu de 32 cartes, probabilité de tirer un As :", ans: "1/8", type: "input", expl: "\\(4/32 = 1/8 = 0.125\\)." },
                { q: "Probabilité d'obtenir Pile avec une pièce équilibrée :", ans: "0.5", type: "input", expl: "Équiprobabilité." },
                { q: "Quelle est la probabilité d'un événement impossible ?", ans: "0", type: "input", expl: "Par définition." },
                { q: "Si \\(P(A \\cap B) = 0{,}1\\) et \\(P(A) = 0{,}5\\), calculer la probabilité conditionnelle \\(P_A(B)\\).", ans: "0.2", type: "input", expl: "\\(0.1 / 0.5 = 0.2\\)." },
                { q: "Si deux événements sont incompatibles, \\(P(A \\cup B) =\\)", ans: "P(A)+P(B)", type: "mcq", opts: ["P(A)+P(B)", "P(A)*P(B)", "1", "0"], expl: "L'intersection est vide." },
                { q: "Probabilité d'avoir au moins une fille sur 2 enfants :", ans: "0.75", type: "input", expl: "1 - P(G,G) = 1 - 0.25 = 0.75." },
                { q: "Quelle est la somme des probabilités de toutes les issues d'une expérience aléatoire ?", ans: "1", type: "input", expl: "Totalité de l'univers." },
                { q: "Si \\(P(A)=0.5\\) et \\(P(B)=0.5\\), alors \\(P(A \\cap B)=0.25\\) ?", ans: "si indépendants", type: "mcq", opts: ["toujours", "jamais", "si indépendants", "si incompatibles"], expl: "La formule \\(P(A)P(B)\\) ne vaut que pour l'indépendance." },
                { q: "Probabilité de ne pas tirer un As dans un jeu de 32 :", ans: "28/32", type: "input", expl: "Il reste 28 cartes." },
                { q: "Quel est le nombre d'issues possibles pour le jet simultané de 2 dés ?", ans: "36", type: "input", expl: "\\(6 \\times 6 = 36\\)." },
                { q: "Quelle est la probabilité de tirer une boule rouge parmi 3 rouges et 2 bleues ?", ans: "0.6", type: "input", expl: "\\(3/5 = 0.6\\)." },
                { q: "La formule \\(P_B(A) = \\dfrac{P(A \\cap B)}{P(B)}\\) est-elle exacte ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "Définition de la probabilité conditionnelle." },
                { q: "Si on tire 2 boules avec remise parmi 10, nombre d'issues ?", ans: "100", type: "input", expl: "\\(10 \\times 10 = 100\\)." },
                { q: "Quelle est la probabilité de tirer un roi dans un jeu de 52 cartes ?", ans: "1/13", type: "input", expl: "\\(4/52 = 1/13\\)." },
                { q: "Si \\(P(A)=0.2, P(B)=0.3\\) et \\(A,B\\) indépendants, \\(P(A \\cap B)=\\)", ans: "0.06", type: "input", expl: "\\(0.2 \\times 0.3 = 0.06\\)." },
                { q: "L'événement contraire de 'obtenir au moins un Pile' est :", ans: "obtenir que des Faces", type: "mcq", opts: ["obtenir que des Faces", "obtenir que des Piles", "obtenir un Pile", "on ne peut pas dire"], expl: "Négation de 'au moins un'." },
                { q: "Probabilité d'obtenir une somme de 7 avec deux dés :", ans: "1/6", type: "input", expl: "6 issues sur 36 (1-6, 2-5, 3-4, 4-3, 5-2, 6-1)." },
                { q: "Si \\(P(A)=0.8\\), alors \\(P(\\text{non } A)=\\)", ans: "0.2", type: "input", expl: "\\(1-0.8 = 0.2\\)." },
                { q: "Dans un arbre pondéré, la somme des branches issues d'un noeud vaut :", ans: "1", type: "input", expl: "Loi des noeuds." },
                { q: "Quelle est la probabilité de tirer une voyelle dans le mot 'MATHS' ?", ans: "0.2", type: "input", expl: "Seule la lettre 'A' sur 5." },
                { q: "Si \\(A \\subset B\\), alors \\(P(A) ... P(B)\\)", ans: "<=", type: "mcq", opts: ["<=", ">=", "=", "on ne sait pas"], expl: "Propriété de croissance des probabilités." },
                { q: "Probabilité d'obtenir un nombre pair avec un dé :", ans: "0.5", type: "input", expl: "2, 4, 6 sur 6 issues." },
                { q: "Quel est le nombre de façons de choisir 2 éléments parmi 3 ?", ans: "3", type: "input", expl: "(1,2), (1,3), (2,3)." },
                { q: "Si \\(P(A \\cap B) = 0\\), on dit que les événements sont :", ans: "incompatibles", type: "input", expl: "Pas d'issue commune." },
                { 
                    q: "Sur cet arbre de probabilités, calculer la probabilité manquante \\(x\\) :", 
                    ans: "0.4", 
                    type: "graph-input", 
                    expl: "La somme des probabilités des branches issues d'un même nœud vaut 1. Donc \\(x = 1 - 0.6 = 0.4\\).",
                    renderGraph: function(board) {
                        var A = board.create('point', [0, 2], {name:'', visible:false});
                        var B1 = board.create('point', [3, 4], {name:'Succès', size:0, label:{offset:[10,-10], fontSize: 16, strokeColor: 'white'}});
                        var B2 = board.create('point', [3, 0], {name:'Échec', size:0, label:{offset:[10,10], fontSize: 16, strokeColor: 'white'}});
                        board.create('segment', [A, B1], {strokeWidth:2, strokeColor: 'white'});
                        board.create('segment', [A, B2], {strokeWidth:2, strokeColor: 'white'});
                        board.create('text', [1, 3.5, '0.6'], {fontSize: 16, strokeColor: '#e74c3c'});
                        board.create('text', [1, 0.5, 'x'], {fontSize: 16, strokeColor: '#3498db'});
                        board.setBoundingBox([-1, 5, 5, -1]);
                    },
                },
                { 
                    q: "Sur cet arbre, calculer la probabilité de l'intersection \\(P(A \\cap B)\\) :", 
                    ans: "0.12", 
                    type: "graph-input", 
                    expl: "On multiplie les probabilités le long du chemin : \\(0.4 \\times 0.3 = 0.12\\).",
                    renderGraph: function(board) {
                        var A = board.create('point', [0, 2], {name:'', visible:false});
                        var B1 = board.create('point', [3, 3.5], {name:'A', size:0, label:{offset:[10,-10], fontSize: 16, strokeColor: 'white'}});
                        var B2 = board.create('point', [3, 0.5], {name:'non A', size:0, label:{offset:[10,10], fontSize: 16, strokeColor: 'white'}});
                        var C1 = board.create('point', [6, 4.5], {name:'B', size:0, label:{offset:[10,-10], fontSize: 16, strokeColor: 'white'}});
                        var C2 = board.create('point', [6, 2.5], {name:'non B', size:0, label:{offset:[10,10], fontSize: 16, strokeColor: 'white'}});
                        
                        board.create('segment', [A, B1], {strokeColor: 'white'});
                        board.create('segment', [A, B2], {strokeColor: 'white'});
                        board.create('segment', [B1, C1], {strokeColor: 'white'});
                        board.create('segment', [B1, C2], {strokeColor: 'white'});
                        
                        board.create('text', [1, 3, '0.4'], {strokeColor: '#f1c40f'});
                        board.create('text', [1, 1, '0.6'], {strokeColor: '#f1c40f'});
                        board.create('text', [4, 4.2, '0.3'], {strokeColor: '#e74c3c'});
                        board.create('text', [4, 2.8, '0.7'], {strokeColor: '#e74c3c'});
                        board.setBoundingBox([-1, 5, 8, -1]);
                    },
                },
                { q: "Quelle est la probabilité de tirer une carte de Coeur dans un jeu de 32 ?", ans: "0.25", type: "input", expl: "8/32 = 1/4 = 0.25." },
                { q: "Si \\(P(A)=0.6\\) et \\(P(B)=0.3\\) et \\(P(A \\cup B)=0.7\\), alors \\(P(A \\cap B)=\\)", ans: "0.2", type: "input", expl: "\\(0.6+0.3-0.7 = 0.2\\)." },
                { q: "L'univers \\(\\Omega\\) est l'ensemble des :", ans: "issues", type: "input", expl: "Résultats possibles d'une expérience." },
                { q: "Une probabilité est toujours comprise entre :", ans: "0 et 1", type: "input", expl: "Intervalle standard." },
                { q: "Événement certain : \\(P(E)=\\)", ans: "1", type: "input", expl: "Totalité." },
                { q: "Événement impossible : \\(P(E)=\\)", ans: "0", type: "input", expl: "Néant." },
                { q: "Si on lance 3 pièces, nombre d'issues ?", ans: "8", type: "input", expl: "\\(2^3 = 8\\)." },
                { q: "Probabilité d'obtenir 7 avec un dé à 6 faces :", ans: "0", type: "input", expl: "Événement impossible." },
                { q: "Si \\(P(A)=0.4\\), la probabilité de l'événement contraire est :", ans: "0.6", type: "input", expl: "\\(1-0.4=0.6\\)." },
                { q: "Dans un jeu de 52 cartes, probabilité de tirer une dame :", ans: "1/13", type: "input", expl: "\\(4/52 = 1/13\\)." },
                { q: "Si \\(A\\) et \\(B\\) sont incompatibles, \\(P(A \\cap B) =\\)", ans: "0", type: "input", expl: "Intersection vide." },
                { q: "Quelle est la probabilité de tirer une boule noire parmi 2 blanches et 3 noires ?", ans: "0.6", type: "input", expl: "3/5 = 0.6." },
                { q: "Un sac contient 10 billes, 1 seule est gagnante. \\(P(G)=\\)", ans: "0.1", type: "input", expl: "1/10 = 0.1." },
                { q: "Si \\(P(A \\cup B)=1\\), les événements sont dits :", ans: "complémentaires", type: "mcq", opts: ["complémentaires", "incompatibles", "indépendants"], expl: "Si disjoints, ils couvrent l'univers." },
                { q: "Quelle est la somme des probabilités des branches issues d'un même nœud sur un arbre ?", ans: "1", type: "input", expl: "Totalité." },
                { q: "Probabilité de ne pas obtenir Pile en lançant une pièce :", ans: "0.5", type: "input", expl: "C'est la probabilité d'obtenir Face." }
            ]}
        ]
    },
python: {
        name: "Algorithmique & Python",
        icon: "💻",
        subtopics: [
            { id: 'boucles', name: "Boucles & Fonctions", questions: [
                { q: "Que renvoie cette fonction pour \\(n=3\\) ?<br><pre><code class='language-python'>def f(n):\n    s = 0\n    for i in range(n):\n        s = s + i\n    return s</code></pre>", ans: "3", type: "input", expl: "i prend les valeurs 0, 1, 2. La somme est 0+1+2 = 3." },
                { q: "Compléter pour calculer la somme des 100 premiers entiers :<br><pre><code class='language-python'>s = 0\nfor i in range(101):\n    ...</code></pre>", ans: "s = s + i", type: "input", expl: "On ajoute chaque entier à la variable s." },
                { q: "Quel est le rôle de la boucle `while` en Python ?", ans: "Répéter tant qu'une condition est vraie", type: "mcq", opts: ["Répéter tant qu'une condition est vraie", "Répéter un nombre de fois défini", "Créer une fonction"], expl: "C'est une boucle conditionnelle non bornée." },
                { q: "Que vaut \\(u\\) à la fin de l'algorithme ?<br><pre><code class='language-python'>u = 5\nwhile u < 10:\n    u = u + 2</code></pre>", ans: "11", type: "input", expl: "u prend les valeurs 5, 7, 9, 11. À 11, la condition est fausse." },
                { q: "Compléter cet algorithme de seuil pour trouver quand \\(u > 100\\) :<br><pre><code class='language-python'>u = 2\nwhile ... :\n    u = u * 2</code></pre>", ans: "u <= 100", type: "input", expl: "La boucle doit tourner TANT QUE l'objectif n'est PAS atteint (donc u <= 100)." }
            ]},
            { id: 'listes_simul', name: "Listes & Simulations", questions: [
                { q: "Que contient la liste `L` ?<br><pre><code class='language-python'>L = [x**2 for x in range(4)]</code></pre>", ans: "[0, 1, 4, 9]", type: "input", expl: "Carrés de 0, 1, 2, 3. C'est une liste en compréhension." },
                { q: "Quelle méthode permet d'ajouter l'élément `x` à la fin de la liste `L` ?", ans: "L.append(x)", type: "mcq", opts: ["L.append(x)", "L.add(x)", "L.insert(x)", "L = L + x"], expl: "La méthode append modifie la liste en place." },
                { q: "Comment simuler le lancer d'un dé cubique équilibré (1 à 6) ?", ans: "randint(1, 6)", type: "mcq", opts: ["randint(1, 6)", "random(1, 6)", "randint(0, 5)"], expl: "Issue de la bibliothèque random." },
                { q: "Que fait ce code ?<br><pre><code class='language-python'>import random\nif random.random() < 0.2:\n    print('A')</code></pre>", ans: "Affiche A avec proba 0.2", type: "mcq", opts: ["Affiche A avec proba 0.2", "Affiche A avec proba 0.8", "Choisit 0.2"], expl: "random.random() donne un float aléatoire entre 0 et 1." },
                { q: "Que renvoie la commande `len(L)` pour `L = [2, 4, 6, 8]` ?", ans: "4", type: "input", expl: "Il y a 4 éléments dans la liste." },
                { q: "Compléter pour créer la liste des 10 premiers termes de \\(u_n = 3n\\) :<br><pre><code class='language-python'>L = []\nfor i in range(10):\n    ...</code></pre>", ans: "L.append(3*i)", type: "input", expl: "On calcule 3*i et on l'ajoute à la liste." },
                { q: "Calcul de moyenne de liste. Compléter :<br><pre><code class='language-python'>L = [10, 12, 14]\nm = sum(L) / ...</code></pre>", ans: "len(L)", type: "input", expl: "On divise la somme par le nombre d'éléments." },
                { q: "Que renvoie `L[1]` pour la liste `L = [10, 20, 30]` ?", ans: "20", type: "input", expl: "Les indices commencent à 0. L[0]=10, L[1]=20." }
            ]}
        ]
    },
second_degre: {
        name: "Second degré",
        icon: "📈",
        subtopics: [
            { id: 'delta', name: "Discriminant & Racines", questions: [
                { q: "Calculer l'expression suivante : \\(\\Delta\\) pour \\(x^2 - 5x + 6\\).", ans: "1", type: "input", expl: "\\(\\Delta = (-5)^2 - 4(1)(6) = 25 - 24 = 1\\)" },
                { q: "Combien de racines réelles possède un trinôme dont le discriminant vaut \\(\\Delta = -4\\) ?", ans: "0", type: "mcq", opts: ["0", "1", "2", "Infini"], expl: "Si \\(\\Delta < 0\\), pas de racine réelle." },
                { q: "Calculer l'expression suivante : \\(\\Delta\\) pour \\(2x^2 - 4x + 2\\).", ans: "0", type: "input", expl: "\\(\\Delta = 16 - 16 = 0\\)" },
                { q: "Quelles sont les solutions de l'équation \\(x^2 - 4 = 0\\) ?", ans: "{-2,2}", type: "mcq", opts: ["{-2,2}", "{2}", "{-4,4}"], expl: "\\(x^2 = 4 \\implies x = 2 \\text{ ou } x = -2\\)" },
                { q: "Calculer le discriminant (\\(\\Delta\\)) du trinôme \\(x^2 + x + 1\\).", ans: "-3", type: "input", expl: "\\(1^2 - 4(1)(1) = -3\\)" },
                { q: "Si \\(\\Delta > 0\\), le signe de \\(ax^2+bx+c\\) est celui de \\(a\\) :", ans: "à l'extérieur des racines", type: "mcq", opts: ["à l'extérieur des racines", "entre les racines", "toujours", "jamais"], expl: "Règle du signe du trinôme." },
                { q: "Pour le trinôme \\(ax^2+bx+c\\) de racines \\(x_1\\) et \\(x_2\\), exprimer \\(x_1 \\times x_2\\) en fonction des coefficients.", ans: "c/a", type: "input", expl: "Formule de Viète : \\(x_1 \\times x_2 = \\frac{c}{a}\\)." },
                { q: "Pour le trinôme \\(ax^2+bx+c\\) de racines \\(x_1\\) et \\(x_2\\), exprimer \\(x_1 + x_2\\) en fonction des coefficients.", ans: "-b/a", type: "input", expl: "Formule de Viète : \\(x_1 + x_2 = \\frac{-b}{a}\\)." },
                { q: "\\(x^2-3x+2\\) admet 1 comme racine. Trouver l'autre racine en utilisant le produit des racines.", ans: "2", type: "input", expl: "Produit des racines : \\(x_1 \\times x_2 = \\frac{c}{a} = 2\\), donc l'autre racine est 2." },
                { q: "Déterminer les racines de \\(x^2 - 9 = 0\\) (avec \\(a=1, b=0, c=-9\\)).", ans: "{-3,3}", type: "mcq", opts: ["{-3,3}", "{3}", "{-9,9}", "{0,3}"], expl: "\\(x^2 = 9 \\Rightarrow x = 3\\) ou \\(x = -3\\)." }
            ]},
            { id: 'forme', name: "Formes & Sommets", questions: [
                { q: "Quelles sont les coordonnées du sommet de la parabole d'équation \\(y = (x-3)^2 + 2\\) ?", ans: "(3,2)", type: "mcq", opts: ["(3,2)", "(-3,2)", "(3,-2)"], expl: "\\(S(\\alpha, \\beta)\\)." },
                { q: "Donner l'équation de l'axe de symétrie de la parabole \\(y = x^2 - 6x + 8\\).", ans: "x=3", type: "input", expl: "\\(x = -b/2a = 6/2 = 3\\)." },
                { q: "Factoriser l'expression suivante : \\(x^2 - 10x + 25\\).", ans: "(x-5)^2", type: "input", expl: "Identité remarquable \\((a-b)^2\\)." },
                { q: "Donner la forme factorisée du trinôme \\(x^2-5x+6\\) (racines 2 et 3).", ans: "(x-2)(x-3)", type: "input", expl: "\\(a(x-x_1)(x-x_2)\\)." },
                { q: "Calculer la valeur de \\(c\\) pour \\(x^2+bx+c\\) passant par \\((0,5)\\).", ans: "5", type: "input", expl: "\\(f(0)=c\\)." },
                { q: "Si \\(a > 0\\), la parabole est tournée vers :", ans: "le haut", type: "mcq", opts: ["le haut", "le bas"], expl: "Courbure positive." },
                { q: "Calculer l'abscisse du sommet de la fonction \\(f(x)=2x^2-8x+1\\).", ans: "2", type: "input", expl: "\\(-(-8)/(2 \\times 2) = 2\\)." },
                { q: "Calculer l'ordonnée du sommet de la fonction \\(f(x)=x^2-2x+3\\).", ans: "2", type: "input", expl: "\\(f(1) = 1-2+3 = 2\\)." },
                { q: "Donner la forme canonique du trinôme \\(x^2-4x+4\\).", ans: "(x-2)^2", type: "input", expl: "Ici \\(\\beta=0\\)." },
                { q: "La forme \\(a(x-\\alpha)^2+\\beta\\) est dite :", ans: "canonique", type: "input", expl: "Nom de la forme." },
                { q: "Si \\(\\Delta=0\\), la parabole est :", ans: "tangente à l'axe x", type: "mcq", opts: ["tangente à l'axe x", "au-dessus de l'axe x", "en-dessous de l'axe x"], expl: "Une seule racine double." },
                { q: "Calculer la valeur de \\(x^2-1\\) pour \\(x=0\\).", ans: "-1", type: "input", expl: "C'est l'ordonnée à l'origine." },
                { q: "Si \\(f(x)=x^2+1\\), le discriminant est :", ans: "-4", type: "input", expl: "\\(0^2 - 4(1)(1) = -4\\)." },
                { q: "Le sommet est un minimum si \\(a ... 0\\)", ans: ">", type: "mcq", opts: [">", "<", "=", "on ne sait pas"], expl: "La parabole est tournée vers le haut." },
                { q: "Les racines de \\(x^2-x=0\\) sont :", ans: "{0,1}", type: "mcq", opts: ["{0,1}", "{0,-1}", "{1,-1}", "{0}"], expl: "\\(x(x-1)=0 \\implies x=0\\) ou \\(x=1\\)." },
                { q: "Si \\(b^2 < 4ac\\), alors \\(\\Delta ... 0\\)", ans: "<", type: "mcq", opts: ["<", ">", "=", "0"], expl: "Car \\(\\Delta = b^2 - 4ac\\)." },
                { q: "Factoriser l'expression suivante : \\(x^2+4x+4\\).", ans: "(x+2)^2", type: "input", expl: "Identité remarquable." },
                { q: "L'abscisse du sommet est le milieu des racines ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "Par symétrie." },
                { q: "Si \\(a=-1\\), la fonction est :", ans: "concave", type: "mcq", opts: ["concave", "convexe"], expl: "Tournée vers le bas." },
                { q: "Calculer la valeur de \\(\\alpha\\) pour \\(x^2-2x+1\\).", ans: "1", type: "input", expl: "\\(-(-2)/2 = 1\\)." },
                { q: "Calculer le discriminant (\\(\\Delta\\)) du trinôme \\(2x^2-x-1\\).", ans: "9", type: "input", expl: "\\(1 - 4(2)(-1) = 1+8 = 9\\)" },
                { q: "Si \\(\\Delta=25\\), \\(\\sqrt{\\Delta}=\\)", ans: "5", type: "input", expl: "Calcul direct." },
                { q: "Le signe de \\(ax^2+bx+c\\) quand \\(\\Delta < 0\\) est :", ans: "celui de a", type: "input", expl: "Ne change jamais de signe." },
                { q: "Une parabole coupe l'axe y en \\((0, c)\\) ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "\\(f(0)=c\\)." },
                { q: "Quelles sont les coordonnées du sommet de la parabole d'équation \\(y=x^2\\) ?", ans: "(0,0)", type: "input", expl: "Origine." },
                { q: "Si \\(a=1, \\alpha=2, \\beta=3\\), la forme canonique est :", ans: "(x-2)^2+3", type: "input", expl: "Application de la formule." },
                { q: "Combien de solutions réelles possède l'équation \\(x^2+1=0\\) ?", ans: "0", type: "input", expl: "Pas de racine réelle." },
                { q: "Factoriser l'expression suivante : \\(x^2-3x\\).", ans: "x(x-3)", type: "input", expl: "Facteur commun x." },
                { q: "Si \\(x_1=3\\) et \\(x_2=5\\), l'axe de symétrie est :", ans: "x=4", type: "input", expl: "\\((3+5)/2 = 4\\)." },
                { q: "Calculer la valeur de \\(x^2-4x+3\\) pour \\(x=1\\).", ans: "0", type: "input", expl: "C'est une racine." },
                { q: "Si \\(a < 0\\), le sommet est un :", ans: "maximum", type: "mcq", opts: ["maximum", "minimum"], expl: "Parabole tournée vers le bas." },
                { q: "Les racines de \\(x^2+2x=0\\) sont :", ans: "{0,-2}", type: "mcq", opts: ["{0,-2}", "{0,2}", "{-2,2}", "{-2}"], expl: "\\(x(x+2)=0 \\implies x=0\\) ou \\(x=-2\\)." },
                { q: "Si \\(\\Delta = -9\\), la parabole coupe l'axe x ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "Pas de racine réelle." },
                { q: "La forme factorisée de \\(x^2-1\\) est :", ans: "(x-1)(x+1)", type: "input", expl: "Différence de deux carrés." },
                { q: "Calculer l'abscisse du sommet de la fonction \\(f(x)=-x^2+6x\\).", ans: "3", type: "input", expl: "\\(-6/(-2) = 3\\)." },
                { q: "Si \\(\\Delta > 0\\), il y a combien de racines ?", ans: "2", type: "input", expl: "Propriété du cours." },
                { q: "La forme \\(ax^2+bx+c\\) est dite :", ans: "développée", type: "input", expl: "Nom de la forme." },
                { q: "Quel est le signe de \\(x^2+1\\) sur \\(\\mathbb{R}\\) ?", ans: "positif", type: "input", expl: "Toujours strictement positif." },
                { q: "Une racine évidente de \\(x^2+x-2\\) est :", ans: "1", type: "input", expl: "\\(1+1-2=0\\)." },
                { q: "Si le sommet est \\((2,3)\\) et \\(a=1\\), la forme canonique est :", ans: "(x-2)^2+3", type: "input", expl: "Substitution directe." },
                { q: "Le discriminant de \\(x^2-2x+1\\) est :", ans: "0", type: "input", expl: "\\((-2)^2 - 4(1)(1) = 0\\)." },
                { q: "Si la parabole ne coupe pas l'axe x, alors \\(\\Delta\\) est :", ans: "négatif", type: "input", expl: "Pas de solution réelle." },
                { q: "Le produit des racines de \\(2x^2-4x+6\\) est :", ans: "3", type: "input", expl: "\\(c/a = 6/2 = 3\\)." },
                { q: "Si \\(\\alpha=5\\), l'axe de symétrie est :", ans: "x=5", type: "input", expl: "Passe par le sommet." },
                { q: "Calculer la valeur de \\(c\\) pour \\(f(x)=ax^2+bx+c\\) passant par \\((0,-1)\\).", ans: "-1", type: "input", expl: "\\(f(0)=c\\)." },
                { q: "Si \\(a=1\\) et les racines sont 2 et 4, \\(b =\\)", ans: "-6", type: "input", expl: "Somme des racines = \\(-b/a = 6\\)." },
                { q: "La parabole \\(y=x^2+x+1\\) est-elle convexe ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "\\(a=1 > 0\\)." },
                { q: "Combien de racines réelles possède le trinôme \\(x^2+10x+25\\) ?", ans: "1", type: "input", expl: "\\(\\Delta=0\\) (racine double)." },
                { q: "Factoriser l'expression suivante : \\(x^2-2x+1\\).", ans: "(x-1)^2", type: "input", expl: "Carré parfait." },
                { q: "Si \\(x_1=x_2=3\\), la forme factorisée est :", ans: "(x-3)^2", type: "input", expl: "Cas \\(\\Delta=0\\)." },
                { q: "Une parabole passe par \\((1,0)\\) et \\((3,0)\\). \\(\\alpha =\\)", ans: "2", type: "input", expl: "Milieu des racines." }
            ]}
        ]
    },
trigo: {
        name: "Trigonométrie",
        icon: "📡",
        subtopics: [
            { id: 'cercle', name: "Cercle & Valeurs", questions: [
                { q: "Quelle est la valeur de \\(\\cos\\!\\left(\\dfrac{\\pi}{3}\\right)\\) ?", ans: "1/2", type: "mcq", opts: ["1/2", "sqrt(3)/2", "sqrt(2)/2"], expl: "Valeur remarquable : \\(\\cos\\!\\left(\\frac{\\pi}{3}\\right) = \\frac{1}{2}\\)." },
                { q: "Quelle est la valeur de \\(\\sin\\!\\left(\\dfrac{\\pi}{6}\\right)\\) ?", ans: "1/2", type: "mcq", opts: ["1/2", "sqrt(3)/2", "0"], expl: "Valeur remarquable : \\(\\sin\\!\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{2}\\)." },
                { q: "Quelle est la valeur de \\(\\cos(\\pi)\\) ?", ans: "-1", type: "input", expl: "Sur le cercle trigonométrique, l'angle \\(\\pi\\) correspond au point \\((-1, 0)\\), donc \\(\\cos(\\pi) = -1\\)." },
                { q: "Quelle est la valeur de \\(\\sin\\!\\left(\\dfrac{\\pi}{2}\\right)\\) ?", ans: "1", type: "input", expl: "L'angle \\(\\frac{\\pi}{2}\\) correspond au point \\((0, 1)\\) sur le cercle, donc \\(\\sin\\!\\left(\\frac{\\pi}{2}\\right) = 1\\)." },
                { q: "Quelle est la valeur de \\(\\tan\\!\\left(\\dfrac{\\pi}{4}\\right)\\) ?", ans: "1", type: "input", expl: "\\(\\tan\\!\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sin(\\pi/4)}{\\cos(\\pi/4)} = \\frac{\\sqrt{2}/2}{\\sqrt{2}/2} = 1\\)." },
                { q: "Calculer la valeur exacte de \\(\\cos(-\\pi/3)\\).", ans: "1/2", type: "input", expl: "Le cosinus est pair." },
                { q: "Calculer la valeur exacte de \\(\\sin(-\\pi/6)\\).", ans: "-1/2", type: "input", expl: "Le sinus est impair." },
                { q: "Compléter l'identité fondamentale : \\(\\cos^2(x) + \\sin^2(x) =\\)", ans: "1", type: "input", expl: "C'est l'identité trigonométrique fondamentale, valable pour tout réel \\(x\\)." },
                { q: "Quelle est la valeur de \\(\\cos(0)\\) ?", ans: "1", type: "input", expl: "L'angle 0 correspond au point \\((1, 0)\\) sur le cercle trigonométrique, donc \\(\\cos(0) = 1\\)." },
                { q: "Quelle est la période de la fonction cosinus ?", ans: "2*pi", type: "input", expl: "Un tour complet." },
                { q: "Déterminer la mesure principale de l'angle \\(3\\pi\\).", ans: "pi", type: "input", expl: "\\(3\\pi - 2\\pi = \\pi\\)." },
                { q: "Calculer le cosinus de l'angle \\(\\pi/2\\).", ans: "0", type: "input", expl: "Axe vertical." },
                { q: "Calculer le sinus de l'angle \\(\\pi\\).", ans: "0", type: "input", expl: "Axe horizontal." },
                { q: "Si \\(\\cos(x)=1/2\\) sur \\([0, \\pi]\\), alors \\(x=\\)", ans: "pi/3", type: "input", expl: "Valeur remarquable sur le cercle trigonométrique." },
                { q: "L'axe des cosinus est l'axe des :", ans: "abscisses", type: "mcq", opts: ["abscisses", "ordonnées"], expl: "Par projection horizontale." },
                { q: "Calculer la valeur exacte de \\(\\cos(\\pi/4)\\).", ans: "sqrt(2)/2", type: "input", expl: "Valeur remarquable." },
                { q: "Calculer la valeur exacte de \\(\\sin(\\pi/4)\\).", ans: "sqrt(2)/2", type: "input", expl: "Valeur remarquable." },
                { q: "Si \\(\\sin(x)=1\\), alors \\(x\\) peut valoir :", ans: "pi/2", type: "input", expl: "Sommet du cercle." },
                { q: "Calculer la valeur exacte de \\(\\cos(2\\pi)\\).", ans: "1", type: "input", expl: "Retour au point de départ." },
                { q: "Le sinus d'un angle aigu est :", ans: "positif", type: "mcq", opts: ["positif", "négatif"], expl: "Angle entre 0 et 90°." },
                { q: "Calculer l'expression suivante : \\(\\cos(-\\pi)\\). Rappel : le cosinus est une fonction paire..", ans: "-1", type: "input", expl: "\\(\\cos(-\\pi) = \\cos(\\pi) = -1\\) car le cosinus est pair." },
                { q: "Si \\(\\cos(x)=0\\) sur \\([0, \\pi]\\), alors \\(x=\\)", ans: "pi/2", type: "input", expl: "Axe vertical." },
                { q: "Calculer l'expression suivante : \\(\\sin(0)\\)..", ans: "0", type: "input", expl: "L'angle 0 correspond au point \\((1, 0)\\), donc l'ordonnée (le sinus) vaut 0." },
                { q: "Calculer le cosinus de l'angle \\(\\pi/6\\).", ans: "sqrt(3)/2", type: "input", expl: "Valeur remarquable." },
                { q: "Le cosinus d'un angle dans \\([\\pi/2, \\pi]\\) est :", ans: "négatif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "Deuxième quadrant." },
                { q: "Calculer la valeur exacte de \\(\\tan(0)\\).", ans: "0", type: "input", expl: "\\(\\sin/\\cos = 0/1\\)." },
                { q: "Si \\(\\cos(x)=1\\), alors \\(x\\) peut valoir :", ans: "0", type: "input", expl: "Point à droite." },
                { q: "Déterminer la mesure principale de l'angle \\(5\\pi\\).", ans: "pi", type: "input", expl: "\\(5\\pi - 4\\pi = \\pi\\)." },
                { q: "À combien de radians correspond un angle de 180° ?", ans: "pi", type: "input", expl: "Demi-tour." },
                { q: "À combien de radians correspond un angle de 90° ?", ans: "pi/2", type: "input", expl: "Quart de tour." },
                { q: "Cosinus est-il pair ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "\\(\\cos(-x) = \\cos(x)\\)." },
                { q: "Sinus est-il pair ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "\\(\\sin(-x) = -\\sin(x)\\) (impair)." },
                { q: "Calculer la valeur exacte de \\(\\sin(-\\pi/2)\\).", ans: "-1", type: "input", expl: "Point en bas." },
                { q: "Si \\(\\sin(x)=0\\) sur \\([0, \\pi]\\), les solutions sont :", ans: "{0,pi}", type: "mcq", opts: ["{0,pi}", "{pi/2,pi}", "{0,pi/2}", "{pi}"], expl: "\\(\\sin(0)=0\\) et \\(\\sin(\\pi)=0\\)." },
                { q: "Quelle est la période de la fonction sinus ?", ans: "2*pi", type: "input", expl: "Un tour complet." },
                { q: "Calculer la valeur exacte de \\(\\cos(\\pi/3)\\) en décimal :.", ans: "0.5", type: "input", expl: "1/2 = 0.5." },
                { q: "À combien de radians correspond un angle de 45° ?", ans: "pi/4", type: "input", expl: "Huitième de tour." },
                { q: "Si \\(\\cos(x)=-1\\), alors \\(x\\) peut valoir :", ans: "pi", type: "input", expl: "Point à gauche." },
                { q: "Le sinus de \\(\\pi/3\\) est :", ans: "sqrt(3)/2", type: "input", expl: "Valeur remarquable." },
                { q: "L'ordonnée d'un point sur le cercle est son :", ans: "sinus", type: "input", expl: "Définition géométrique." },
                { q: "L'abscisse d'un point sur le cercle est son :", ans: "cosinus", type: "input", expl: "Définition géométrique." },
                { q: "Calculer la valeur exacte de \\(\\sin(\\pi/2)\\).", ans: "1", type: "input", expl: "Point en haut." },
                { q: "Déterminer la mesure principale de l'angle \\(-3\\pi/4\\) :.", ans: "-3*pi/4", type: "input", expl: "Déjà dans \\(]-\\pi, \\pi]\\)." },
                { q: "Si \\(\\cos(x) > 0\\) et \\(\\sin(x) > 0\\), l'angle est dans le quadrant :", ans: "1", type: "input", expl: "En haut à droite." },
                { q: "Calculer la valeur exacte de \\(\\cos(2\\pi + x)\\).", ans: "cos(x)", type: "input", expl: "Périodicité." },
                { q: "Calculer la valeur exacte de \\(\\sin(2\\pi + x)\\).", ans: "sin(x)", type: "input", expl: "Périodicité." },
                { q: "À combien de radians correspond un angle de 60° ?", ans: "pi/3", type: "input", expl: "Sixième de tour." },
                { q: "À combien de radians correspond un angle de 30° ?", ans: "pi/6", type: "input", expl: "Douzième de tour." },
                { q: "Calculer la valeur exacte de \\(\\cos(0)\\).", ans: "1", type: "input", expl: "Point de départ." },
                { q: "Calculer la valeur exacte de \\(\\sin(0)\\).", ans: "0", type: "input", expl: "Point de départ." },
                { q: "Si \\(\\cos(x) = \\cos(y)\\), alors \\(x=y\\) ou \\(x=\\)", ans: "-y", type: "input", expl: "Parité du cosinus." },
                { q: "Si \\(\\sin(x) = \\sin(y)\\), alors \\(x=y\\) ou \\(x=\\)", ans: "pi-y", type: "input", expl: "Propriété du sinus." },
                { q: "Le cercle trigonométrique a un rayon de :", ans: "1", type: "input", expl: "Par définition." },
                { q: "L'origine des angles est le point :", ans: "(1,0)", type: "input", expl: "Point à droite." },
                { q: "Le sens positif est le sens :", ans: "anti-horaire", type: "mcq", opts: ["horaire", "anti-horaire"], expl: "Sens direct." },
                { q: "Calculer la valeur exacte de \\(\\cos(\\pi)\\).", ans: "-1", type: "input", expl: "Demi-tour." },
                { q: "Calculer la valeur exacte de \\(\\sin(3\\pi/2)\\).", ans: "-1", type: "input", expl: "Point en bas." },
                { q: "Calculer le cosinus de l'angle \\(-\\pi/2\\).", ans: "0", type: "input", expl: "Point en bas." },
                { q: "Simplifier l'expression \\(\\cos(\\pi + x)\\) à l'aide des formules d'angles associés.", ans: "-cos(x)", type: "mcq", opts: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], expl: "Symétrie centrale." },
                { q: "Simplifier l'expression \\(\\sin(\\pi + x)\\) à l'aide des formules d'angles associés.", ans: "-sin(x)", type: "mcq", opts: ["sin(x)", "-sin(x)", "cos(x)", "-cos(x)"], expl: "Symétrie centrale." },
                { q: "Simplifier l'expression \\(\\cos(\\pi - x)\\) à l'aide des formules d'angles associés.", ans: "-cos(x)", type: "mcq", opts: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], expl: "Symétrie par rapport à l'axe vertical." },
                { q: "Simplifier l'expression \\(\\sin(\\pi - x)\\) à l'aide des formules d'angles associés.", ans: "sin(x)", type: "mcq", opts: ["sin(x)", "-sin(x)", "cos(x)", "-cos(x)"], expl: "Symétrie par rapport à l'axe vertical." },
                { q: "Simplifier l'expression \\(\\cos(\\pi/2 - x)\\) à l'aide des angles complémentaires.", ans: "sin(x)", type: "mcq", opts: ["sin(x)", "cos(x)", "-sin(x)", "-cos(x)"], expl: "Angles complémentaires." },
                { q: "Simplifier l'expression \\(\\sin(\\pi/2 - x)\\) à l'aide des angles complémentaires.", ans: "cos(x)", type: "mcq", opts: ["sin(x)", "cos(x)", "-sin(x)", "-cos(x)"], expl: "Angles complémentaires." }
            ]}
        ]
    },
derivation: {
        name: "Dérivation",
        icon: "🧮",
        subtopics: [
            { id: 'usuelles', name: "Dérivées usuelles", questions: [
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = x^2\\)..", ans: "2x", type: "input", expl: "\\((x^2)' = 2x\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = x^3\\)..", ans: "3x^2", type: "input", expl: "\\((x^3)' = 3x^2\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = \\dfrac{1}{x}\\)..", ans: "-1/x^2", type: "input", expl: "Formule de cours : \\((1/x)' = -1/x^2\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = \\sqrt{x}\\)..", ans: "1/(2*sqrt(x))", type: "mcq", opts: ["1/(2*sqrt(x))", "1/sqrt(x)", "x/2"], expl: "Formule de cours : \\((\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = 5x+3\\)..", ans: "5", type: "input", expl: "Dérivée d'une fonction affine : le coefficient de \\(x\\)." },
                { q: "Si \\(f(x)=x^2-4x\\), calculer \\(f'(x)\\).", ans: "2x-4", type: "input", expl: "Dérivée terme à terme : \\(2x - 4\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = x^2+x+1\\)..", ans: "2x+1", type: "input", expl: "Somme de dérivées : \\(2x+1+0 = 2x+1\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = \\dfrac{1}{x} + 5\\)..", ans: "-1/x^2", type: "input", expl: "La dérivée de la constante 5 est 0." },
                { q: "Quelle est la dérivée de \\(x^n\\) (formule générale, \\(n \\in \\mathbb{N}\\)) ?", ans: "n*x^(n-1)", type: "input", expl: "Formule générale : \\((x^n)' = n\\,x^{n-1}\\)." },
                { q: "Si \\(f'(x) > 0\\) sur un intervalle, alors \\(f\\) est :", ans: "croissante", type: "mcq", opts: ["croissante", "décroissante", "constante"], expl: "Lien entre le signe de \\(f'\\) et les variations de \\(f\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = x^2\\) en \\(x = 3\\)..", ans: "6", type: "input", expl: "\\(f'(x) = 2x\\), donc \\(f'(3) = 2 \\times 3 = 6\\)." },
                { q: "L'équation de la tangente à la courbe de \\(f\\) en \\(x=a\\) est \\(y = f'(a)(x-a) + f(a)\\) ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "Formule fondamentale de la tangente." },
                { q: "La dérivée de la somme \\(u+v\\) est égale à \\(u'+v'\\) ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "Linéarité de la dérivation." },
                { q: "Si \\(f'(2)=0\\), la courbe de \\(f\\) admet en \\(x=2\\) une tangente :", ans: "horizontale", type: "mcq", opts: ["horizontale", "verticale", "oblique"], expl: "La pente de la tangente est nulle." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = 3x^2\\)..", ans: "6x", type: "input", expl: "\\(3 \\times 2x = 6x\\)." },
                { q: "Si \\(f'(x) < 0\\) sur un intervalle \\(I\\), alors \\(f\\) est :", ans: "décroissante", type: "input", expl: "Propriété du cours : dérivée négative ↔ fonction décroissante." },
                { q: "Géométriquement, le nombre dérivé \\(f'(a)\\) représente la pente de la :", ans: "tangente", type: "input", expl: "Définition géométrique de la dérivée." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = -x+4\\)..", ans: "-1", type: "input", expl: "Coefficient de \\(x\\) : \\(-1\\)." },
                { q: "Calculer l'expression suivante : \\(f'(1)\\) pour \\(f(x) = x^3\\)..", ans: "3", type: "input", expl: "\\(f'(x) = 3x^2\\), donc \\(f'(1) = 3\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = ax+b\\) ?", ans: "a", type: "input", expl: "Pente de la droite représentant \\(f\\)." },
                { q: "Quelle est la dérivée d'une fonction constante \\(f(x) = k\\) ?", ans: "0", type: "input", expl: "Une constante ne varie pas, sa dérivée est nulle." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = -2x^2\\)..", ans: "-4x", type: "input", expl: "\\(-2 \\times 2x = -4x\\)." },
                { q: "Si \\(f(x) = x^3+x^2\\), calculer \\(f'(x)\\).", ans: "3x^2+2x", type: "input", expl: "Dérivée de chaque puissance : \\(3x^2 + 2x\\)." },
                { q: "Calculer l'expression suivante : la pente de la tangente à \\(y = x^2\\) en \\(x = 0\\)..", ans: "0", type: "input", expl: "\\(f'(0) = 2 \\times 0 = 0\\) (sommet de la parabole)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = 10x\\)..", ans: "10", type: "input", expl: "Fonction linéaire : la dérivée est le coefficient de \\(x\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = x^2-1\\) ?", ans: "2x", type: "input", expl: "La dérivée de la constante \\(-1\\) est 0." },
                { q: "Quelle est la dérivée de \\(f(x) = x\\) ?", ans: "1", type: "input", expl: "Coefficient de \\(x\\) : 1." },
                { q: "Si \\(f'(x) = 2\\) pour tout \\(x\\), la fonction \\(f\\) est :", ans: "affine", type: "mcq", opts: ["affine", "carrée", "inverse"], expl: "Pente constante → droite non horizontale." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = x^2+5x\\)..", ans: "2x+5", type: "input", expl: "Application des formules : \\(2x + 5\\)." },
                { q: "Si \\(f(x) = x^2\\), calculer \\(f'(10)\\).", ans: "20", type: "input", expl: "\\(f'(x) = 2x\\), donc \\(f'(10) = 20\\)." },
                { q: "Si la tangente à la courbe de \\(f\\) en \\(a\\) est horizontale, que vaut \\(f'(a)\\) ?", ans: "0", type: "input", expl: "La pente d'une droite horizontale est nulle." },
                { q: "Quelle est la dérivée de \\(f(x) = 3x-4\\) ?", ans: "3", type: "input", expl: "Coefficient de \\(x\\) : 3." },
                { q: "Si \\(f(x) = x^3\\), calculer la pente de la tangente en \\(x = -1\\).", ans: "3", type: "input", expl: "\\(f'(x) = 3x^2\\), donc \\(f'(-1) = 3\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = \\dfrac{1}{x}\\) en \\(x = 1\\)..", ans: "-1", type: "input", expl: "\\(f'(x) = -1/x^2\\), donc \\(f'(1) = -1\\)." },
                { q: "Si \\(f(x) = 4x^2\\), calculer \\(f'(x)\\).", ans: "8x", type: "input", expl: "\\(4 \\times 2x = 8x\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = \\dfrac{x^2}{2}\\) ?", ans: "x", type: "input", expl: "\\(\\frac{1}{2} \\times 2x = x\\)." },
                { q: "Si \\(f'(x) > 0\\), la tangente à la courbe est :", ans: "montante", type: "mcq", opts: ["montante", "descendante", "horizontale"], expl: "Pente positive → droite montante." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = -x^2+x\\)..", ans: "-2x+1", type: "input", expl: "\\(-2x + 1\\)." },
                { q: "Si \\(f(x) = 5\\), calculer \\(f'(100)\\).", ans: "0", type: "input", expl: "La dérivée d'une constante est toujours nulle." },
                { q: "Quelle est la dérivée de \\(f(x) = \\dfrac{2}{x}\\) ?", ans: "-2/x^2", type: "input", expl: "\\(2 \\times (-1/x^2) = -2/x^2\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = x^2\\) en \\(x = -2\\)..", ans: "-4", type: "input", expl: "\\(f'(x) = 2x\\), donc \\(f'(-2) = -4\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = \\sqrt{x}\\) en \\(x = 1\\)..", ans: "0.5", type: "input", expl: "\\(f'(x) = \\frac{1}{2\\sqrt{x}}\\), donc \\(f'(1) = 0{,}5\\)." },
                { q: "Si \\(f(x) = x^2+3x-1\\), calculer \\(f'(0)\\).", ans: "3", type: "input", expl: "\\(f'(x) = 2x+3\\), donc \\(f'(0) = 3\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = x^3-x\\) ?", ans: "3x^2-1", type: "input", expl: "\\(3x^2 - 1\\)." },
                { q: "Si \\(f'(1)=2\\) et \\(f(1)=3\\), donner l'équation de la tangente à la courbe de \\(f\\) en \\(x=1\\).", ans: "y=2x+1", type: "input", expl: "\\(y = 2(x-1)+3 = 2x+1\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = 10-x\\)..", ans: "-1", type: "input", expl: "Coefficient de \\(x\\) : \\(-1\\)." },
                { q: "Si \\(f(x) = x^2\\), donner l'équation de la tangente à la courbe en \\(x = 0\\).", ans: "y=0", type: "input", expl: "\\(f'(0)=0\\) et \\(f(0)=0\\), donc \\(y=0\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = x^2+2x+1\\) ?", ans: "2x+2", type: "input", expl: "\\(2x + 2\\)." },
                { q: "Si \\(f(x) = x^3\\), calculer \\(f'(2)\\).", ans: "12", type: "input", expl: "\\(f'(x) = 3x^2\\), donc \\(f'(2) = 12\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = \\dfrac{1}{x}\\) en \\(x = -1\\)..", ans: "-1", type: "input", expl: "\\(f'(x) = -1/x^2\\), donc \\(f'(-1) = -1\\)." },
                { q: "Si \\(f(x) = 2x^2+1\\), calculer \\(f'(x)\\).", ans: "4x", type: "input", expl: "\\(2 \\times 2x = 4x\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = x^2\\) en \\(x = 1\\)..", ans: "2", type: "input", expl: "\\(f'(x) = 2x\\), donc \\(f'(1) = 2\\)." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = \\dfrac{x}{3}\\)..", ans: "1/3", type: "input", expl: "Coefficient de \\(x\\) : \\(\\frac{1}{3}\\)." },
                { q: "Si \\(f'(x) = 0\\) sur tout un intervalle, que peut-on conclure sur \\(f\\) ?", ans: "constante", type: "input", expl: "Une dérivée nulle partout implique que \\(f\\) est constante." },
                { q: "Calculer l'expression suivante : la dérivée de \\(f(x) = -x^3\\)..", ans: "-3x^2", type: "input", expl: "\\(-1 \\times 3x^2 = -3x^2\\)." },
                { q: "Si \\(f(x) = x^2-x\\), calculer \\(f'(1)\\).", ans: "1", type: "input", expl: "\\(f'(x) = 2x-1\\), donc \\(f'(1) = 1\\)." },
                { q: "Quelle est la dérivée de \\(f(x) = 5x+2\\) ?", ans: "5", type: "input", expl: "Fonction affine : la dérivée est le coefficient de \\(x\\)." },
                { q: "Si \\(f(x) = x^2\\), calculer la pente de la tangente en \\(x = -1\\).", ans: "-2", type: "input", expl: "\\(f'(x) = 2x\\), donc \\(f'(-1) = -2\\)." },
                { q: "Calculer l'expression suivante : le nombre dérivé de \\(f(x) = x^2+x\\) en \\(x = 0\\)..", ans: "1", type: "input", expl: "\\(f'(x) = 2x+1\\), donc \\(f'(0) = 1\\)." },
                { q: "Si \\(f(x) = 4\\), calculer \\(f'(x)\\).", ans: "0", type: "input", expl: "La dérivée de toute constante est 0." }
            ]},
            { id: 'regles', name: "Opérations & Tangentes", questions: [
                { q: "Quelle est la formule de la dérivée du produit \\(u \\times v\\) ?", ans: "u'v + uv'", type: "mcq", opts: ["u'v + uv'", "u'v'", "u' + v'", "uv' - u'v"], expl: "Règle du produit." },
                { q: "Quelle est la formule de la dérivée du quotient \\(u/v\\) ?", ans: "(u'v-uv')/v^2", type: "mcq", opts: ["(u'v-uv')/v^2", "u'/v'", "(u'v+uv')/v^2", "u'v-uv'"], expl: "Règle du quotient." },
                { q: "Quelle est la formule de la dérivée de \\(1/v\\) (cas particulier du quotient) ?", ans: "-v'/v^2", type: "mcq", opts: ["-v'/v^2", "1/v'", "v'/v", "-1/v^2"], expl: "Cas particulier du quotient." },
                { q: "Calculer la dérivée de la fonction \\(f(x) = x\\cos(x)\\).", ans: "cos(x) - x*sin(x)", type: "input", expl: "\\(1 \\times \\cos(x) + x \\times (-\\sin(x))\\)." },
                { q: "Calculer la dérivée de la fonction \\(f(x) = x e^x\\).", ans: "e^x + x*e^x", type: "input", expl: "\\(1 \\times e^x + x \\times e^x = (x+1)e^x\\)." },
                { q: "Calculer la dérivée de \\(f(x) = 3(x^2+1)\\).", ans: "6x", type: "input", expl: "Coefficient multiplicateur." },
                { q: "Équation de la tangente en \\(a\\) :", ans: "y = f'(a)(x-a) + f(a)", type: "mcq", opts: ["y = f'(a)(x-a) + f(a)", "y = f(a)(x-a) + f'(a)", "y = f'(a)x + f(a)", "y = ax+b"], expl: "Formule fondamentale." },
                { q: "Si \\(f(1)=2\\) et \\(f'(1)=3\\), la tangente en 1 est :", ans: "y=3x-1", type: "input", expl: "\\(y = 3(x-1)+2 = 3x-3+2 = 3x-1\\)." },
                { q: "Que vaut la pente de la tangente à la courbe de \\(f\\) en un point où \\(f'(a)=0\\) ?", ans: "0", type: "input", expl: "Tangente horizontale." },
                { q: "Si \\(f'(x) > 0\\), la fonction est :", ans: "croissante", type: "mcq", opts: ["croissante", "décroissante", "constante", "négative"], expl: "Lien signe de la dérivée / variations." },
                { q: "Si \\(f'(x) < 0\\), la fonction est :", ans: "décroissante", type: "mcq", opts: ["croissante", "décroissante", "constante", "positive"], expl: "Lien signe de la dérivée / variations." },
                { q: "Extremum si la dérivée :", ans: "s'annule en changeant de signe", type: "mcq", opts: ["s'annule en changeant de signe", "est positive", "est nulle", "est constante"], expl: "Condition pour un maximum ou minimum." },
                { q: "Calculer la dérivée de \\(f(x) = \\dfrac{x^2}{x+1}\\).", ans: "(x^2+2x)/(x+1)^2", type: "input", expl: "\\((2x(x+1) - x^2(1))/(x+1)^2 = (2x^2+2x-x^2)/(x+1)^2\\)." },
                { q: "Calculer la dérivée de \\(f(x) = \\dfrac{5}{2x+1}\\).", ans: "-10/(2x+1)^2", type: "input", expl: "\\(5 \\times (-2/(2x+1)^2)\\)." },
                { q: "Coefficient directeur de la tangente en \\(x=0\\) pour \\(x^2+3x+1\\)", ans: "3", type: "input", expl: "\\(f'(x)=2x+3\\), donc \\(f'(0)=3\\)." },
                { q: "Si \\(f(x)=x^3\\), la pente en \\(x=2\\) est :", ans: "12", type: "input", expl: "\\(f'(x)=3x^2 \\implies 3(4)=12\\)." },
                { q: "Calculer la dérivée de \\(f(x) = \\sqrt{3x+1}\\).", ans: "3/(2*sqrt(3x+1))", type: "input", expl: "Formule \\(\\sqrt{u} \\to u'/(2\\sqrt{u})\\)." },
                { q: "Calculer la dérivée de \\(f(x) = \\sin(2x)\\).", ans: "2*cos(2x)", type: "input", expl: "\\(\\sin(ax+b) \\to a \\cos(ax+b)\\)." },
                { q: "Calculer la dérivée de \\(f(x) = \\cos(5x-1)\\).", ans: "-5*sin(5x-1)", type: "input", expl: "\\(\\cos(ax+b) \\to -a \\sin(ax+b)\\)." },
                { q: "Si la tangente est \\(y=2x+5\\), que vaut \\(f'(a)\\) ?", ans: "2", type: "input", expl: "Le coefficient directeur est la valeur de la dérivée." },
                { q: "Quelle est la formule de la dérivée de \\(k \\times u\\) (avec \\(k\\) constante) ?", ans: "k*u'", type: "input", expl: "Linéarité de la dérivation." },
                { q: "La dérivée de \\(x^2\\) en 5 est :", ans: "10", type: "input", expl: "\\(2 \\times 5 = 10\\)." },
                { q: "Calculer la dérivée de \\(f(x) = \\dfrac{1}{x^2+1}\\).", ans: "-2x/(x^2+1)^2", type: "input", expl: "Règle \\(1/v\\)." },
                { q: "Calculer la valeur du nombre dérivé de \\(f(x) = x^2-4x\\) en \\(x=2\\).", ans: "0", type: "input", expl: "\\(2x-4\\) s'annule en 2." },
                { q: "Comment note-t-on le nombre dérivé de \\(f\\) en \\(a\\) ?", ans: "f'(a)", type: "input", expl: "Notation standard." }
            ]}
        ]
    },
suites: {
        name: "Suites",
        icon: "🔢",
        subtopics: [
            { id: 'arith', name: "Suites Arithmétiques", questions: [
                { 
                    q: "Compléter cet algorithme de seuil pour trouver le premier entier \\(n\\) tel que \\(u_n > 50\\) (sachant que \\(u_0 = 10\\) et la raison est 5).", 
                    ans: "u <= 50", 
                    type: "python-fill", 
                    code: "u = 10\nn = 0\nwhile ______:\n    u = u + 5\n    n = n + 1",
                    expl: "La condition de la boucle `while` (tant que) doit être l'inverse de ce qu'on cherche. On veut dépasser 50, on boucle donc tant que `u <= 50`." 
                },
                { q: "Si \\(u_n = 2n + 5\\), alors \\(u_0 =\\)", ans: "5", type: "input", expl: "\\(2(0)+5 = 5\\)." },
                { q: "Si \\(u_{n+1} = u_n + 3\\), quelle est la raison de cette suite arithmétique ?", ans: "3", type: "input", expl: "On ajoute 3 à chaque terme." },
                { q: "Calculer l'expression suivante : \\(u_1\\) si \\(u_0=10\\) et raison \\(r=-2\\).", ans: "8", type: "input", expl: "\\(10 - 2 = 8\\)." },
                { q: "La formule \\(u_n = u_0 + n \\times r\\) est-elle la formule explicite d'une suite arithmétique ?", ans: "vrai", type: "mcq", opts: ["vrai", "faux"], expl: "Formule explicite." },
                { q: "Calculer l'expression suivante : la somme des trois premiers termes de la suite 1, 2, 3..", ans: "6", type: "input", expl: "\\(1+2+3 = 6\\)." },
                { q: "Si \\(u_5 = 10\\) et \\(r=2\\), alors \\(u_6 =\\)", ans: "12", type: "input", expl: "\\(10+2=12\\)." },
                { q: "La suite \\(u_n = 5-n\\) est-elle arithmétique ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "De raison -1." },
                { q: "Si \\(r > 0\\), la suite arithmétique est :", ans: "croissante", type: "mcq", opts: ["croissante", "décroissante"], expl: "Propriété du cours." },
                { q: "Calculer l'expression suivante : \\(u_{10}\\) si \\(u_n = 3n\\).", ans: "30", type: "input", expl: "\\(3 \\times 10 = 30\\)." },
                { q: "Quelle est la raison de la suite 2, 5, 8, 11... ?", ans: "3", type: "input", expl: "Différence constante." },
                { q: "Calculer l'expression suivante : \\(u_2\\) si \\(u_0=0\\) et \\(r=5\\).", ans: "10", type: "input", expl: "\\(0 + 2 \\times 5 = 10\\)." },
                { q: "Une suite arithmétique de raison 0 est :", ans: "constante", type: "input", expl: "Les termes ne changent pas." },
                { q: "Si \\(u_n = 4n-1\\), alors \\(u_1 =\\)", ans: "3", type: "input", expl: "\\(4(1)-1 = 3\\)." },
                { q: "Si \\(u_1=10\\) et \\(u_2=15\\), alors \\(r=\\)", ans: "5", type: "input", expl: "\\(15-10=5\\)." },
                { q: "Quel est le terme suivant dans la suite logique : 1, 3, 5, 7 ?", ans: "9", type: "input", expl: "Suite des nombres impairs." },
                { q: "Si \\(u_n = u_0 + nr\\), alors \\(u_{10} = u_0 + ...\\)", ans: "10r", type: "input", expl: "Application de la formule." },
                { q: "Quelle est la raison de la suite 10, 7, 4, 1... ?", ans: "-3", type: "input", expl: "Soustraction constante." },
                { q: "Si \\(u_0=1\\) et \\(r=1\\), alors \\(u_{100}=\\)", ans: "101", type: "input", expl: "\\(1+100=101\\)." },
                { q: "Une suite arithmétique est représentée par des points :", ans: "alignés", type: "input", expl: "Sur une droite." },
                { q: "Si \\(u_n = 2n\\), la suite est-elle arithmétique ?", ans: "oui", type: "input", expl: "De raison 2." },
                { q: "La somme 1+2+3+...+n est égale à :", ans: "n(n+1)/2", type: "input", expl: "Formule de Gauss." },
                { q: "Si \\(r < 0\\), la suite est :", ans: "décroissante", type: "input", expl: "Les termes diminuent." },
                { q: "Quelle est la raison de la suite \\(u_n = 5-2n\\) : ?", ans: "-2", type: "input", expl: "Coefficient de n." },
                { q: "Si \\(u_1=5\\) et \\(u_3=15\\) (arith.), alors \\(u_2=\\)", ans: "10", type: "input", expl: "Moyenne arithmétique." },
                { q: "La suite \\((u_n)\\) définie par \\(u_n = n^2\\) est-elle arithmétique ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "La différence \\(u_{n+1}-u_n = 2n+1\\) n'est pas constante." },
                { q: "Si \\(u_0=0\\) et \\(r=0.5\\), alors \\(u_4=\\)", ans: "2", type: "input", expl: "\\(0 + 4 \\times 0.5 = 2\\)." },
                { q: "Quelle est la raison de la suite arithmétique : 1 ; 1,1 ; 1,2 ; 1,3 ... ?", ans: "0.1", type: "input", expl: "Ajout constant." },
                { q: "Si \\(u_{n+1}-u_n = 5\\), la suite est arithmétique ?", ans: "oui", type: "input", expl: "Différence constante." },
                { q: "Le terme \\(u_{n+1}\\) d'une suite arithmétique dépend de :", ans: "u_n", type: "input", expl: "Relation de récurrence." },
                {
                    id: "dyn_suite_arith",
                    type: "input",
                    generate: function() {
                        let u0 = Math.floor(Math.random()*10)+1;
                        let r = Math.floor(Math.random()*7)+2;
                        let n = Math.floor(Math.random()*4)+2;
                        let un = u0 + n * r;
                        return {
                            q: "Soit \\(u_n\\) une suite arithmétique. Si \\(u_0 = " + u0 + "\\) et \\(r = " + r + "\\), alors \\(u_" + n + " =\\)",
                            ans: un.toString(),
                            expl: "\\(u_n = u_0 + n \\times r\\) donc \\(" + u0 + " + " + n + " \\times " + r + " = " + un + "\\)."
                        };
                    },
                },
            ]},
            { id: 'geom', name: "Suites Géométriques", questions: [
                { q: "Si \\(u_{n+1} = 2u_n\\), quelle est la raison de cette suite géométrique ?", ans: "2", type: "input", expl: "On multiplie par 2." },
                {
                    id: "dyn_suite_geom",
                    type: "input",
                    generate: function() {
                        let u0 = Math.floor(Math.random()*5)+2;
                        let q = Math.floor(Math.random()*4)+2;
                        let n = Math.floor(Math.random()*3)+1;
                        let un = u0 * Math.pow(q, n);
                        return {
                            q: "Soit \\(u_n\\) une suite géométrique. Si \\(u_0 = " + u0 + "\\) et \\(q = " + q + "\\), alors \\(u_" + n + " =\\)",
                            ans: un.toString(),
                            expl: "\\(u_n = u_0 \\times q^n\\) donc \\(" + u0 + " \\times " + q + "^" + n + " = " + un + "\\)."
                        };
                    },
                },
                { q: "Calculer l'expression suivante : \\(u_2\\) si \\(u_0=1\\) et \\(q=10\\).", ans: "100", type: "input", expl: "\\(1 \\times 10^2 = 100\\)." },
                { q: "La suite \\(u_n = 3^n\\) est-elle géométrique ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "De raison 3." },
                { q: "Si \\(u_n = u_0 \\times q^n\\), alors \\(u_0 = 5\\) et \\(q=2\\) donne \\(u_3=\\)", ans: "40", type: "input", expl: "\\(5 \\times 2^3 = 5 \\times 8 = 40\\)." },
                { q: "Si \\(q > 1\\) et \\(u_0 > 0\\), la suite est :", ans: "croissante", type: "mcq", opts: ["croissante", "décroissante"], expl: "Propriété du cours." },
                { q: "Quelle est la raison de la suite 1, 10, 100, 1000... ?", ans: "10", type: "input", expl: "Rapport constant." },
                { q: "Si \\(u_1=4\\) et \\(q=0.5\\), alors \\(u_2=\\)", ans: "2", type: "input", expl: "\\(4 \\times 0.5 = 2\\)." },
                { q: "Une suite géométrique de raison 1 est :", ans: "constante", type: "mcq", opts: ["constante", "croissante", "décroissante"], expl: "On multiplie par 1." },
                { q: "Si \\(q=0\\), tous les termes (sauf \\(u_0\\)) sont :", ans: "nuls", type: "input", expl: "Produit par 0." },
                { q: "Calculer l'expression suivante : \\(u_1\\) si \\(u_0=100\\) et \\(q=0.1\\).", ans: "10", type: "input", expl: "\\(100 \\times 0.1 = 10\\)." },
                { q: "Si \\(u_n = 2^n\\), alors \\(u_4 =\\)", ans: "16", type: "input", expl: "\\(2^4=16\\)." },
                { q: "Une hausse de 5% par an est une suite géométrique de raison :", ans: "1.05", type: "input", expl: "Hausse de 5% = x 1.05." },
                { q: "Si \\(u_1=3\\) et \\(u_2=9\\), alors \\(q=\\)", ans: "3", type: "input", expl: "\\(9/3=3\\)." },
                { q: "Quel est le terme suivant dans la suite logique : 1, 2, 4, 8 ?", ans: "16", type: "input", expl: "Puissances de 2." },
                { q: "Si \\(u_0=1\\) et \\(q=2\\), alors \\(u_{10}=\\)", ans: "1024", type: "input", expl: "\\(2^{10}=1024\\)." },
                { q: "Quelle est la raison de la suite 1, -1, 1, -1... ?", ans: "-1", type: "input", expl: "Multiplication par -1." },
                { q: "Si \\(u_n = 5 \\times 3^n\\), alors \\(u_0 =\\)", ans: "5", type: "input", expl: "Terme initial." },
                { q: "Une baisse de 10% par an est une suite géométrique de raison :", ans: "0.9", type: "input", expl: "CM = 0.9." },
                { q: "Si \\(q \\in ]0,1[\\) et \\(u_0 > 0\\), la suite est :", ans: "décroissante", type: "input", expl: "On multiplie par un nombre < 1." },
                { q: "Quelle est la raison de la suite géométrique : 100 ; 50 ; 25 ; 12,5 ... ?", ans: "0.5", type: "input", expl: "Division par 2." },
                { q: "Si \\(u_1=2\\) et \\(u_2=8\\), alors \\(q=\\)", ans: "4", type: "input", expl: "\\(8/2=4\\)." },
                { q: "Quel est le terme suivant dans la suite logique : 3, 9, 27 ?", ans: "81", type: "input", expl: "\\(3^4=81\\)." },
                { q: "Si \\(u_n = q^n\\) et \\(q=10\\), alors \\(u_3=\\)", ans: "1000", type: "input", expl: "\\(10^3=1000\\)." },
                { q: "Une suite géométrique de raison -1 est :", ans: "alternée", type: "mcq", opts: ["croissante", "décroissante", "alternée", "constante"], expl: "Change de signe à chaque terme." },
                { q: "Si \\(u_0=2\\) et \\(q=3\\), alors \\(u_2 =\\)", ans: "18", type: "input", expl: "\\(2 \\times 9 = 18\\)." },
                { q: "Quelle est la raison de la suite 2, 4, 8, 16... ?", ans: "2", type: "input", expl: "Doublement." },
                { q: "Une suite géométrique de raison 0.5 est :", ans: "décroissante", type: "input", expl: "Si \\(u_0 > 0\\)." },
                { q: "Si \\(u_1=1\\) et \\(u_0=2\\), alors \\(q=\\)", ans: "0.5", type: "input", expl: "\\(1/2 = 0.5\\)." },
                { q: "Quel est le terme suivant dans la suite logique : 5, 25, 125 ?", ans: "625", type: "input", expl: "\\(125 \\times 5 = 625\\)." },
                { q: "Si \\(u_n = 2 \\times 10^n\\), alors \\(u_2 =\\)", ans: "200", type: "input", expl: "\\(2 \\times 100 = 200\\)." },
                { q: "Si \\((u_n)\\) est une suite géométrique de premier terme \\(u_0\\) et de raison \\(q = 1\\), que vaut \\(u_{100}\\) ?", ans: "u_0", type: "mcq", opts: ["u_0", "u_1", "0", "1"], expl: "\\(u_{100} = u_0 \\times 1^{100} = u_0\\). La suite est constante." },
                { q: "Une suite géométrique est-elle liée à une fonction exponentielle ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "Croissance/décroissance multiplicative." },
                { q: "Si \\(u_n = 3^n\\), la suite est-elle croissante ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "Raison 3 > 1." },
                { q: "Calculer la valeur exacte de \\(u_1\\) si \\(u_0=4\\) et \\(q=-2\\).", ans: "-8", type: "input", expl: "\\(4 \\times -2 = -8\\)." },
                { q: "Si \\(q=0.5\\), la suite est-elle géométrique ?", ans: "oui", type: "input", expl: "Oui, raison 0.5." },
                { q: "Si \\(u_3=8\\) et \\(u_2=4\\), alors \\(q=\\)", ans: "2", type: "input", expl: "\\(8/4=2\\)." },
                { q: "Le premier terme d'une suite géométrique est noté :", ans: "u_0", type: "input", expl: "Convention usuelle." },
                { q: "Si \\(u_0=10\\) et \\(q=-1\\), alors \\(u_2=\\)", ans: "10", type: "input", expl: "\\(10 \\times (-1)^2 = 10\\)." }
            ]}
        ]
    }
,
    exponentielle: {
        name: "Fonction exponentielle",
        subtopics: [
            {
                name: "Définition et propriétés",
                questions: [
                    { q: "Quelle est la valeur de \\(e^0\\) ?", ans: "1", type: "input", expl: "Toute puissance nulle vaut 1." },
                    { q: "Quelle est la valeur exacte de \\(e^1\\) ?", ans: "e", type: "input", expl: "Par définition." },
                    { q: "La fonction \\(x \\mapsto e^x\\) est-elle croissante ou décroissante ?", ans: "croissante", type: "mcq", opts: ["croissante", "décroissante", "constante", "ni l'un ni l'autre"], expl: "L'exponentielle est strictement croissante sur \\(\\mathbb{R}\\)." },
                    { q: "Quel est l'ensemble de définition de la fonction \\(e^x\\) ?", ans: "R", type: "mcq", opts: ["R", "R*", "R+", "[0;+∞["], expl: "\\(e^x\\) est définie sur tout \\(\\mathbb{R}\\)." },
                    { q: "Quelle est la limite de \\(e^x\\) quand \\(x \\to +\\infty\\) ?", ans: "+infini", type: "mcq", opts: ["+infini", "-infini", "0", "1"], expl: "\\(e^x \\to +\\infty\\) quand \\(x \\to +\\infty\\)." },
                    { q: "Quelle est la limite de \\(e^x\\) quand \\(x \\to -\\infty\\) ?", ans: "0", type: "mcq", opts: ["0", "+infini", "-infini", "1"], expl: "\\(e^x \\to 0^+\\) quand \\(x \\to -\\infty\\)." },
                    { q: "La courbe de \\(e^x\\) coupe-t-elle l'axe des abscisses ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "\\(e^x > 0\\) pour tout \\(x\\), donc jamais nulle." },
                    { q: "Quelle est l'ordonnée à l'origine de \\(y = e^x\\) ?", ans: "1", type: "input", expl: "\\(e^0 = 1\\)." },
                    { q: "Simplifier \\(e^2 \\times e^3\\).", ans: "e^5", type: "input", expl: "\\(e^a \\times e^b = e^{a+b}\\)." },
                    { q: "Simplifier \\(\\dfrac{e^5}{e^2}\\).", ans: "e^3", type: "input", expl: "\\(\\dfrac{e^a}{e^b} = e^{a-b}\\)." },
                    { q: "Calculer \\((e^3)^2\\).", ans: "e^6", type: "input", expl: "\\((e^a)^b = e^{ab}\\)." },
                    { q: "Exprimer \\(\\dfrac{1}{e^3}\\) comme une puissance de \\(e\\).", ans: "e^{-3}", type: "input", expl: "\\(\\dfrac{1}{e^a} = e^{-a}\\)." },
                    { q: "Quelle est la dérivée de \\(e^x\\) ?", ans: "e^x", type: "input", expl: "La fonction exponentielle est sa propre dérivée." },
                    { q: "Quelle est la dérivée de \\(e^{2x}\\) ?", ans: "2e^{2x}", type: "mcq", opts: ["2e^{2x}", "e^{2x}", "2xe^{x}", "e^x"], expl: "Règle de la dérivée de \\(e^{u}\\) : \\(u' \\times e^u\\)." },
                    { q: "Résoudre \\(e^x = 1\\).", ans: "0", type: "input", expl: "\\(e^x = 1 \\Leftrightarrow x = 0\\)." },
                    { q: "Résoudre \\(e^x = e^3\\).", ans: "3", type: "input", expl: "L'exponentielle est injective : \\(e^x = e^a \\Rightarrow x = a\\)." },
                    { q: "Résoudre \\(e^{2x} = e^6\\).", ans: "3", type: "input", expl: "\\(2x = 6 \\Rightarrow x = 3\\)." },
                    { q: "Résoudre l'inéquation \\(e^x > 1\\).", ans: "x>0", type: "input", expl: "\\(e^x > e^0 \\Leftrightarrow x > 0\\) car \\(e^x\\) est croissante." }
                ]
            },
            {
                name: "Applications",
                questions: [
                    { q: "Quel est le signe de \\(e^x - 1\\) pour \\(x > 0\\) ?", ans: "positif", type: "mcq", opts: ["positif", "négatif", "nul"], expl: "\\(e^x > e^0 = 1\\) pour \\(x > 0\\)." },
                    { q: "La suite \\(u_n = e^n\\) est-elle croissante ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "\\(e > 1\\) donc \\(e^n\\) est croissante." },
                    { q: "Simplifier \\(e^{\\ln(3)}\\).", ans: "3", type: "input", expl: "\\(e^{\\ln(a)} = a\\) pour \\(a > 0\\)." },
                    { q: "Calculer \\(\\ln(e^5)\\).", ans: "5", type: "input", expl: "\\(\\ln(e^a) = a\\)." },
                    { q: "La dérivée de \\(f(x) = e^x + 3x\\) est :", ans: "e^x+3", type: "input", expl: "Dériver terme à terme." },
                    { q: "La dérivée de \\(f(x) = 2e^x - x^2\\) est :", ans: "2e^x-2x", type: "input", expl: "\\((2e^x)' = 2e^x\\) et \\((x^2)' = 2x\\)." },
                    { q: "Simplifier \\(e^x \\times e^{-x}\\).", ans: "1", type: "input", expl: "\\(e^{x + (-x)} = e^0 = 1\\)." },
                    { q: "En quelle valeur de \\(x\\) la tangente à \\(e^x\\) est-elle parallèle à la droite \\(y = e^2 x\\) ?", ans: "2", type: "input", expl: "\\(f'(x) = e^x = e^2 \\Rightarrow x = 2\\)." }
                ]
            }
        ]
    },

    proba_conditionnelles: {
        name: "Probabilités conditionnelles",
        subtopics: [
            {
                name: "Définition et calcul",
                questions: [
                    { q: "Quelle est la formule de la probabilité conditionnelle de \\(A\\) sachant \\(B\\) ?", ans: "P(A∩B)/P(B)", type: "mcq", opts: ["P(A∩B)/P(B)", "P(A)×P(B)", "P(A∪B)-P(B)", "P(B)/P(A)"], expl: "\\(P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}\\)." },
                    { q: "Si \\(P(A \\cap B) = 0.12\\) et \\(P(B) = 0.4\\), calculer \\(P(A|B)\\).", ans: "0.3", type: "input", expl: "\\(0.12 / 0.4 = 0.3\\)." },
                    { q: "Si \\(A\\) et \\(B\\) sont indépendants, que vaut \\(P(A|B)\\) ?", ans: "P(A)", type: "mcq", opts: ["P(A)", "P(B)", "P(A)×P(B)", "1"], expl: "L'indépendance signifie que \\(B\\) n'influe pas sur \\(A\\)." },
                    { q: "Si \\(P(A|B) = 0.6\\) et \\(P(B) = 0.5\\), calculer \\(P(A \\cap B)\\).", ans: "0.3", type: "input", expl: "\\(P(A \\cap B) = P(A|B) \\times P(B) = 0.6 \\times 0.5 = 0.3\\)." },
                    { q: "La probabilité \\(P(B|A)\\) est-elle toujours égale à \\(P(A|B)\\) ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "En général \\(P(A|B) \\neq P(B|A)\\)." },
                    { q: "Sur un arbre de probabilités, la probabilité d'une branche est :", ans: "P(A∩B)", type: "mcq", opts: ["P(A∩B)", "P(A|B)", "P(A)+P(B)", "P(A∪B)"], expl: "On multiplie les probabilités le long des branches pour obtenir \\(P(A \\cap B)\\)." },
                    { q: "Quelle est la formule des probabilités totales pour deux événements \\(B\\) et \\(\\bar{B}\\) ?", ans: "P(A)=P(A|B)P(B)+P(A|B̄)P(B̄)", type: "mcq", opts: ["P(A)=P(A|B)P(B)+P(A|B̄)P(B̄)", "P(A)=P(A|B)+P(A|B̄)", "P(A)=P(B)+P(B̄)", "P(A)=P(A∩B)+P(B)"], expl: "Formule des probabilités totales : partition \\(\\{B, \\bar{B}\\}\\)." },
                    { q: "Dans une urne : 3 rouges et 7 bleues. On tire 2 sans remise. Quelle est la probabilité que la 2e soit rouge sachant que la 1re l'est ?", ans: "2/9", type: "mcq", opts: ["2/9", "3/10", "1/3", "3/9"], expl: "Après avoir tiré 1 rouge, il reste 2 rouges sur 9 billes." }
                ]
            },
            {
                name: "Indépendance et applications",
                questions: [
                    { q: "\\(A\\) et \\(B\\) sont indépendants si et seulement si :", ans: "P(A∩B)=P(A)P(B)", type: "mcq", opts: ["P(A∩B)=P(A)P(B)", "P(A∩B)=0", "P(A|B)=P(B)", "P(A∪B)=1"], expl: "Définition de l'indépendance." },
                    { q: "Si \\(P(A) = 0.3\\), \\(P(B) = 0.4\\) et \\(A\\) et \\(B\\) sont indépendants, calculer \\(P(A \\cap B)\\).", ans: "0.12", type: "input", expl: "\\(0.3 \\times 0.4 = 0.12\\)." },
                    { q: "Si \\(P(A) = 0.5\\), \\(P(B) = 0.5\\) et \\(P(A \\cap B) = 0.25\\), \\(A\\) et \\(B\\) sont-ils indépendants ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "\\(P(A) \\times P(B) = 0.25 = P(A \\cap B)\\). Oui." },
                    { q: "Si \\(P(A) = 0.6\\), \\(P(B) = 0.5\\) et \\(P(A \\cap B) = 0.3\\), \\(A\\) et \\(B\\) sont-ils indépendants ?", ans: "oui", type: "mcq", opts: ["oui", "non"], expl: "\\(0.6 \\times 0.5 = 0.3 = P(A \\cap B)\\)." },
                    { q: "Calculer \\(P(A|B)\\) si \\(P(A) = 0.4\\), \\(P(B) = 0.5\\) et \\(P(A \\cap B) = 0.2\\).", ans: "0.4", type: "input", expl: "\\(0.2 / 0.5 = 0.4\\). On retrouve \\(P(A)\\) : indépendance." },
                    { q: "On lance deux dés équilibrés. Quelle est la probabilité d'obtenir deux 6 ?", ans: "1/36", type: "input", expl: "Tirages indépendants : \\(\\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}\\)." },
                    { q: "On tire une carte dans un jeu de 32. Sachant qu'elle est rouge, quelle est la probabilité que ce soit un As ?", ans: "2/16", type: "mcq", opts: ["2/16", "4/32", "1/4", "1/8"], expl: "16 cartes rouges dont 2 As rouges : \\(P = 2/16 = 1/8\\)." },
                    { q: "Que vaut \\(P(\\bar{A}|B)\\), la probabilité de l'événement contraire de \\(A\\) sachant \\(B\\) ?", ans: "1-P(A|B)", type: "mcq", opts: ["1-P(A|B)", "1-P(A)", "P(A|B)", "P(B|A)"], expl: "L'événement contraire, sachant \\(B\\), a pour probabilité \\(1 - P(A|B)\\)." }
                ]
            }
        ]
    },

    geometrie_vecteurs: {
        name: "Géométrie — Vecteurs et droites",
        subtopics: [
            {
                name: "Vecteurs",
                questions: [
                    { q: "Quelles sont les coordonnées du vecteur \\(\\overrightarrow{AB}\\) si \\(A(1,2)\\) et \\(B(4,6)\\) ?", ans: "(3;4)", type: "mcq", opts: ["(3;4)", "(5;8)", "(-3;-4)", "(2;4)"], expl: "\\(\\overrightarrow{AB} = (x_B - x_A ; y_B - y_A) = (3;4)\\)." },
                    { q: "Quelle est la norme du vecteur \\(\\vec{u}(3,4)\\) ?", ans: "5", type: "input", expl: "\\(\\|\\vec{u}\\| = \\sqrt{3^2+4^2} = \\sqrt{25} = 5\\)." },
                    { q: "Calculer la norme du vecteur \\(\\vec{v}(5,12)\\).", ans: "13", type: "input", expl: "\\(\\sqrt{25+144} = \\sqrt{169} = 13\\)." },
                    { q: "Si \\(\\vec{u}(2,3)\\) et \\(\\vec{v}(1,-1)\\), calculer \\(\\vec{u} + \\vec{v}\\).", ans: "(3;2)", type: "mcq", opts: ["(3;2)", "(1;4)", "(2;3)", "(3;-2)"], expl: "Coordonnées : \\((2+1 ; 3-1) = (3;2)\\)." },
                    { q: "Calculer \\(2\\vec{u}\\) si \\(\\vec{u}(3,-1)\\).", ans: "(6;-2)", type: "mcq", opts: ["(6;-2)", "(5;1)", "(3;-1)", "(6;1)"], expl: "On multiplie chaque coordonnée par 2." },
                    { q: "Deux vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires si et seulement si :", ans: "x₁y₂-x₂y₁=0", type: "mcq", opts: ["x₁y₂-x₂y₁=0", "x₁y₂+x₂y₁=0", "x₁=x₂", "y₁=y₂"], expl: "Le déterminant \\(x_1 y_2 - x_2 y_1 = 0\\) traduit la colinéarité." },
                    { q: "Le vecteur \\(\\overrightarrow{AB}\\) a-t-il le même sens que \\(\\overrightarrow{BA}\\) ?", ans: "non", type: "mcq", opts: ["oui", "non"], expl: "\\(\\overrightarrow{BA} = -\\overrightarrow{AB}\\) : sens opposé." },
                    { q: "Quelle est la relation de Chasles entre \\(\\overrightarrow{AC}\\), \\(\\overrightarrow{AB}\\) et \\(\\overrightarrow{BC}\\) ?", ans: "AC=AB+BC", type: "mcq", opts: ["AC=AB+BC", "AC=AB-BC", "AC=AB×BC", "AC=BC-AB"], expl: "Relation de Chasles : \\(\\overrightarrow{AC} = \\overrightarrow{AB} + \\overrightarrow{BC}\\)." }
                ]
            },
            {
                name: "Produit scalaire",
                questions: [
                    { q: "Quelle est la formule du produit scalaire \\(\\vec{u} \\cdot \\vec{v}\\) avec \\(\\vec{u}(x_1,y_1)\\) et \\(\\vec{v}(x_2,y_2)\\) ?", ans: "x₁x₂+y₁y₂", type: "mcq", opts: ["x₁x₂+y₁y₂", "x₁y₁+x₂y₂", "x₁y₂-x₂y₁", "x₁x₂-y₁y₂"], expl: "\\(\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2\\)." },
                    { q: "Calculer \\(\\vec{u} \\cdot \\vec{v}\\) si \\(\\vec{u}(2,3)\\) et \\(\\vec{v}(1,4)\\).", ans: "14", type: "input", expl: "\\(2 \\times 1 + 3 \\times 4 = 2 + 12 = 14\\)." },
                    { q: "Deux vecteurs sont orthogonaux si et seulement si :", ans: "u·v=0", type: "mcq", opts: ["u·v=0", "u·v=1", "‖u‖=‖v‖", "u·v<0"], expl: "Le produit scalaire est nul pour des vecteurs orthogonaux." },
                    { q: "Calculer \\(\\vec{u} \\cdot \\vec{v}\\) si \\(\\vec{u}(1,-2)\\) et \\(\\vec{v}(4,2)\\).", ans: "0", type: "input", expl: "\\(1 \\times 4 + (-2) \\times 2 = 4 - 4 = 0\\). Vecteurs orthogonaux." },
                    { q: "Quelle est la formule du produit scalaire avec l'angle \\(\\theta\\) entre \\(\\vec{u}\\) et \\(\\vec{v}\\) ?", ans: "‖u‖‖v‖cos(θ)", type: "mcq", opts: ["‖u‖‖v‖cos(θ)", "‖u‖‖v‖sin(θ)", "‖u‖+‖v‖", "‖u‖×‖v‖"], expl: "\\(\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\|\\vec{v}\\| \\cos(\\theta)\\)." },
                    { q: "Si \\(\\vec{u} \\cdot \\vec{v} = 0\\), quel est l'angle entre les deux vecteurs ?", ans: "90", type: "input", expl: "\\(\\cos(\\theta) = 0 \\Rightarrow \\theta = 90°\\)." },
                    { q: "Calculer \\(\\vec{u} \\cdot \\vec{v}\\) si \\(\\|\\vec{u}\\| = 3\\), \\(\\|\\vec{v}\\| = 4\\) et l'angle vaut \\(60°\\).", ans: "6", type: "input", expl: "\\(3 \\times 4 \\times \\cos(60°) = 12 \\times 0.5 = 6\\)." },
                    { q: "La norme \\(\\|\\vec{u}\\|^2\\) est égale à :", ans: "u·u", type: "mcq", opts: ["u·u", "u+u", "2u", "u²"], expl: "\\(\\|\\vec{u}\\|^2 = \\vec{u} \\cdot \\vec{u} = x^2 + y^2\\)." }
                ]
            },
            {
                name: "Équation de droite",
                questions: [
                    { q: "Quelle est la forme générale de l'équation cartésienne d'une droite dans le plan ?", ans: "ax+by+c=0", type: "mcq", opts: ["ax+by+c=0", "y=ax+b", "ax+b=0", "x/a+y/b=0"], expl: "Forme générale : \\(ax + by + c = 0\\) avec \\((a,b) \\neq (0,0)\\)." },
                    { q: "Un vecteur normal à la droite \\(2x - 3y + 1 = 0\\) est :", ans: "(2;-3)", type: "mcq", opts: ["(2;-3)", "(-3;2)", "(2;3)", "(3;2)"], expl: "Pour \\(ax+by+c=0\\), le vecteur normal est \\((a;b)\\)." },
                    { q: "Un vecteur directeur de la droite \\(2x - 3y + 1 = 0\\) est :", ans: "(3;2)", type: "mcq", opts: ["(3;2)", "(2;-3)", "(2;3)", "(-3;2)"], expl: "Le vecteur directeur est perpendiculaire au vecteur normal \\((2;-3)\\) : on prend \\((3;2)\\)." },
                    { q: "Quelle est l'équation de la droite passant par \\(A(0,2)\\) avec une pente de 3 ?", ans: "y=3x+2", type: "input", expl: "Forme \\(y = 3x + 2\\)." },
                    { q: "Calculer la distance du point \\(P(1,2)\\) à la droite \\(3x + 4y - 5 = 0\\).", ans: "6/5", type: "input", expl: "\\(d = \\dfrac{|3 \\times 1 + 4 \\times 2 - 5|}{\\sqrt{9+16}} = \\dfrac{|6|}{5} = \\dfrac{6}{5}\\).", },
                    { q: "Deux droites sont parallèles si leurs vecteurs directeurs sont :", ans: "colinéaires", type: "mcq", opts: ["colinéaires", "orthogonaux", "de même norme", "opposés"], expl: "Deux droites sont parallèles \\(\\iff\\) leurs vecteurs directeurs sont colinéaires." },
                    { q: "Deux droites sont perpendiculaires si leurs vecteurs directeurs ont un produit scalaire :", ans: "nul", type: "mcq", opts: ["nul", "égal à 1", "positif", "négatif"], expl: "Perpendiculaire \\(\\iff\\) produit scalaire = 0." }
                ]
            }
        ]
    },



    style_mathalea: {
        name: "QCM Mixtes — Style MathALÉA",
        subtopics: [
            {
                name: "Proportions & Évolutions",
                questions: [
                    {
                        id: "dyn_ma_cm_hausse",
                        type: "mcq",
                        generate: function() {
                            var tauxList = [5,8,10,12,15,20,25,30];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var cm = (1 + t/100);
                            var cmStr = cm.toFixed(cm % 1 === 0 ? 0 : (Number.isInteger(cm*10) ? 1 : 2));
                            var wrong1 = (t/100).toFixed(Number.isInteger(t/10) ? 1 : 2);
                            var wrong2 = (1 - t/100).toFixed(Number.isInteger((1-t/100)*10) ? 1 : 2);
                            var wrong3 = (1 + t/100 + 0.1).toFixed(1);
                            var opts = [cmStr, wrong1, wrong2, wrong3];
                            // shuffle
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Quel est le coefficient multiplicateur correspondant à une hausse de \\(" + t + "\\%\\) ?",
                                ans: cmStr,
                                opts: opts,
                                expl: "Hausse de \\(" + t + "\\%\\) → CM \\(= 1 + \\frac{" + t + "}{100} = " + cmStr + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_cm_baisse",
                        type: "mcq",
                        generate: function() {
                            var tauxList = [5,10,15,20,25,30,40,50];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var cm = (1 - t/100);
                            var cmStr = cm.toFixed(Number.isInteger(cm*10) ? 1 : 2);
                            var wrong1 = (1 + t/100).toFixed(Number.isInteger((1+t/100)*10) ? 1 : 2);
                            var wrong2 = (t/100).toFixed(Number.isInteger(t/10) ? 1 : 2);
                            var wrong3 = (cm + 0.1).toFixed(1);
                            // Éviter les doublons (ex: t=50 → wrong2 = cm = 0.5)
                            if (wrong2 === cmStr || wrong2 === wrong1) wrong2 = (cm - 0.05 > 0 ? cm - 0.05 : cm + 0.15).toFixed(2);
                            if (wrong3 === cmStr || wrong3 === wrong1 || wrong3 === wrong2) wrong3 = (cm + 0.2).toFixed(1);
                            var opts = [cmStr, wrong1, wrong2, wrong3];
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Diminuer une quantité de \\(" + t + "\\%\\) revient à la multiplier par :",
                                ans: cmStr,
                                opts: opts,
                                expl: "Baisse de \\(" + t + "\\%\\) → CM \\(= 1 - \\frac{" + t + "}{100} = " + cmStr + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_nouveau_prix",
                        type: "mcq",
                        generate: function() {
                            var prixList = [40,50,60,80,100,120,150,200];
                            var tauxList = [5,10,15,20,25];
                            var p = prixList[Math.floor(Math.random()*prixList.length)];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var hausse = Math.random() < 0.5;
                            var nouveauPrix = hausse ? p * (1 + t/100) : p * (1 - t/100);
                            var npStr = nouveauPrix % 1 === 0 ? nouveauPrix.toString() : nouveauPrix.toFixed(2);
                            var w1 = (p + p*t/100 + 5).toString();
                            var w2 = hausse ? (p - p*t/100).toFixed(nouveauPrix % 1 !== 0 ? 2 : 0) : (p + p*t/100).toFixed(nouveauPrix % 1 !== 0 ? 2 : 0);
                            var w3 = (parseFloat(npStr) + 10).toString();
                            // Éviter les doublons entre distracteurs
                            var seen = new Set([npStr]);
                            var alternatives = [p.toString(), w1, w2, w3, (parseFloat(npStr)+15).toString(), (parseFloat(npStr)-5).toString()];
                            var uniqueDistractors = [];
                            alternatives.forEach(function(v) { if (!seen.has(v)) { seen.add(v); uniqueDistractors.push(v); } });
                            while (uniqueDistractors.length < 3) { uniqueDistractors.push((parseFloat(npStr) + uniqueDistractors.length * 7 + 3).toString()); }
                            var opts = [npStr, uniqueDistractors[0], uniqueDistractors[1], uniqueDistractors[2]];
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Un article coûte \\(" + p + "\\) €. Après une " + (hausse ? "hausse" : "baisse") + " de \\(" + t + "\\%\\), son nouveau prix est :",
                                ans: npStr,
                                opts: opts,
                                expl: "CM \\(= " + (hausse ? "1+" : "1-") + t + "/100 = " + (hausse ? 1+t/100 : 1-t/100) + "\\). Nouveau prix \\(= " + p + " \\times " + (hausse ? 1+t/100 : 1-t/100) + " = " + npStr + "\\) €."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_evol_reciproque",
                        type: "mcq",
                        generate: function() {
                            var tauxList = [10,20,25,50];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var cm = 1 + t/100;
                            // réciproque : 1/cm - 1 en %
                            var recip = ((1/cm - 1)*100);
                            var recipRound = Math.round(recip * 100) / 100;
                            // format to max 2 decimals
                            var recipStr = Number.isInteger(recipRound) ? recipRound.toString() : recipRound.toFixed(2);
                            var ansStr = recipStr + "%";
                            var w1 = "-" + t + "%";
                            var w2 = "+" + t + "%";
                            var w3 = "-" + (t+5) + "%";
                            var opts = [ansStr, w1, w2, w3];
                            if (ansStr === w1) { w1 = "-" + (t+2) + "%"; opts = [ansStr, w1, w2, w3]; }
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Un prix a augmenté de \\(" + t + "\\%\\). Quelle baisse (en %) ramènerait au prix initial ?",
                                ans: ansStr,
                                opts: opts,
                                expl: "CM \\(= " + cm + "\\). L'évolution réciproque est \\(\\frac{1}{" + cm + "} - 1 \\approx " + recipStr + "\\%\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_deux_evol",
                        type: "mcq",
                        generate: function() {
                            var tauxList = [5,10,20];
                            var t1 = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var t2 = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var cm1 = 1 + t1/100;
                            var cm2 = 1 + t2/100;
                            var cmGlobal = cm1 * cm2;
                            var tauxGlobal = Math.round((cmGlobal - 1) * 10000) / 100;
                            var tauxGlobalStr = tauxGlobal % 1 === 0 ? tauxGlobal.toString() : tauxGlobal.toFixed(2);
                            var ansStr = tauxGlobalStr + "%";
                            var wrong1 = (t1+t2) + "%";
                            var wrong2 = (t1+t2+2) + "%";
                            var wrong3 = (t1*t2/100).toFixed(2) + "%";
                            var opts = [ansStr, wrong1, wrong2, wrong3];
                            // deduplicate
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((t1+t2-1) + "%");
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Un prix augmente de \\(" + t1 + "\\%\\) puis de \\(" + t2 + "\\%\\). Quelle est l'évolution globale ?",
                                ans: ansStr,
                                opts: opts,
                                expl: "CM global \\(= " + cm1 + " \times " + cm2 + " = " + cmGlobal.toFixed(4) + "\\). Taux \\(= +" + tauxGlobalStr + "\\%\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_taux_vers_cm",
                        type: "input",
                        generate: function() {
                            var tauxList = [2,3,5,8,10,12,15,25,30,40,50];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var hausse = Math.random() < 0.5;
                            var cm = hausse ? 1 + t/100 : 1 - t/100;
                            var cmStr = cm.toFixed(Number.isInteger(cm*100) && !Number.isInteger(cm*10) ? 2 : (Number.isInteger(cm*10) ? 1 : 2));
                            return {
                                q: "Donner le coefficient multiplicateur correspondant à une " + (hausse ? "hausse" : "baisse") + " de \\(" + t + "\\%\\).",
                                ans: cmStr,
                                expl: "CM \\(= 1 " + (hausse ? "+" : "-") + " \\frac{" + t + "}{100} = " + cmStr + "\\)."
                            };
                        }
                    }
                ]
            },
            {
                name: "Fonctions",
                questions: [
                    {
                        id: "dyn_ma_image_affine",
                        type: "mcq",
                        generate: function() {
                            var a = Math.floor(Math.random()*6)+1;
                            if (Math.random()<0.3) a = -a;
                            var b = Math.floor(Math.random()*10)-5;
                            var k = Math.floor(Math.random()*8)-3;
                            var val = a*k + b;
                            var w1 = val+1; var w2 = val-1; var w3 = a*k;
                            var opts = [val.toString(), w1.toString(), w2.toString(), w3.toString()];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((val+2).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            var bStr = b >= 0 ? "+ " + b : "- " + Math.abs(b);
                            var aDisp = (a===1?"":a===-1?"-":String(a));
                            return {
                                q: "Soit \\(f(x) = " + aDisp + "x " + bStr + "\\). Calculer \\(f(" + k + ")\\).",
                                ans: val.toString(),
                                opts: opts,
                                expl: "\\(f(" + k + ") = " + (a===1?"":a===-1?"-":a+"\\times ") + k + " " + bStr + " = " + (a*k) + " " + bStr + " = " + val + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_image_quad",
                        type: "mcq",
                        generate: function() {
                            var a = Math.floor(Math.random()*4)+1;
                            if (Math.random()<0.3) a = -a;
                            var b = Math.floor(Math.random()*10)-4;
                            var k = Math.floor(Math.random()*5)-2;
                            var val = a*k*k + b;
                            var w1 = a*k + b; var w2 = val + a; var w3 = val - 2*a;
                            var opts = [val.toString(), w1.toString(), w2.toString(), w3.toString()];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((val+3).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            var bStr = b >= 0 ? "+ " + b : "- " + Math.abs(b);
                            var aDisp2 = (a===1?"":a===-1?"-":String(a));
                            return {
                                q: "Soit \\(f(x) = " + aDisp2 + "x^2 " + bStr + "\\). Calculer \\(f(" + k + ")\\).",
                                ans: val.toString(),
                                opts: opts,
                                expl: "\\(f(" + k + ") = " + (a===1?"":a===-1?"-":a+"\\times ") + k + "^2 " + bStr + " = " + (a===1?"":a===-1?"-":a+"\\times ") + (k*k) + " " + bStr + " = " + val + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_antecedent",
                        type: "mcq",
                        generate: function() {
                            var a = (Math.floor(Math.random()*5)+1) * (Math.random()<0.5 ? 1 : -1);
                            var b = Math.floor(Math.random()*10)-5;
                            var img = Math.floor(Math.random()*10)-5;
                            // f(x) = img ⟹ ax+b = img ⟹ x = (img-b)/a
                            var x = (img - b) / a;
                            var xStr = Number.isInteger(x) ? x.toString() : (Math.round(x*100)/100).toString();
                            var w1 = (x+1).toString(); var w2 = (x-1).toString(); var w3 = ((img-b)/(-a)).toString();
                            var opts = [xStr, w1, w2, w3];
                            opts = opts.filter(function(v,i,arr){ return arr.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((parseFloat(xStr)+2).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            var bStr = b >= 0 ? "+ " + b : "- " + Math.abs(b);
                            var aDisp3 = (a===1?"":a===-1?"-":String(a));
                            return {
                                q: "Soit \\(f(x) = " + aDisp3 + "x " + bStr + "\\). Quel est l'antécédent de \\(" + img + "\\) par \\(f\\) ?",
                                ans: xStr,
                                opts: opts,
                                expl: "Résoudre \\(" + aDisp3 + "x " + bStr + " = " + img + "\\) \\(\\Rightarrow x = \\frac{" + (img-b) + "}{" + a + "} = " + xStr + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_sens_variation",
                        type: "mcq",
                        generate: function() {
                            var a = (Math.floor(Math.random()*5)+1) * (Math.random()<0.5 ? 1 : -1);
                            var b = Math.floor(Math.random()*10)-5;
                            var sens = a > 0 ? "croissante" : "décroissante";
                            var bStr = b >= 0 ? "+ " + b : "- " + Math.abs(b);
                            var aDisp4 = (a===1?"":a===-1?"-":String(a));
                            return {
                                q: "La fonction \\(f(x) = " + aDisp4 + "x " + bStr + "\\) est :",
                                ans: sens,
                                opts: ["croissante", "décroissante", "constante", "ni croissante ni décroissante"],
                                expl: "Le coefficient directeur \\(a = " + a + "\\) est " + (a>0 ? "positif" : "négatif") + " donc \\(f\\) est " + sens + "."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_signe_affine",
                        type: "mcq",
                        generate: function() {
                            // f(x) = a(x - r), racine r
                            var a = (Math.floor(Math.random()*4)+1) * (Math.random()<0.5 ? 1 : -1);
                            var r = Math.floor(Math.random()*7)-3;
                            // f(x) > 0 pour x > r si a > 0, x < r si a < 0
                            var ans, expl;
                            if (a > 0) {
                                ans = "x > " + r;
                                expl = "\\(f(x) = " + a + "(x - " + r + ")\\) avec \\(a > 0\\) : positif pour \\(x > " + r + "\\).";
                            } else {
                                ans = "x < " + r;
                                expl = "\\(f(x) = " + a + "(x - " + r + ")\\) avec \\(a < 0\\) : positif pour \\(x < " + r + "\\).";
                            }
                            var bVal = -a * r;
                            var bStr = bVal >= 0 ? "+ " + bVal : "- " + Math.abs(bVal);
                            var opts = ["x > " + r, "x < " + r, "x > " + (r+1), "x < " + (r-1)];
                            opts = opts.filter(function(v,i,arr){ return arr.indexOf(v)===i; });
                            while (opts.length < 4) opts.push("x = " + r);
                            return {
                                q: "Pour quelles valeurs de \\(x\\) a-t-on \\(f(x) > 0\\) si \\(f(x) = " + (a===1?"":a===-1?"-":a) + "x " + bStr + "\\) ?",
                                ans: ans,
                                opts: opts,
                                expl: expl
                            };
                        }
                    }
                ]
            },
            {
                name: "Calcul & Algèbre",
                questions: [
                    {
                        id: "dyn_ma_puissance_neg",
                        type: "mcq",
                        generate: function() {
                            var n = Math.floor(Math.random()*8)+1;
                            var k = Math.floor(Math.random()*4)+1;
                            var exp = n + k;
                            var val = (exp % 2 === 0) ? 1 : -1;
                            var valStr = val.toString();
                            return {
                                q: "Calculer \\((-1)^{" + exp + "}\\).",
                                ans: valStr,
                                opts: ["1", "-1"],
                                expl: "\\(" + exp + "\\) est " + (exp%2===0 ? "pair" : "impair") + " donc \\((-1)^{" + exp + "} = " + valStr + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_classer_fractions",
                        type: "mcq",
                        generate: function() {
                            // Generate 3 fractions, sort them
                            var fracs = [];
                            var used = [];
                            while (fracs.length < 3) {
                                var num = Math.floor(Math.random()*7)+1;
                                var den = Math.floor(Math.random()*5)+2;
                                var val = num/den;
                                if (used.indexOf(Math.round(val*1000)) === -1) {
                                    fracs.push({num: num, den: den, val: val});
                                    used.push(Math.round(val*1000));
                                }
                            }
                            fracs.sort(function(a,b){ return a.val-b.val; });
                            var f = fracs;
                            var ansStr = "\\(\\frac{" + f[0].num + "}{" + f[0].den + "} < \\frac{" + f[1].num + "}{" + f[1].den + "} < \\frac{" + f[2].num + "}{" + f[2].den + "}\\)";
                            var w1 = "\\(\\frac{" + f[2].num + "}{" + f[2].den + "} < \\frac{" + f[1].num + "}{" + f[1].den + "} < \\frac{" + f[0].num + "}{" + f[0].den + "}\\)";
                            var w2 = "\\(\\frac{" + f[1].num + "}{" + f[1].den + "} < \\frac{" + f[0].num + "}{" + f[0].den + "} < \\frac{" + f[2].num + "}{" + f[2].den + "}\\)";
                            var w3 = "\\(\\frac{" + f[0].num + "}{" + f[0].den + "} < \\frac{" + f[2].num + "}{" + f[2].den + "} < \\frac{" + f[1].num + "}{" + f[1].den + "}\\)";
                            var opts = [ansStr, w1, w2, w3];
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Classer dans l'ordre croissant : \\(\\frac{" + f[0].num + "}{" + f[0].den + "}\\), \\(\\frac{" + f[1].num + "}{" + f[1].den + "}\\), \\(\\frac{" + f[2].num + "}{" + f[2].den + "}\\).",
                                ans: ansStr,
                                opts: opts,
                                expl: "En décimales : \\(" + f[0].val.toFixed(3) + " < " + f[1].val.toFixed(3) + " < " + f[2].val.toFixed(3) + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_inequation_x2",
                        type: "mcq",
                        generate: function() {
                            var kList = [1,4,9,16,25];
                            var k = kList[Math.floor(Math.random()*kList.length)];
                            var sq = Math.sqrt(k);
                            var sqStr = Number.isInteger(sq) ? sq.toString() : "\\sqrt{" + k + "}";
                            var ans, expl;
                            var strict = Math.random() < 0.5;
                            if (strict) {
                                ans = "x < -" + sqStr + " ou x > " + sqStr;
                                expl = "\\(x^2 > " + k + " \\Leftrightarrow |x| > " + sqStr + " \\Leftrightarrow x < -" + sqStr + "\\) ou \\(x > " + sqStr + "\\).";
                            } else {
                                ans = "-" + sqStr + " \\leq x \\leq " + sqStr;
                                expl = "\\(x^2 \\leq " + k + " \\Leftrightarrow |x| \\leq " + sqStr + " \\Leftrightarrow -" + sqStr + " \\leq x \\leq " + sqStr + "\\).";
                            }
                            var w1 = strict ? "-" + sqStr + " < x < " + sqStr : "x < -" + sqStr + " ou x > " + sqStr;
                            var w2 = "x > " + sqStr;
                            var w3 = "x < -" + sqStr;
                            var opts = [ans, w1, w2, w3];
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Résoudre \\(x^2 " + (strict ? ">" : "\\leq") + " " + k + "\\).",
                                ans: ans,
                                opts: opts,
                                expl: expl
                            };
                        }
                    },
                    {
                        id: "dyn_ma_expression_numerique",
                        type: "input",
                        generate: function() {
                            // (a + b)² ou a² - b²
                            var type = Math.random() < 0.5 ? "carre" : "diff";
                            if (type === "carre") {
                                var a = Math.floor(Math.random()*8)+2;
                                var b = Math.floor(Math.random()*5)+1;
                                var val = (a+b)*(a+b);
                                return {
                                    q: "Calculer \\((" + a + " + " + b + ")^2\\).",
                                    ans: val.toString(),
                                    expl: "\\((" + a + " + " + b + ")^2 = " + (a+b) + "^2 = " + val + "\\). (Ne pas développer si ce n'est pas demandé.)"
                                };
                            } else {
                                var a = Math.floor(Math.random()*8)+3;
                                var b = Math.floor(Math.random()*a)+1;
                                var val = a*a - b*b;
                                return {
                                    q: "Calculer \\(" + a + "^2 - " + b + "^2\\) à l'aide d'une identité remarquable.",
                                    ans: val.toString(),
                                    expl: "\\(a^2 - b^2 = (a+b)(a-b) = (" + (a+b) + ")(" + (a-b) + ") = " + val + "\\)."
                                };
                            }
                        }
                    },
                    {
                        id: "dyn_ma_inverse_double",
                        type: "mcq",
                        generate: function() {
                            var nList = [2,3,4,5,6,8,10];
                            var n = nList[Math.floor(Math.random()*nList.length)];
                            // inverse du double = 1/(2n)
                            var num = 1; var den = 2*n;
                            // simplify
                            function gcd(a,b){ return b===0?a:gcd(b,a%b); }
                            var g = gcd(num, den);
                            var sNum = num/g; var sDen = den/g;
                            var ansStr = sNum + "/" + sDen;
                            var w1 = "2/" + n;
                            var w2 = "1/" + n;
                            var w3 = n + "/2";
                            var opts = [ansStr, w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push("1/" + (den+2));
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Quelle est la valeur de l'inverse du double de \\(" + n + "\\) ?",
                                ans: ansStr,
                                opts: opts,
                                expl: "Le double de \\(" + n + "\\) est \\(" + 2*n + "\\). Son inverse est \\(\\frac{1}{" + 2*n + "}\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_prix_initial",
                        type: "mcq",
                        generate: function() {
                            var tauxList = [10,20,25,50];
                            var t = tauxList[Math.floor(Math.random()*tauxList.length)];
                            var prixInitList = [40,50,60,80,100,120,200];
                            var pi = prixInitList[Math.floor(Math.random()*prixInitList.length)];
                            var cm = 1 - t/100;
                            var pf = pi * cm;
                            var pfStr = pf % 1 === 0 ? pf.toString() : pf.toFixed(2);
                            var w1 = (pi + 10).toString();
                            var w2 = (pi - 10).toString();
                            var w3 = (pf + t).toString();
                            var opts = [pi.toString(), w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((pi + 5).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Après une réduction de \\(" + t + "\\%\\), un article coûte \\(" + pfStr + "\\) €. Quel était son prix initial ?",
                                ans: pi.toString(),
                                opts: opts,
                                expl: "\\(\\text{Prix initial} = \\frac{" + pfStr + "}{" + cm + "} = " + pi + "\\) €."
                            };
                        }
                    }
                ]
            },
            {
                name: "Second degré",
                questions: [
                    {
                        id: "dyn_ma_discriminant",
                        type: "mcq",
                        generate: function() {
                            var aList = [1,2,3];
                            var bList = [-6,-4,-2,2,4,6];
                            var cList = [-3,-2,-1,1,2,3,4,5,8,9];
                            var a = aList[Math.floor(Math.random()*aList.length)];
                            var b = bList[Math.floor(Math.random()*bList.length)];
                            var c = cList[Math.floor(Math.random()*cList.length)];
                            var delta = b*b - 4*a*c;
                            var ansStr = delta.toString();
                            var w1 = (delta+4).toString();
                            var w2 = (b*b).toString();
                            var w3 = (delta-4*a).toString();
                            var opts = [ansStr, w1, w2, w3];
                            opts = opts.filter(function(v,i,arr){ return arr.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((delta+2*a).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Calculer le discriminant de \\(" + (a===1?"":a) + "x^2 " + (b>=0?"+":"") + b + "x " + (c>=0?"+":"") + c + "\\).",
                                ans: ansStr,
                                opts: opts,
                                expl: "\\(\\Delta = b^2 - 4ac = " + b + "^2 - 4 \times " + a + " \times " + c + " = " + b*b + " - " + 4*a*c + " = " + delta + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_nb_racines",
                        type: "mcq",
                        generate: function() {
                            var caseType = Math.floor(Math.random()*3);
                            var delta, msg;
                            if (caseType === 0) {
                                delta = Math.floor(Math.random()*20)+1;
                                msg = delta.toString();
                            } else if (caseType === 1) {
                                delta = 0;
                                msg = "0";
                            } else {
                                delta = -(Math.floor(Math.random()*10)+1);
                                msg = delta.toString();
                            }
                            var ans = caseType === 0 ? "2 racines réelles distinctes" : (caseType === 1 ? "1 racine double" : "0 racine réelle");
                            var opts = ["2 racines réelles distinctes", "1 racine double", "0 racine réelle", "∞ de racines"];
                            return {
                                q: "Si \\(\\Delta = " + msg + "\\), combien l'équation du second degré a-t-elle de solutions réelles ?",
                                ans: ans,
                                opts: opts,
                                expl: caseType === 0 ? "\\(\\Delta > 0\\) : deux racines réelles distinctes." : (caseType === 1 ? "\\(\\Delta = 0\\) : une racine double." : "\\(\\Delta < 0\\) : aucune racine réelle.")
                            };
                        }
                    },
                    {
                        id: "dyn_ma_somme_produit",
                        type: "mcq",
                        generate: function() {
                            // x² + px + q = 0, racines r1 et r2
                            var r1List = [-3,-2,-1,1,2,3,4,5];
                            var r2List = [-3,-2,-1,1,2,3,4,5];
                            var r1 = r1List[Math.floor(Math.random()*r1List.length)];
                            var r2 = r2List[Math.floor(Math.random()*r2List.length)];
                            var S = r1 + r2;
                            var P = r1 * r2;
                            var question = Math.random() < 0.5 ? "somme" : "produit";
                            var ans = question === "somme" ? S.toString() : P.toString();
                            var w1 = (parseFloat(ans)+1).toString();
                            var w2 = (parseFloat(ans)-1).toString();
                            var w3 = question === "somme" ? P.toString() : S.toString();
                            var opts = [ans, w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((parseFloat(ans)+2).toString());
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Les racines de \\(x^2 " + ((-S)>=0?"+":"") + (-S) + "x " + (P>=0?"+":"") + P + "\\) sont \\(" + r1 + "\\) et \\(" + r2 + "\\). Calculer leur " + question + ".",
                                ans: ans,
                                opts: opts,
                                expl: question === "somme" 
                                    ? "\\(x_1 + x_2 = " + r1 + " + " + r2 + " = " + S + "\\) (ou par les relations : \\(-b/a = -" + (-S) + " = " + S + "\\))."
                                    : "\\(x_1 \times x_2 = " + r1 + " \times " + r2 + " = " + P + "\\) (ou par les relations : \\(c/a = " + P + "\\))."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_forme_factorisee",
                        type: "mcq",
                        generate: function() {
                            var r1List = [-3,-2,-1,1,2,3];
                            var r2List = [-3,-2,-1,1,2,3];
                            var r1 = r1List[Math.floor(Math.random()*r1List.length)];
                            var r2 = r2List[Math.floor(Math.random()*r2List.length)];
                            // f(x) = (x-r1)(x-r2)
                            var r1Str = r1 >= 0 ? "-" + r1 : "+" + Math.abs(r1);
                            var r2Str = r2 >= 0 ? "-" + r2 : "+" + Math.abs(r2);
                            var ans = "(x " + r1Str + ")(x " + r2Str + ")";
                            var w1 = "(x " + r1Str + ")(x " + (r2>=0?"+":"") + r2 + ")";
                            var w2 = "(x " + (r1>=0?"+":"") + r1 + ")(x " + (r2>=0?"+":"") + r2 + ")";
                            var S = r1+r2; var P = r1*r2;
                            var w3 = "x^2 " + ((-S)>=0?"+":"") + (-S) + "x " + (P>=0?"+":"") + P;
                            var opts = [ans, w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push("(x+" + r1 + ")(x-" + r2 + ")");
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Donner la forme factorisée du polynôme ayant pour racines \\(" + r1 + "\\) et \\(" + r2 + "\\) (avec \\(a=1\\)).",
                                ans: ans,
                                opts: opts,
                                expl: "\\(f(x) = (x - " + r1 + ")(x - " + r2 + ") = (x " + r1Str + ")(x " + r2Str + ")\\)."
                            };
                        }
                    }
                ]
            },
            {
                name: "Probabilités",
                questions: [
                    {
                        id: "dyn_ma_proba_complementaire",
                        type: "mcq",
                        generate: function() {
                            var nums = [1,2,3,4,5,6,7];
                            var dens = [8,10,12,15,20];
                            var den = dens[Math.floor(Math.random()*dens.length)];
                            var num = nums[Math.floor(Math.random()*Math.min(nums.length, den-1))];
                            function gcd(a,b){ return b===0?a:gcd(b,a%b); }
                            var g = gcd(den-num, den);
                            var cNum = (den-num)/g; var cDen = den/g;
                            var ansStr = cNum + "/" + cDen;
                            var w1 = num + "/" + den;
                            var w2 = (den-num) + "/" + den;
                            var w3 = "1/" + den;
                            if (w2 === ansStr) { w2 = (cNum+1) + "/" + cDen; }
                            var opts = [ansStr, w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((cNum+2) + "/" + (cDen+1));
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Si \\(P(A) = \\frac{" + num + "}{" + den + "}\\), quelle est la probabilité de l'événement contraire \\(\bar{A}\\) ?",
                                ans: ansStr,
                                opts: opts,
                                expl: "\\(P(\bar{A}) = 1 - P(A) = 1 - \\frac{" + num + "}{" + den + "} = \\frac{" + (den-num) + "}{" + den + "}" + (g>1 ? " = \\frac{" + cNum + "}{" + cDen + "}" : "") + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_proba_conditionnelle_calcul",
                        type: "mcq",
                        generate: function() {
                            // P(A∩B) = p/q, P(B) = r/q → P(A|B) = p/r
                            var qList = [10,12,15,20];
                            var q = qList[Math.floor(Math.random()*qList.length)];
                            var pAB = Math.floor(Math.random()*4)+1;
                            var pB = pAB + Math.floor(Math.random()*4)+1;
                            if (pB > q) pB = q;
                            function gcd(a,b){ return b===0?a:gcd(b,a%b); }
                            var g = gcd(pAB, pB);
                            var ansNum = pAB/g; var ansDen = pB/g;
                            var ansStr = ansDen === 1 ? ansNum.toString() : ansNum + "/" + ansDen;
                            var w1 = pAB + "/" + q;
                            var w2 = pB + "/" + q;
                            var w3 = (pAB+1) + "/" + pB;
                            var opts = [ansStr, w1, w2, w3];
                            opts = opts.filter(function(v,i,a){ return a.indexOf(v)===i; });
                            while (opts.length < 4) opts.push((ansNum+1) + "/" + ansDen);
                            for (var i = opts.length-1; i > 0; i--) {
                                var j = Math.floor(Math.random()*(i+1));
                                var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
                            }
                            return {
                                q: "Sachant que \\(P(A \\cap B) = \\frac{" + pAB + "}{" + q + "}\\) et \\(P(B) = \\frac{" + pB + "}{" + q + "}\\), calculer \\(P_B(A)\\).",
                                ans: ansStr,
                                opts: opts,
                                expl: "\\(P_B(A) = \\frac{P(A \\cap B)}{P(B)} = \\frac{" + pAB + "/" + q + "}{" + pB + "/" + q + "} = \\frac{" + pAB + "}{" + pB + "}" + (g>1?" = \\frac{"+ansNum+"}{"+ansDen+"}":"") + "\\)."
                            };
                        }
                    },
                    {
                        id: "dyn_ma_loi_grands_nombres",
                        type: "mcq",
                        generate: function() {
                            return {
                                q: "On lance une pièce équilibrée 1000 fois. Vers quelle fréquence d'apparition de PILE tend-on ?",
                                ans: "0.5",
                                opts: ["0.5", "0.25", "0.75", "1"],
                                expl: "La loi des grands nombres garantit que la fréquence tend vers la probabilité \\(P(\\text{pile}) = 0{,}5\\)."
                            };
                        }
                    }
                ]
            }
        ]
    }


};
