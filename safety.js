// Monde Sécurité – 30 activités
export const safetyActivities = {
  m1: [
    { type: "story", title: "Je traverse en sécurité", content: { 6: "Pip s’arrête avec son adulte avant de traverser.", 7: "Pip regarde à gauche et à droite avec son adulte.", 8: "Pip traverse toujours avec un adulte, sur un passage adapté, après vérification." } },
    { type: "observe", title: "Comment traverser ?", question: "Pour traverser la rue, que fais-tu ?", answers: ["Tu t’arrêtes et regardes avec l’adulte", "Tu cours entre les voitures", "Tu regardes ton téléphone"], correct: 0, explanation: "On traverse avec un adulte, sur un passage adapté, après vérification." },
    { type: "understand", title: "Pourquoi s’arrêter ?", question: "Pourquoi s’arrêter avant de traverser ?", answers: ["Pour vérifier qu’aucune voiture n’arrive", "Pour jouer", "Parce que c’est joli"], correct: 0, explanation: "S’arrêter permet de voir si c’est sûr." },
    { type: "act", title: "Pip veut traverser", question: "Que fait Pip ?", answers: ["Il attend son adulte et regarde avec lui", "Il traverse en courant", "Il ferme les yeux"], correct: 0, explanation: "Traverser avec un adulte est la règle." },
    { type: "challenge", title: "Défi – Traversée", question: "Quelle action est dangereuse ?", answers: ["Traverser avec un adulte après avoir regardé", "Courir entre les voitures", "Utiliser un passage piéton"], correct: 1, explanation: "Courir entre les voitures est très dangereux." }
  ],
  m2: [
    { type: "story", title: "Je reste près de l’adulte", content: { 6: "Dans le magasin, Pip reste près de son adulte.", 7: "Pip sait que rester proche évite de se perdre.", 8: "Pip reste toujours à portée de vue de son adulte dans les lieux publics." } },
    { type: "observe", title: "Dans le magasin", question: "Tu ne retrouves plus ton parent dans un magasin. Que fais-tu ?", answers: ["Rester dans un endroit sûr et demander à un employé", "Sortir seul du magasin", "Suivre une personne inconnue"], correct: 0, explanation: "Reste dans un lieu sûr et demande de l’aide à un employé." },
    { type: "understand", title: "Pourquoi rester proche ?", question: "Pourquoi rester près de l’adulte ?", answers: ["Pour ne pas se perdre", "Pour courir plus loin", "Parce que c’est interdit de jouer"], correct: 0, explanation: "Rester proche permet de rester en sécurité." },
    { type: "act", title: "Pip est dans un grand magasin", question: "Que fait-il ?", answers: ["Il reste près de son adulte", "Il part explorer seul", "Il suit quelqu’un d’autre"], correct: 0, explanation: "Rester près de l’adulte est le bon réflexe." },
    { type: "challenge", title: "Défi – Lieu public", question: "Que ne faut-il pas faire si on se perd ?", answers: ["Rester dans un endroit sûr et demander à un employé", "Sortir seul dehors", "Suivre un inconnu"], correct: 1, explanation: "Sortir seul peut être dangereux. Il faut rester dans un lieu sûr." }
  ],
  m3: [
    { type: "story", title: "Les inconnus", content: { 6: "Une personne que Pip ne connaît pas lui propose de partir. Il dit non.", 7: "Pip refuse et rejoint immédiatement son adulte de confiance.", 8: "Pip sait qu’il ne doit jamais partir avec une personne sans l’accord de son adulte." } },
    { type: "observe", title: "Une personne inconnue", question: "Une personne inconnue te propose de partir avec elle. Que fais-tu ?", answers: ["Tu refuses et rejoins un adulte de confiance", "Tu la suis", "Tu gardes le secret"], correct: 0, explanation: "Ne pars jamais avec une personne sans l’accord de ton adulte de confiance." },
    { type: "understand", title: "Pourquoi refuser ?", question: "Pourquoi ne pas partir avec une personne inconnue ?", answers: ["Parce que c’est dangereux sans l’accord de ton adulte", "Parce que c’est impoli de refuser", "Parce que les inconnus sont toujours méchants"], correct: 0, explanation: "On ne part jamais avec quelqu’un sans l’accord de son adulte de confiance." },
    { type: "act", title: "Pip est sollicité", question: "Que fait Pip ?", answers: ["Il dit non et rejoint son adulte", "Il suit la personne", "Il ne dit rien à personne"], correct: 0, explanation: "Refuser et rejoindre son adulte est la bonne réaction." },
    { type: "challenge", title: "Défi – Inconnu", question: "Quelle réaction est la plus sûre ?", answers: ["Dire non et rejoindre un adulte de confiance", "Suivre la personne", "Garder le secret"], correct: 0, explanation: "Toujours rejoindre un adulte de confiance." }
  ],
  m4: [
    { type: "story", title: "À la maison, prudence", content: { 6: "Pip trouve un médicament. Il n’y touche pas et appelle un adulte.", 7: "Pip reconnaît qu’un médicament ne doit jamais être pris seul.", 8: "Pip sait qu’il faut prévenir un adulte face à un danger domestique." } },
    { type: "observe", title: "Tu trouves un médicament", question: "Tu trouves un médicament par terre. Que fais-tu ?", answers: ["Tu n’y touches pas et préviens un adulte", "Tu le goûtes", "Tu le ranges dans ta poche"], correct: 0, explanation: "Un médicament ne doit jamais être pris sans un adulte." },
    { type: "understand", title: "Odeur de fumée", question: "Tu sens une odeur de fumée. Que fais-tu ?", answers: ["Tu préviens immédiatement un adulte", "Tu te caches", "Tu cherches seul la source"], correct: 0, explanation: "Préviens vite un adulte et suis ses consignes." },
    { type: "act", title: "Pip voit quelque chose de dangereux", question: "Que fait-il ?", answers: ["Il prévient un adulte", "Il touche pour voir", "Il ignore"], correct: 0, explanation: "Prévenir un adulte est toujours le bon réflexe." },
    { type: "challenge", title: "Défi – Dangers maison", question: "Quelle action est dangereuse ?", answers: ["Prévenir un adulte", "Goûter un médicament trouvé", "Ne pas toucher et appeler"], correct: 1, explanation: "On ne goûte jamais un médicament seul." }
  ],
  m5: [
    { type: "story", title: "Je connais les secours", content: { 6: "Pip apprend que le 112 sert pour les urgences.", 7: "Pip sait qu’il faut appeler le 112 avec un adulte si possible.", 8: "Pip comprend que le 112 est le numéro d’urgence européen." } },
    { type: "observe", title: "Quel numéro ?", question: "Quel numéro européen permet d’appeler les urgences ?", answers: ["112", "123", "9999"], correct: 0, explanation: "Le 112 est le numéro d’urgence européen. Appelle avec un adulte si possible." },
    { type: "understand", title: "Quand appeler ?", question: "Dans quelle situation peut-on appeler le 112 ?", answers: ["En cas d’urgence grave", "Pour demander l’heure", "Pour jouer"], correct: 0, explanation: "Le 112 est réservé aux vraies urgences." },
    { type: "act", title: "Pip voit une situation grave", question: "Que fait-il ?", answers: ["Il prévient un adulte et ils appellent le 112 si besoin", "Il appelle seul sans dire à personne", "Il ne fait rien"], correct: 0, explanation: "Prévenir un adulte et appeler ensemble est le mieux." },
    { type: "challenge", title: "Défi – Urgences", question: "Quel numéro n’est pas le numéro d’urgence européen ?", answers: ["112", "15 (SAMU en France)", "123"], correct: 2, explanation: "123 n’est pas un numéro d’urgence. Le 112 fonctionne partout en Europe." }
  ],
  m6: [
    { type: "story", title: "Mes bons réflexes", content: { 6: "Pip se blesse. Il prévient tout de suite un adulte.", 7: "Pip sait demander de l’aide à un adulte de confiance.", 8: "Pip a le réflexe de parler à un adulte dès qu’il y a un problème." } },
    { type: "observe", title: "Tu te blesses", question: "Tu te blesses et tu as mal. Que fais-tu ?", answers: ["Tu préviens tout de suite un adulte", "Tu caches la blessure", "Tu continues comme si de rien n’était"], correct: 0, explanation: "Un adulte peut t’aider à obtenir les soins nécessaires." },
    { type: "understand", title: "Sur Internet", question: "Quelqu’un te demande une photo privée sur Internet. Que fais-tu ?", answers: ["Tu refuses et en parles à un adulte", "Tu l’envoies", "Tu donnes aussi ton adresse"], correct: 0, explanation: "Ne partage jamais d’informations ou d’images privées. Parle à un adulte." },
    { type: "act", title: "Pip a un problème", question: "Que fait-il ?", answers: ["Il en parle à un adulte de confiance", "Il garde tout pour lui", "Il demande à un inconnu"], correct: 0, explanation: "Parler à un adulte de confiance est le meilleur réflexe." },
    { type: "challenge", title: "Défi final – Réflexes", question: "Quelle réaction est la plus sûre face à un problème ?", answers: ["En parler à un adulte de confiance", "Garder le secret", "Demander de l’aide à un inconnu sur Internet"], correct: 0, explanation: "Toujours privilégier un adulte de confiance." }
  ]
};
