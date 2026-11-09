// Monde Entraide – 30 activités
export const helpActivities = {
  m1: [
    { type: "story", title: "Un ami a besoin d’aide", content: { 6: "Un camarade de Pip tombe. Pip prévient un adulte.", 7: "Pip demande à son camarade s’il va bien et appelle un adulte.", 8: "Pip montre qu’il se soucie de son camarade et demande de l’aide à un adulte." } },
    { type: "observe", title: "Un camarade tombe", question: "Un camarade tombe dans la cour. Que peux-tu faire ?", answers: ["Prévenir un adulte et lui demander s’il va bien", "Rire de lui", "Le laisser seul"], correct: 0, explanation: "Préviens un adulte et montre que tu te soucies de lui." },
    { type: "understand", title: "Pourquoi aider ?", question: "Pourquoi prévenir un adulte ?", answers: ["Parce qu’un adulte peut mieux aider", "Pour se moquer", "Pour ne rien faire"], correct: 0, explanation: "Un adulte sait mieux comment réagir." },
    { type: "act", title: "Pip voit son ami tomber", question: "Que fait Pip ?", answers: ["Il prévient un adulte et reste près de lui", "Il rit", "Il part"], correct: 0, explanation: "Rester et prévenir un adulte est la bonne réaction." },
    { type: "challenge", title: "Défi – Entraide", question: "Quelle réaction n’est pas bienveillante ?", answers: ["Prévenir un adulte", "Rire de la personne qui est tombée", "Demander si elle va bien"], correct: 1, explanation: "Rire de quelqu’un qui est tombé n’est pas gentil." }
  ],
  m2: [
    { type: "story", title: "Les mots gentils", content: { 6: "Pip dit « pardon » quand il a fait une erreur.", 7: "Pip utilise des mots respectueux avec ses camarades.", 8: "Pip comprend que les mots gentils aident à bien vivre ensemble." } },
    { type: "observe", title: "Tu as fait une erreur", question: "Tu as fait une erreur. Quel mot peux-tu dire ?", answers: ["Pardon", "Jamais", "Tais-toi"], correct: 0, explanation: "S’excuser permet de reconnaître son erreur." },
    { type: "understand", title: "Pourquoi dire pardon ?", question: "Pourquoi dire pardon est important ?", answers: ["Pour montrer qu’on reconnaît son erreur", "Pour gagner", "Parce que c’est obligatoire de mentir"], correct: 0, explanation: "Dire pardon montre du respect." },
    { type: "act", title: "Pip a bousculé quelqu’un", question: "Que dit-il ?", answers: ["Pardon", "C’est de ta faute", "Rien"], correct: 0, explanation: "Dire pardon est le bon réflexe." },
    { type: "challenge", title: "Défi – Mots", question: "Quel mot est respectueux ?", answers: ["Pardon", "Tais-toi", "Idiot"], correct: 0, explanation: "« Pardon » est un mot respectueux." }
  ],
  m3: [
    { type: "story", title: "Jouer ensemble", content: { 6: "Deux enfants veulent le même jouet. Ils font un tour de rôle.", 7: "Pip propose de jouer à tour de rôle.", 8: "Pip comprend que partager et faire un tour de rôle permet à tout le monde de jouer." } },
    { type: "observe", title: "Le même jouet", question: "Deux enfants veulent le même jouet. Que peuvent-ils faire ?", answers: ["Trouver un tour de rôle", "Se pousser", "Crier plus fort"], correct: 0, explanation: "Le tour de rôle aide à partager." },
    { type: "understand", title: "Pourquoi le tour de rôle ?", question: "Pourquoi faire un tour de rôle ?", answers: ["Pour que chacun puisse jouer", "Pour que personne ne joue", "Pour se disputer"], correct: 0, explanation: "Le tour de rôle est une solution juste." },
    { type: "act", title: "Pip et son ami", question: "Que proposent-ils ?", answers: ["Un tour de rôle", "De se pousser", "De crier"], correct: 0, explanation: "Proposer un tour de rôle est une bonne idée." },
    { type: "challenge", title: "Défi – Partage", question: "Quelle solution permet à deux enfants de jouer avec le même jouet ?", answers: ["Faire un tour de rôle", "Se battre", "Cacher le jouet"], correct: 0, explanation: "Le tour de rôle est la solution la plus juste." }
  ],
  m4: [
    { type: "story", title: "Dire ce que je ressens", content: { 6: "Pip dit à son ami qu’il est triste.", 7: "Pip exprime simplement ce qu’il ressent.", 8: "Pip comprend que dire ce qu’on ressent aide les autres à comprendre." } },
    { type: "observe", title: "Un ami est triste", question: "Un ami te dit qu’il est triste. Que peux-tu faire ?", answers: ["L’écouter et lui proposer d’en parler à un adulte", "Te moquer", "L’ignorer"], correct: 0, explanation: "Écouter avec attention est déjà une belle aide." },
    { type: "understand", title: "Pourquoi écouter ?", question: "Pourquoi écouter un ami est important ?", answers: ["Parce que cela peut lui faire du bien", "Pour se moquer ensuite", "Parce que ce n’est pas important"], correct: 0, explanation: "Être écouté aide souvent à se sentir mieux." },
    { type: "act", title: "Pip est triste", question: "Que fait-il ?", answers: ["Il en parle à un adulte de confiance", "Il ne dit rien à personne", "Il se fâche contre tout le monde"], correct: 0, explanation: "Parler à un adulte de confiance est un bon réflexe." },
    { type: "challenge", title: "Défi – Émotions", question: "Quelle réaction aide un ami triste ?", answers: ["L’écouter", "Se moquer de lui", "L’ignorer"], correct: 0, explanation: "Écouter est déjà une aide précieuse." }
  ],
  m5: [
    { type: "story", title: "Demander de l’aide", content: { 6: "Pip n’arrive pas à faire un exercice. Il demande un indice.", 7: "Pip comprend que demander de l’aide est normal et utile.", 8: "Pip demande de l’aide calmement quand il en a besoin." } },
    { type: "observe", title: "Tu n’y arrives pas", question: "Tu n’arrives pas à faire un exercice. Que fais-tu ?", answers: ["Demander un indice ou de l’aide", "Déchirer la feuille", "Abandonner sans rien dire"], correct: 0, explanation: "Demander de l’aide est un bon réflexe pour apprendre." },
    { type: "understand", title: "Pourquoi demander ?", question: "Pourquoi demander de l’aide est une bonne idée ?", answers: ["Parce que cela aide à apprendre", "Parce que c’est interdit de réussir seul", "Pour ne jamais essayer"], correct: 0, explanation: "Demander de l’aide permet de progresser." },
    { type: "act", title: "Pip bloque sur un exercice", question: "Que fait-il ?", answers: ["Il demande de l’aide", "Il déchire sa feuille", "Il ne dit rien"], correct: 0, explanation: "Demander de l’aide est le bon réflexe." },
    { type: "challenge", title: "Défi – Aide", question: "Quelle action n’aide pas à apprendre ?", answers: ["Demander un indice", "Abandonner sans rien dire", "Réessayer après une explication"], correct: 1, explanation: "Abandonner sans demander d’aide empêche de progresser." }
  ],
  m6: [
    { type: "story", title: "L’équipe de Pip", content: { 6: "Pip et ses amis travaillent ensemble sur un projet.", 7: "Pip écoute les idées des autres et partage les siennes.", 8: "Pip comprend que coopérer permet de faire de belles choses ensemble." } },
    { type: "observe", title: "Un enfant est différent", question: "Un enfant est différent de toi. Comment le traiter ?", answers: ["Avec respect et gentillesse", "En l’excluant", "En l’insultant"], correct: 0, explanation: "Chacun mérite le respect." },
    { type: "understand", title: "Pourquoi travailler en équipe ?", question: "Pourquoi travailler en équipe ?", answers: ["Pour s’entraider et partager les idées", "Pour faire tout à la place des autres", "Pour gagner à tout prix"], correct: 0, explanation: "En équipe, chacun peut apporter quelque chose." },
    { type: "act", title: "Pip n’est pas d’accord", question: "Que peut-il faire ?", answers: ["Expliquer calmement son avis et écouter le sien", "Crier", "Le pousser"], correct: 0, explanation: "Parler calmement aide à trouver une solution." },
    { type: "challenge", title: "Défi final – Entraide", question: "Quelle attitude aide le plus une équipe ?", answers: ["Écouter et respecter les autres", "Crier plus fort que tout le monde", "Exclure ceux qui sont différents"], correct: 0, explanation: "Écouter et respecter permet de bien travailler ensemble." }
  ]
};
