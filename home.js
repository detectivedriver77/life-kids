// Monde Maison – 30 activités
export const homeActivities = {
  m1: [
    { type: "story", title: "Ma chambre rangée", content: { 6: "Pip range ses jouets après avoir joué.", 7: "Pip comprend que ranger évite de perdre ses affaires et de trébucher.", 8: "Pip range régulièrement pour garder sa chambre agréable et sûre." } },
    { type: "observe", title: "Après avoir joué", question: "Après avoir joué, que peux-tu faire ?", answers: ["Ranger les jouets", "Les laisser au milieu du passage", "Les cacher sous le lit"], correct: 0, explanation: "Ranger évite de perdre ses affaires et de trébucher." },
    { type: "understand", title: "Pourquoi ranger ?", question: "Pourquoi ranger ses chaussures ?", answers: ["Pour ne pas trébucher", "Pour les cacher", "Pour les mouiller"], correct: 0, explanation: "Un passage dégagé est plus sûr." },
    { type: "act", title: "Pip a fini de jouer", question: "Que fait Pip ?", answers: ["Il range ses jouets", "Il les laisse partout", "Il les met dans le réfrigérateur"], correct: 0, explanation: "Ranger après avoir joué est un bon réflexe." },
    { type: "challenge", title: "Défi – Rangé", question: "Quelle action rend la chambre plus sûre ?", answers: ["Ranger les objets qui traînent", "Laisser les jouets au milieu", "Mettre les chaussures dans le passage"], correct: 0, explanation: "Un sol dégagé réduit le risque de trébucher." }
  ],
  m2: [
    { type: "story", title: "Je prépare mes affaires", content: { 6: "Pip prépare son sac la veille avec l’aide d’un adulte.", 7: "Pip utilise une petite liste pour ne rien oublier.", 8: "Pip prépare son sac calmement pour partir sereinement le matin." } },
    { type: "observe", title: "Comment éviter d’oublier ?", question: "Avant l’école, comment éviter d’oublier tes affaires ?", answers: ["Préparer ton sac avec la liste", "Attendre la dernière seconde", "Prendre un sac au hasard"], correct: 0, explanation: "Préparer ton sac aide à partir sereinement." },
    { type: "understand", title: "La liste du sac", question: "À quoi sert une liste pour le sac ?", answers: ["À vérifier qu’on n’oublie rien", "À décorer le sac", "À le rendre plus lourd"], correct: 0, explanation: "La liste aide à être organisé." },
    { type: "act", title: "Le matin", question: "Pip a préparé son sac la veille. Que fait-il le matin ?", answers: ["Il vérifie rapidement et part", "Il refait tout à la dernière minute", "Il oublie son sac"], correct: 0, explanation: "Préparer à l’avance rend le matin plus calme." },
    { type: "challenge", title: "Défi – Organisation", question: "Quelle habitude aide le plus à ne rien oublier ?", answers: ["Préparer la veille", "Préparer 2 minutes avant de partir", "Ne jamais préparer"], correct: 0, explanation: "Préparer à l’avance donne le temps de vérifier." }
  ],
  m3: [
    { type: "story", title: "Mettre la table", content: { 6: "Pip aide à mettre les assiettes et les verres.", 7: "Pip participe à une tâche familiale adaptée à son âge.", 8: "Pip comprend qu’aider à la maison fait partie de la vie en famille." } },
    { type: "observe", title: "Comment aider ?", question: "Comment participer à la maison ?", answers: ["Faire une petite tâche adaptée à ton âge", "Tout laisser aux autres", "Utiliser les objets sans demander"], correct: 0, explanation: "Chacun peut aider avec des gestes adaptés." },
    { type: "understand", title: "Mettre la table", question: "Que peux-tu mettre sur la table en toute sécurité ?", answers: ["Les assiettes et les verres (avec un adulte)", "Les couteaux pointus seul", "Les produits de nettoyage"], correct: 0, explanation: "On aide avec des objets adaptés et sous surveillance si besoin." },
    { type: "act", title: "Pip aide", question: "Que fait Pip avant le repas ?", answers: ["Il met les assiettes", "Il joue avec les couverts dangereux", "Il ne fait rien"], correct: 0, explanation: "Mettre la table est une aide simple et utile." },
    { type: "challenge", title: "Défi – Aide familiale", question: "Quelle aide est adaptée à un enfant de 6-8 ans ?", answers: ["Mettre les serviettes", "Utiliser le four seul", "Manipuler des produits chimiques"], correct: 0, explanation: "Mettre les serviettes est une tâche simple et sûre." }
  ],
  m4: [
    { type: "story", title: "Le linge à sa place", content: { 6: "Pip met ses vêtements sales dans le panier à linge.", 7: "Pip sait que le panier à linge sert à rassembler les vêtements sales.", 8: "Pip range ses vêtements sales au bon endroit pour aider la famille." } },
    { type: "observe", title: "Où mettre le linge sale ?", question: "Où mets-tu un vêtement sale ?", answers: ["Dans le panier à linge", "Dans le réfrigérateur", "Sur la table"], correct: 0, explanation: "Le panier à linge sert à rassembler les vêtements sales." },
    { type: "understand", title: "Pourquoi le panier ?", question: "Pourquoi mettre le linge sale au bon endroit ?", answers: ["Pour qu’il soit lavé et pour garder la maison propre", "Pour le cacher", "Pour le mouiller encore plus"], correct: 0, explanation: "Le panier aide à organiser le linge." },
    { type: "act", title: "Pip a joué dehors", question: "Son t-shirt est sale. Que fait-il ?", answers: ["Il le met dans le panier à linge", "Il le remet dans l’armoire", "Il le laisse par terre"], correct: 0, explanation: "Le panier à linge est le bon endroit." },
    { type: "challenge", title: "Défi – Linge", question: "Où ne faut-il pas mettre un vêtement sale ?", answers: ["Dans le panier à linge", "Sur la table à manger", "Dans l’armoire avec les vêtements propres"], correct: 1, explanation: "La table à manger n’est pas l’endroit pour le linge sale." }
  ],
  m5: [
    { type: "story", title: "Je prends soin de mes objets", content: { 6: "Pip range son livre pour ne pas l’abîmer.", 7: "Pip comprend que prendre soin de ses affaires les fait durer plus longtemps.", 8: "Pip range et manipule ses objets avec attention." } },
    { type: "observe", title: "Comment prendre soin ?", question: "Que fais-tu avec ton livre préféré ?", answers: ["Tu le ranges correctement", "Tu le laisses sous la pluie", "Tu le déchires"], correct: 0, explanation: "Ranger ses affaires les protège." },
    { type: "understand", title: "Pourquoi prendre soin ?", question: "Pourquoi prendre soin de ses objets ?", answers: ["Pour qu’ils durent plus longtemps", "Pour les casser plus vite", "Parce que ce n’est pas important"], correct: 0, explanation: "Prendre soin permet de garder ses affaires en bon état." },
    { type: "act", title: "Pip a fini son dessin", question: "Que fait-il de ses crayons ?", answers: ["Il les range dans leur boîte", "Il les laisse partout", "Il les casse"], correct: 0, explanation: "Ranger ses crayons les protège et les rend faciles à retrouver." },
    { type: "challenge", title: "Défi – Soin des objets", question: "Quelle action abîme un objet ?", answers: ["Le ranger", "Le laisser sous la pluie", "Le manipuler doucement"], correct: 1, explanation: "La pluie peut abîmer beaucoup d’objets." }
  ],
  m6: [
    { type: "story", title: "La maison en équipe", content: { 6: "Pip et sa famille font chacun une petite tâche.", 7: "Pip comprend qu’aider selon son âge rend la vie de la maison plus agréable.", 8: "Pip participe avec des gestes adaptés et demande de l’aide quand c’est nécessaire." } },
    { type: "observe", title: "Tu ne sais pas utiliser un appareil", question: "Tu ne sais pas utiliser un appareil ménager. Que fais-tu ?", answers: ["Tu demandes à un adulte", "Tu essaies seul", "Tu démontes l’appareil"], correct: 0, explanation: "Certains appareils peuvent être dangereux : demande de l’aide." },
    { type: "understand", title: "Travailler ensemble", question: "Pourquoi aider à la maison ?", answers: ["Parce que chacun peut contribuer selon son âge", "Pour tout faire à la place des autres", "Parce que c’est interdit de jouer"], correct: 0, explanation: "Aider rend la vie familiale plus agréable pour tout le monde." },
    { type: "act", title: "Pip veut aider", question: "Que propose Pip ?", answers: ["Une petite tâche qu’il sait faire", "Utiliser le four tout seul", "Ne rien faire"], correct: 0, explanation: "Proposer une tâche adaptée est le bon réflexe." },
    { type: "challenge", title: "Défi final – Maison", question: "Quelle action n’est pas adaptée pour un enfant seul ?", answers: ["Ranger ses jouets", "Utiliser un appareil électrique dangereux", "Mettre la table avec des assiettes"], correct: 1, explanation: "Les appareils électriques dangereux s’utilisent avec un adulte." }
  ]
};
