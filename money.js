// Monde Argent – 30 activités complètes et uniques
export const moneyActivities = {
  m1: [
    { type: "story", title: "Pip et son porte-monnaie", content: { 6: "Pip a reçu un petit porte-monnaie. Il y met ses pièces pour ne pas les perdre.", 7: "Pip a un nouveau porte-monnaie. Il y range ses pièces et ses billets pour les garder ensemble.", 8: "Pip comprend qu’un porte-monnaie sert à protéger et organiser son argent. Il décide de toujours l’utiliser." } },
    { type: "observe", title: "Quelle pièce est la plus grande ?", question: "Regarde bien. Quelle pièce vaut le plus ?", answers: ["1 centime", "2 euros", "10 centimes"], correct: 1, explanation: "La pièce de 2 euros est la plus grande et vaut le plus." },
    { type: "understand", title: "À quoi sert un porte-monnaie ?", question: "Pourquoi Pip met-il ses pièces dans un porte-monnaie ?", answers: ["Pour les ranger et ne pas les perdre", "Pour les cacher sous le lit", "Pour les jeter"], correct: 0, explanation: "Le porte-monnaie permet de garder son argent au même endroit et de ne pas le perdre." },
    { type: "act", title: "Pip trouve une pièce", question: "Pip trouve une pièce par terre. Que fait-il ?", answers: ["Il la met dans son porte-monnaie", "Il la laisse par terre", "Il la donne à un inconnu"], correct: 0, explanation: "On range l’argent trouvé dans son porte-monnaie (après avoir vérifié avec un adulte si c’est possible)." },
    { type: "challenge", title: "Défi final – Reconnaître les pièces", question: "Quelle pièce vaut 1 euro ?", answers: ["La petite pièce dorée", "La grande pièce bicolore", "La pièce en cuivre très petite"], correct: 1, explanation: "La pièce de 1 euro est bicolore (argent et or) et plus grande que les centimes." }
  ],
  m2: [
    { type: "story", title: "Pip veut un jouet", content: { 6: "Pip voit un jouet qui coûte 7 euros. Il a 10 euros dans son porte-monnaie.", 7: "Pip regarde le prix du jouet : 7 €. Il compte ses pièces et voit qu’il a 10 €.", 8: "Pip compare le prix du jouet (7 €) à l’argent qu’il a (10 €) avant de décider." } },
    { type: "observe", title: "Assez d’argent ?", question: "Le jouet coûte 7 €. Pip a 10 €. Peut-il l’acheter ?", answers: ["Oui", "Non", "Il lui manque 3 €"], correct: 0, explanation: "10 € est plus que 7 €. Pip peut acheter le jouet." },
    { type: "understand", title: "Combien reste-t-il ?", question: "Pip achète le jouet à 7 € avec 10 €. Combien lui reste-t-il ?", answers: ["1 €", "2 €", "3 €"], correct: 2, explanation: "10 − 7 = 3. Il lui reste 3 euros." },
    { type: "act", title: "Que fait Pip avec le reste ?", question: "Que peut faire Pip avec les 3 € restants ?", answers: ["Les garder pour plus tard", "Les jeter", "Les donner à un inconnu"], correct: 0, explanation: "Garder l’argent restant permet de préparer un autre petit projet." },
    { type: "challenge", title: "Défi – Calculer la monnaie", question: "Tu as 5 €. Tu achètes un objet à 2 €. Combien te reste-t-il ?", answers: ["2 €", "3 €", "4 €"], correct: 1, explanation: "5 − 2 = 3. Il te reste 3 euros." }
  ],
  m3: [
    { type: "story", title: "Le goûter de Pip", content: { 6: "Pip a 4 euros. Il veut un goûter.", 7: "Pip a 4 € et regarde les prix des goûters.", 8: "Pip compare plusieurs goûters pour choisir celui qui rentre dans son budget." } },
    { type: "observe", title: "Quel goûter peut-il prendre ?", question: "Pip a 4 €. Quel goûter peut-il acheter ?", answers: ["Un fruit à 1 €", "Un gâteau à 5 €", "Rien"], correct: 0, explanation: "Le fruit à 1 € coûte moins que 4 €." },
    { type: "understand", title: "Choix raisonnable", question: "Pourquoi Pip ne prend-il pas le gâteau à 5 € ?", answers: ["Parce qu’il n’a pas assez d’argent", "Parce qu’il n’aime pas les gâteaux", "Parce que c’est interdit"], correct: 0, explanation: "5 € est plus que 4 €. Il ne peut pas l’acheter." },
    { type: "act", title: "Pip décide", question: "Que fait Pip ?", answers: ["Il achète le fruit et garde le reste", "Il emprunte de l’argent à un inconnu", "Il prend le gâteau sans payer"], correct: 0, explanation: "Acheter ce qu’on peut payer et garder le reste est un bon choix." },
    { type: "challenge", title: "Défi – Petit calcul", question: "Un yaourt coûte 1 € et un fruit 2 €. Combien coûtent-ils ensemble ?", answers: ["2 €", "3 €", "4 €"], correct: 1, explanation: "1 + 2 = 3 euros." }
  ],
  m4: [
    { type: "story", title: "Pip économise", content: { 6: "Pip met 2 euros de côté chaque semaine.", 7: "Pip décide d’épargner un peu d’argent chaque semaine pour un projet.", 8: "Pip comprend que mettre de l’argent de côté régulièrement permet de réaliser un projet plus tard." } },
    { type: "observe", title: "Combien a-t-il mis de côté ?", question: "Pip a mis 2 € puis encore 2 €. Combien a-t-il ?", answers: ["2 €", "3 €", "4 €"], correct: 2, explanation: "2 + 2 = 4 euros." },
    { type: "understand", title: "Pourquoi épargner ?", question: "Pourquoi Pip met-il de l’argent de côté ?", answers: ["Pour acheter quelque chose plus tard", "Pour le jeter", "Pour le donner tout de suite"], correct: 0, explanation: "Épargner permet de préparer un achat plus important." },
    { type: "act", title: "Pip reçoit 1 €", question: "Pip reçoit 1 € en plus. Que fait-il ?", answers: ["Il le met aussi de côté", "Il le dépense immédiatement", "Il le cache et l’oublie"], correct: 0, explanation: "Ajouter même une petite somme aide à avancer vers son objectif." },
    { type: "challenge", title: "Défi – Addition d’épargne", question: "Pip a déjà 6 €. Il ajoute 3 €. Combien a-t-il maintenant ?", answers: ["8 €", "9 €", "10 €"], correct: 1, explanation: "6 + 3 = 9 euros." }
  ],
  m5: [
    { type: "story", title: "Besoin ou envie ?", content: { 6: "Pip a faim. Il veut aussi un nouveau jouet.", 7: "Pip se demande si le jouet est vraiment nécessaire ou s’il en a juste envie.", 8: "Pip apprend à distinguer un besoin (manger, se vêtir) d’une envie (un jouet supplémentaire)." } },
    { type: "observe", title: "Quel est le besoin ?", question: "Qu’est-ce qui est un besoin ?", answers: ["Manger quand on a faim", "Avoir un 10e jouet", "Acheter un nouveau chapeau alors qu’on en a déjà"], correct: 0, explanation: "Manger est un besoin essentiel. Un jouet supplémentaire est souvent une envie." },
    { type: "understand", title: "Pourquoi faire la différence ?", question: "Pourquoi est-il utile de savoir si c’est un besoin ou une envie ?", answers: ["Pour mieux choisir comment utiliser son argent", "Pour tout acheter", "Pour ne jamais dépenser"], correct: 0, explanation: "Faire la différence aide à utiliser son argent de façon réfléchie." },
    { type: "act", title: "Pip choisit", question: "Pip a faim et il voit un jouet. Que fait-il en premier ?", answers: ["Il mange", "Il achète le jouet", "Il ne fait rien"], correct: 0, explanation: "On répond d’abord aux besoins essentiels." },
    { type: "challenge", title: "Défi – Classer", question: "Lequel de ces éléments est plutôt une envie ?", answers: ["Un nouveau jeu vidéo alors qu’on en a déjà plusieurs", "De l’eau pour boire", "Des vêtements quand il fait froid"], correct: 0, explanation: "Un jeu vidéo supplémentaire est généralement une envie, pas un besoin vital." }
  ],
  m6: [
    { type: "story", title: "Le petit projet de Pip", content: { 6: "Pip veut un livre qui coûte 8 euros. Il économise petit à petit.", 7: "Pip note le prix du livre et calcule combien il lui manque encore.", 8: "Pip planifie son épargne sur plusieurs semaines pour atteindre son objectif." } },
    { type: "observe", title: "Combien manque-t-il ?", question: "Le livre coûte 8 €. Pip a déjà 5 €. Combien lui manque-t-il ?", answers: ["2 €", "3 €", "4 €"], correct: 1, explanation: "8 − 5 = 3. Il lui manque 3 euros." },
    { type: "understand", title: "Comment préparer un projet ?", question: "Quelle est la meilleure façon de préparer un achat ?", answers: ["Regarder le prix et compter son argent", "Acheter sans regarder", "Demander à un inconnu"], correct: 0, explanation: "Comparer le prix à l’argent disponible est le bon réflexe." },
    { type: "act", title: "Pip continue", question: "Pip a économisé 3 € de plus. Que fait-il ?", answers: ["Il vérifie s’il a assez maintenant", "Il dépense tout pour autre chose", "Il arrête"], correct: 0, explanation: "Vérifier régulièrement permet de savoir où on en est." },
    { type: "challenge", title: "Défi final – Projet complet", question: "Tu veux un objet à 12 €. Tu as 7 €. Combien te manque-t-il encore ?", answers: ["4 €", "5 €", "6 €"], correct: 1, explanation: "12 − 7 = 5. Il te manque 5 euros." }
  ]
};
