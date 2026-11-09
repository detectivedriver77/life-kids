import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, Pressable, ScrollView, StyleSheet, Image,
  TextInput, Alert, StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Crypto from "expo-crypto";
import { WORLD_ART } from "./worldArt";

const WORLDS = [
  { id: "money", name: "L'île de l'argent", short: "Argent", emoji: "🪙", color: "#F3BF4E", intro: "Apprends à reconnaître l'argent, faire des choix et préparer tes petits projets.", art: WORLD_ART.money },
  { id: "shops", name: "Le village des courses", short: "Courses", emoji: "🛒", color: "#73B9A9", intro: "Prépare tes courses, compare les prix et vérifie ce que tu mets dans ton panier.", art: WORLD_ART.shops },
  { id: "wellbeing", name: "Le jardin du bien-être", short: "Bien-être", emoji: "🌱", color: "#88C98C", intro: "Découvre les habitudes qui aident ton corps et ton esprit à se sentir bien.", art: WORLD_ART.wellbeing },
  { id: "home", name: "Le port de la maison", short: "Maison", emoji: "🏡", color: "#78AEDD", intro: "Apprends à participer à la vie de la maison avec des gestes simples et sûrs.", art: WORLD_ART.home },
  { id: "safety", name: "La forêt des bons réflexes", short: "Sécurité", emoji: "🧭", color: "#E99A83", intro: "Entraîne-toi à reconnaître les situations risquées et à demander de l'aide.", art: WORLD_ART.safety },
  { id: "help", name: "Le phare de l'entraide", short: "Entraide", emoji: "🤝", color: "#9A91D6", intro: "Apprends à écouter, coopérer, respecter les autres et demander de l'aide.", art: WORLD_ART.help },
];

// Modèle hybride : les deux premiers mondes sont gratuits au lancement.
const FREE_WORLD_IDS = ["money", "shops"];
const PURCHASE_PRODUCTS = [
  { id: "world_wellbeing", worldIds: ["wellbeing"], title: "Le jardin du bien-être", price: "2,99 €", description: "6 missions • 30 activités" },
  { id: "world_home", worldIds: ["home"], title: "Le port de la maison", price: "2,99 €", description: "6 missions • 30 activités" },
  { id: "world_safety", worldIds: ["safety"], title: "La forêt des bons réflexes", price: "2,99 €", description: "6 missions • 30 activités" },
  { id: "world_help", worldIds: ["help"], title: "Le phare de l'entraide", price: "2,99 €", description: "6 missions • 30 activités" },
  { id: "full_access", worldIds: ["wellbeing", "home", "safety", "help"], title: "Pack intégral LIFE KIDS", price: "9,99 €", description: "Les 4 extensions • 24 missions • 120 activités" },
];

const MISSIONS = {
  money: [
    { id: "m1", title: "Mon premier porte-monnaie", goal: "Reconnaître les pièces et comprendre leur utilité" },
    { id: "m2", title: "Le jouet à 7 €", goal: "Comparer un prix et l'argent disponible" },
    { id: "m3", title: "Le choix du goûter", goal: "Faire un choix raisonnable avec une petite somme" },
    { id: "m4", title: "L'épargne de Pip", goal: "Comprendre qu'on peut mettre de l'argent de côté" },
    { id: "m5", title: "Besoin ou envie ?", goal: "Distinguer un besoin essentiel d'une envie" },
    { id: "m6", title: "Mon petit projet", goal: "Préparer un achat en plusieurs étapes" },
  ],
  shops: [
    { id: "m1", title: "La liste de Pip", goal: "Comprendre l'utilité d'une liste de courses" },
    { id: "m2", title: "Le bon prix", goal: "Comparer deux prix pour le même produit" },
    { id: "m3", title: "Le panier malin", goal: "Composer un panier varié et raisonnable" },
    { id: "m4", title: "Compter les articles", goal: "Compter et additionner des quantités" },
    { id: "m5", title: "À la boulangerie", goal: "Choisir et payer un aliment simple" },
    { id: "m6", title: "Les courses réussies", goal: "Vérifier liste, prix et dates" },
  ],
  wellbeing: [
    { id: "m1", title: "Le réveil de Pip", goal: "Comprendre l'importance du sommeil" },
    { id: "m2", title: "Les mains propres", goal: "Savoir quand et pourquoi se laver les mains" },
    { id: "m3", title: "Le goûter équilibré", goal: "Reconnaître un goûter varié" },
    { id: "m4", title: "Bouger chaque jour", goal: "Comprendre que bouger est bon pour le corps" },
    { id: "m5", title: "Bien dormir", goal: "Identifier les bonnes habitudes avant le coucher" },
    { id: "m6", title: "Je prends soin de moi", goal: "Associer plusieurs gestes de bien-être" },
  ],
  home: [
    { id: "m1", title: "Ma chambre rangée", goal: "Comprendre pourquoi ranger ses affaires" },
    { id: "m2", title: "Je prépare mes affaires", goal: "Préparer son sac pour éviter d'oublier" },
    { id: "m3", title: "Mettre la table", goal: "Participer à une tâche familiale simple" },
    { id: "m4", title: "Le linge à sa place", goal: "Savoir où mettre les vêtements sales" },
    { id: "m5", title: "Je prends soin de mes objets", goal: "Prendre soin de ses affaires" },
    { id: "m6", title: "La maison en équipe", goal: "Comprendre qu'on aide selon son âge" },
  ],
  safety: [
    { id: "m1", title: "Je traverse en sécurité", goal: "Traverser avec un adulte en vérifiant" },
    { id: "m2", title: "Je reste près de l'adulte", goal: "Rester proche dans un lieu public" },
    { id: "m3", title: "Les inconnus", goal: "Ne jamais partir avec une personne inconnue" },
    { id: "m4", title: "À la maison, prudence", goal: "Reconnaître des dangers domestiques simples" },
    { id: "m5", title: "Je connais les secours", goal: "Savoir que le 112 sert pour les urgences" },
    { id: "m6", title: "Mes bons réflexes", goal: "Demander de l'aide à un adulte de confiance" },
  ],
  help: [
    { id: "m1", title: "Un ami a besoin d'aide", goal: "Réagir avec bienveillance face à un camarade" },
    { id: "m2", title: "Les mots gentils", goal: "Utiliser des mots respectueux" },
    { id: "m3", title: "Jouer ensemble", goal: "Partager et faire un tour de rôle" },
    { id: "m4", title: "Dire ce que je ressens", goal: "Exprimer une émotion simplement" },
    { id: "m5", title: "Demander de l'aide", goal: "Comprendre que demander de l'aide est normal" },
    { id: "m6", title: "L'équipe de Pip", goal: "Coopérer et écouter les autres" },
  ],
};

const ALL_ACTIVITIES = {
  money: {
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
    { type: "act", title: "Pip décide", question: "Que choisit Pip après avoir comparé les prix du goûter ?", answers: ["Il achète le fruit et garde le reste", "Il emprunte de l’argent à un inconnu", "Il prend le gâteau sans payer"], correct: 0, explanation: "Acheter ce qu’on peut payer et garder le reste est un bon choix." },
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
},
  shops: {
  m1: [
    { type: "story", title: "La liste de Pip", content: { 6: "Pip et son adulte font une liste avant d’aller au magasin.", 7: "Pip comprend qu’une liste aide à ne rien oublier.", 8: "Pip prépare sa liste en pensant à ce dont la famille a vraiment besoin." } },
    { type: "observe", title: "À quoi sert la liste ?", question: "Pourquoi faire une liste de courses ?", answers: ["Pour ne rien oublier", "Pour courir dans le magasin", "Pour prendre au hasard"], correct: 0, explanation: "La liste aide à acheter ce dont on a besoin." },
    { type: "understand", title: "Vérifier la liste", question: "Tu as oublié un article. Que fais-tu ?", answers: ["Tu vérifies la liste avec l’adulte", "Tu prends n’importe quoi", "Tu recommences tout seul"], correct: 0, explanation: "La liste est là pour t’aider à vérifier." },
    { type: "act", title: "Au magasin", question: "Pip regarde sa liste. Que fait-il en premier ?", answers: ["Il cherche les articles de la liste", "Il prend tout ce qui est beau", "Il court dans les rayons"], correct: 0, explanation: "On suit la liste pour rester organisé." },
    { type: "challenge", title: "Défi – Liste complète", question: "Quelle action est la plus utile avec une liste ?", answers: ["La cocher au fur et à mesure", "La laisser dans la voiture", "La déchirer"], correct: 0, explanation: "Cocher les articles permet de voir ce qui reste à prendre." }
  ],
  m2: [
    { type: "story", title: "Le bon prix", content: { 6: "Pip voit deux paquets de pâtes. Un coûte 2 €, l’autre 3 €.", 7: "Pip compare les prix pour choisir le moins cher.", 8: "Pip regarde aussi le contenu pour vérifier que c’est bien le même produit." } },
    { type: "observe", title: "Lequel est moins cher ?", question: "Deux paquets identiques. Le premier coûte 3 €, le second 2 €. Lequel est moins cher ?", answers: ["Le premier", "Le second", "Ils coûtent pareil"], correct: 1, explanation: "2 € est moins cher que 3 €." },
    { type: "understand", title: "Pourquoi comparer ?", question: "Pourquoi est-il utile de comparer les prix ?", answers: ["Pour dépenser moins pour la même chose", "Pour prendre le plus cher", "Pour aller plus vite"], correct: 0, explanation: "Comparer permet de faire des économies." },
    { type: "act", title: "Pip choisit le paquet malin", question: "Quel paquet Pip choisit-il après avoir comparé les deux prix ?", answers: ["Il prend le paquet à 2 €", "Il prend les deux", "Il ne prend rien"], correct: 0, explanation: "Choisir le moins cher quand c’est le même produit est malin." },
    { type: "challenge", title: "Défi – Comparaison", question: "Un yaourt coûte 1 € ici et 1,50 € là-bas. Où est-il moins cher ?", answers: ["Ici (1 €)", "Là-bas (1,50 €)", "Pareil"], correct: 0, explanation: "1 € est moins cher que 1,50 €." }
  ],
  m3: [
    { type: "story", title: "Le panier malin", content: { 6: "Pip met des fruits, des légumes et du pain dans son panier.", 7: "Pip pense à varier les aliments pour un panier équilibré.", 8: "Pip évite de prendre uniquement des gâteaux et des bonbons." } },
    { type: "observe", title: "Quel panier est le plus varié ?", question: "Quel panier est le mieux équilibré ?", answers: ["Fruits + légumes + pain", "Uniquement des bonbons", "Seulement des sodas"], correct: 0, explanation: "Un panier varié apporte ce dont le corps a besoin." },
    { type: "understand", title: "Pourquoi varier ?", question: "Pourquoi est-il mieux de varier les aliments ?", answers: ["Pour donner à ton corps différentes choses utiles", "Pour que ce soit plus coloré seulement", "Parce que c’est obligatoire"], correct: 0, explanation: "Varier aide à avoir une alimentation plus complète." },
    { type: "act", title: "Pip complète son panier", question: "Pip a déjà des gâteaux. Que peut-il ajouter ?", answers: ["Des fruits", "Encore plus de gâteaux", "Rien"], correct: 0, explanation: "Ajouter des fruits rend le panier plus varié." },
    { type: "challenge", title: "Défi – Panier équilibré", question: "Quel aliment complète bien un panier déjà riche en sucreries ?", answers: ["Des légumes", "Des bonbons", "Des chips"], correct: 0, explanation: "Les légumes apportent autre chose que les sucreries." }
  ],
  m4: [
    { type: "story", title: "Compter les articles", content: { 6: "Pip compte 3 pommes et 2 poires.", 7: "Pip additionne les fruits pour savoir combien il en a.", 8: "Pip vérifie les quantités sur la liste avant de payer." } },
    { type: "observe", title: "Combien de fruits ?", question: "3 pommes + 2 poires = ?", answers: ["4", "5", "6"], correct: 1, explanation: "3 + 2 = 5 fruits." },
    { type: "understand", title: "Pourquoi compter ?", question: "Pourquoi compter les articles est utile ?", answers: ["Pour vérifier qu’on a bien ce qu’on voulait", "Pour jouer", "Pour aller plus vite"], correct: 0, explanation: "Compter aide à ne pas se tromper." },
    { type: "act", title: "Pip vérifie", question: "Pip a pris 4 yaourts. La liste en demandait 4. Que fait-il ?", answers: ["Il continue", "Il en reprend 4 de plus", "Il les remet"], correct: 0, explanation: "Quand le nombre est bon, on peut continuer." },
    { type: "challenge", title: "Défi – Addition", question: "2 bananes + 3 oranges + 1 pomme = ?", answers: ["5", "6", "7"], correct: 1, explanation: "2 + 3 + 1 = 6 fruits." }
  ],
  m5: [
    { type: "story", title: "À la boulangerie", content: { 6: "Pip veut une baguette. Elle coûte 1 €.", 7: "Pip regarde le prix et sort la bonne pièce.", 8: "Pip vérifie qu’il a assez et donne l’argent poliment." } },
    { type: "observe", title: "Quel pain choisir ?", question: "Pip a 2 €. Quelle baguette peut-il prendre ?", answers: ["Celle à 1 €", "Celle à 3 €", "Aucune"], correct: 0, explanation: "1 € est inférieur à 2 €." },
    { type: "understand", title: "Payer correctement", question: "Que fait Pip avant de payer ?", answers: ["Il vérifie le prix", "Il donne tout son argent sans regarder", "Il part sans payer"], correct: 0, explanation: "Vérifier le prix évite les erreurs." },
    { type: "act", title: "Pip paie", question: "La baguette coûte 1 €. Pip a une pièce de 1 €. Que fait-il ?", answers: ["Il la donne", "Il en donne deux", "Il attend"], correct: 0, explanation: "Donner la bonne somme est le bon réflexe." },
    { type: "challenge", title: "Défi – Monnaie", question: "Tu donnes 2 € pour un pain à 1 €. Combien on te rend ?", answers: ["0 €", "1 €", "2 €"], correct: 1, explanation: "2 − 1 = 1. On te rend 1 euro." }
  ],
  m6: [
    { type: "story", title: "Les courses réussies", content: { 6: "Pip vérifie sa liste, les prix et les dates avant de sortir.", 7: "Pip regarde les dates de consommation pour ne pas prendre un produit périmé.", 8: "Pip fait un dernier contrôle : liste, prix, quantités et dates." } },
    { type: "observe", title: "Pourquoi regarder la date ?", question: "Pourquoi vérifier la date d’un aliment ?", answers: ["Pour savoir jusqu’à quand il peut être consommé", "Pour connaître sa couleur", "Pour compter les rayons"], correct: 0, explanation: "La date aide à consommer les aliments au bon moment." },
    { type: "understand", title: "Produit abîmé", question: "Tu vois un produit abîmé. Que fais-tu ?", answers: ["Tu préviens un adulte", "Tu le caches dans le panier", "Tu le manges tout de suite"], correct: 0, explanation: "Préviens un adulte pour choisir un produit en bon état." },
    { type: "act", title: "Avant de payer", question: "Que fait Pip juste avant de payer ?", answers: ["Il revérifie sa liste", "Il ajoute encore des choses", "Il part en courant"], correct: 0, explanation: "Une dernière vérification évite les oublis." },
    { type: "challenge", title: "Défi final – Courses complètes", question: "Quelle action n’est pas utile pendant les courses ?", answers: ["Vérifier la liste", "Comparer les prix", "Prendre tout ce qui brille sans regarder"], correct: 2, explanation: "Prendre au hasard peut mener à des erreurs et du gaspillage." }
  ]
},
  wellbeing: {
  m1: [
    { type: "story", title: "Le réveil de Pip", content: { 6: "Pip a bien dormi. Il se réveille content.", 7: "Pip comprend que dormir assez l’aide à être en forme.", 8: "Pip remarque qu’après une bonne nuit, il a plus d’énergie pour jouer et apprendre." } },
    { type: "observe", title: "Pourquoi dormir ?", question: "Pourquoi dormir suffisamment est important ?", answers: ["Pour grandir et récupérer", "Pour ne jamais jouer", "Pour éviter de manger"], correct: 0, explanation: "Le sommeil aide ton corps et ton cerveau à récupérer." },
    { type: "understand", title: "Bonne habitude", question: "Quelle habitude aide à bien dormir ?", answers: ["Aller au lit à peu près à la même heure", "Regarder un écran juste avant de dormir", "Jouer très fort dans le lit"], correct: 0, explanation: "Une heure de coucher régulière aide le corps à se préparer au sommeil." },
    { type: "act", title: "Avant de dormir", question: "Que peut faire Pip avant de dormir ?", answers: ["Lire une petite histoire calme", "Jouer à un jeu très excitant", "Manger beaucoup de sucreries"], correct: 0, explanation: "Une activité calme aide à s’endormir plus facilement." },
    { type: "challenge", title: "Défi – Sommeil", question: "Qu’est-ce qui n’aide pas à bien dormir ?", answers: ["Une histoire calme", "Un écran juste avant le coucher", "Une chambre sombre et calme"], correct: 1, explanation: "Les écrans avant de dormir peuvent rendre l’endormissement plus difficile." }
  ],
  m2: [
    { type: "story", title: "Les mains propres", content: { 6: "Pip se lave les mains avant de manger.", 7: "Pip se souvient de se laver les mains après les toilettes aussi.", 8: "Pip comprend que se laver les mains enlève les microbes." } },
    { type: "observe", title: "Quand se laver les mains ?", question: "Quand faut-il se laver les mains ?", answers: ["Avant de manger et après les toilettes", "Jamais", "Seulement le dimanche"], correct: 0, explanation: "Se laver les mains aide à enlever les microbes." },
    { type: "understand", title: "Pourquoi c’est utile ?", question: "Pourquoi se laver les mains est important ?", answers: ["Pour enlever les microbes", "Pour que les mains sentent bon seulement", "Parce que c’est joli"], correct: 0, explanation: "Les microbes peuvent rendre malade. Les laver les mains les enlève." },
    { type: "act", title: "Pip a joué dehors", question: "Pip a joué dans le jardin. Que fait-il avant de goûter ?", answers: ["Il se lave les mains", "Il mange directement", "Il se lave seulement le visage"], correct: 0, explanation: "Après avoir joué dehors, se laver les mains est un bon réflexe avant de manger." },
    { type: "challenge", title: "Défi – Hygiène", question: "Quelle situation demande de se laver les mains ?", answers: ["Après avoir caressé un animal", "Après avoir regardé la télé", "Après avoir dormi"], correct: 0, explanation: "Après avoir touché un animal, se laver les mains est recommandé." }
  ],
  m3: [
    { type: "story", title: "Le goûter équilibré", content: { 6: "Pip prend un fruit et un yaourt pour son goûter.", 7: "Pip apprend qu’un goûter peut être varié.", 8: "Pip comprend qu’un goûter varié apporte différentes choses utiles à son corps." } },
    { type: "observe", title: "Quel goûter est varié ?", question: "Quel goûter est le plus varié ?", answers: ["Un fruit et un produit laitier", "Seulement des bonbons", "Aucun aliment"], correct: 0, explanation: "Varier les aliments aide à apporter ce dont ton corps a besoin." },
    { type: "understand", title: "Pourquoi varier les aliments ?", question: "Pourquoi ne pas manger uniquement des bonbons au goûter ?", answers: ["Parce que le corps a besoin d’autres choses aussi", "Parce que les bonbons sont interdits", "Parce que ce n’est pas coloré"], correct: 0, explanation: "Un goûter uniquement sucré n’apporte pas tout ce dont le corps a besoin." },
    { type: "act", title: "Pip choisit son goûter", question: "Que peut ajouter Pip à ses biscuits ?", answers: ["Un fruit", "Encore des biscuits", "Un soda très sucré"], correct: 0, explanation: "Ajouter un fruit rend le goûter plus varié." },
    { type: "challenge", title: "Défi – Goûter", question: "Quel aliment complète bien un goûter déjà sucré ?", answers: ["Un fruit ou un produit laitier", "Des chips", "Un autre gâteau"], correct: 0, explanation: "Un fruit ou un produit laitier apporte autre chose que le sucre." }
  ],
  m4: [
    { type: "story", title: "Bouger chaque jour", content: { 6: "Pip fait du vélo dans le jardin.", 7: "Pip sait que bouger est bon pour son corps.", 8: "Pip remarque qu’après avoir bougé, il se sent plus content et énergique." } },
    { type: "observe", title: "Quelle activité fait bouger ?", question: "Quelle activité fait bouger ton corps ?", answers: ["Faire du vélo", "Regarder un écran sans bouger", "Dormir"], correct: 0, explanation: "Bouger régulièrement est bon pour la santé." },
    { type: "understand", title: "Pourquoi bouger ?", question: "Pourquoi est-il bien de bouger chaque jour ?", answers: ["Pour que le corps reste en forme", "Pour être fatigué tout le temps", "Parce que c’est obligatoire"], correct: 0, explanation: "Bouger aide le corps et le moral." },
    { type: "act", title: "Pip a le choix", question: "Que choisit Pip ?", answers: ["Aller jouer dehors", "Rester assis toute l’après-midi", "Regarder un écran sans pause"], correct: 0, explanation: "Jouer dehors permet de bouger." },
    { type: "challenge", title: "Défi – Mouvement", question: "Quelle activité ne fait presque pas bouger ?", answers: ["Regarder un dessin animé assis", "Danser", "Jouer au ballon"], correct: 0, explanation: "Rester assis longtemps ne fait pas travailler le corps." }
  ],
  m5: [
    { type: "story", title: "Bien dormir", content: { 6: "Pip range ses jouets et lit une histoire avant de dormir.", 7: "Pip a une petite routine calme le soir.", 8: "Pip comprend que les habitudes du soir aident à bien dormir." } },
    { type: "observe", title: "Bonne routine", question: "Quelle action aide à bien s’endormir ?", answers: ["Lire une histoire calme", "Jouer à un jeu très bruyant", "Manger beaucoup juste avant"], correct: 0, explanation: "Une activité calme prépare le corps au sommeil." },
    { type: "understand", title: "Écrans le soir", question: "Pourquoi éviter les écrans juste avant de dormir ?", answers: ["Parce que cela peut rendre l’endormissement plus difficile", "Parce que les écrans sont interdits", "Parce que ce n’est pas joli"], correct: 0, explanation: "La lumière des écrans peut retarder l’endormissement." },
    { type: "act", title: "Pip prépare sa nuit", question: "Que fait Pip 30 minutes avant de dormir ?", answers: ["Il range et lit une histoire", "Il joue à un jeu très excitant", "Il regarde des vidéos"], correct: 0, explanation: "Une routine calme aide à s’endormir." },
    { type: "challenge", title: "Défi – Coucher", question: "Quelle habitude n’aide pas à bien dormir ?", answers: ["Se coucher à des heures très différentes chaque jour", "Avoir une chambre calme", "Lire une histoire"], correct: 0, explanation: "Des heures de coucher très irrégulières rendent le sommeil moins bon." }
  ],
  m6: [
    { type: "story", title: "Je prends soin de moi", content: { 6: "Pip se lave les mains, boit de l’eau et joue dehors.", 7: "Pip associe plusieurs gestes pour se sentir bien.", 8: "Pip comprend que prendre soin de soi, c’est faire plusieurs petites choses utiles chaque jour." } },
    { type: "observe", title: "Meilleure boisson", question: "Quelle boisson est idéale pour bien s’hydrater ?", answers: ["L’eau", "Le soda uniquement", "Le sirop très sucré"], correct: 0, explanation: "L’eau est la meilleure boisson pour s’hydrater au quotidien." },
    { type: "understand", title: "Prendre soin de ses dents", question: "Que peux-tu faire pour prendre soin de tes dents ?", answers: ["Les brosser matin et soir", "Les brosser une fois par mois", "Ne jamais les brosser"], correct: 0, explanation: "Le brossage régulier protège tes dents." },
    { type: "act", title: "Pip se sent triste", question: "Tu te sens triste. Que peux-tu faire ?", answers: ["En parler à un adulte de confiance", "Tout garder pour toi obligatoirement", "Te fâcher contre tout le monde"], correct: 0, explanation: "Parler à une personne de confiance peut faire du bien." },
    { type: "challenge", title: "Défi final – Bien-être", question: "Quel ensemble de gestes est le plus utile pour se sentir bien ?", answers: ["Se laver les mains + boire de l’eau + bouger + dormir", "Manger uniquement des bonbons + regarder des écrans toute la journée", "Ne rien faire de spécial"], correct: 0, explanation: "Plusieurs petits gestes ensemble aident vraiment à se sentir bien." }
  ]
},
  home: {
  m1: [
    { type: "story", title: "Ma chambre rangée", content: { 6: "Pip range ses jouets après avoir joué.", 7: "Pip comprend que ranger évite de perdre ses affaires et de trébucher.", 8: "Pip range régulièrement pour garder sa chambre agréable et sûre." } },
    { type: "observe", title: "Après avoir joué", question: "Après avoir joué, que peux-tu faire ?", answers: ["Ranger les jouets", "Les laisser au milieu du passage", "Les cacher sous le lit"], correct: 0, explanation: "Ranger évite de perdre ses affaires et de trébucher." },
    { type: "understand", title: "Pourquoi ranger ?", question: "Pourquoi ranger ses chaussures ?", answers: ["Pour ne pas trébucher", "Pour les cacher", "Pour les mouiller"], correct: 0, explanation: "Un passage dégagé est plus sûr." },
    { type: "act", title: "Pip a fini de jouer", question: "Que fait Pip juste après avoir terminé de jouer ?", answers: ["Il range ses jouets", "Il les laisse partout", "Il les met dans le réfrigérateur"], correct: 0, explanation: "Ranger après avoir joué est un bon réflexe." },
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
    { type: "understand", title: "Les objets sûrs du repas", question: "Que peux-tu mettre sur la table en toute sécurité ?", answers: ["Les assiettes et les verres (avec un adulte)", "Les couteaux pointus seul", "Les produits de nettoyage"], correct: 0, explanation: "On aide avec des objets adaptés et sous surveillance si besoin." },
    { type: "act", title: "Pip aide", question: "Que fait Pip avant le repas ?", answers: ["Il met les assiettes", "Il joue avec les couverts dangereux", "Il ne fait rien"], correct: 0, explanation: "Mettre la table est une aide simple et utile." },
    { type: "challenge", title: "Défi – Aide familiale", question: "Quelle aide est adaptée à un enfant de 6-8 ans ?", answers: ["Mettre les serviettes", "Utiliser le four seul", "Manipuler des produits chimiques"], correct: 0, explanation: "Mettre les serviettes est une tâche simple et sûre." }
  ],
  m4: [
    { type: "story", title: "Le linge à sa place", content: { 6: "Pip met ses vêtements sales dans le panier à linge.", 7: "Pip sait que le panier à linge sert à rassembler les vêtements sales.", 8: "Pip range ses vêtements sales au bon endroit pour aider la famille." } },
    { type: "observe", title: "Où mettre le linge sale ?", question: "Où mets-tu un vêtement sale ?", answers: ["Dans le panier à linge", "Dans le réfrigérateur", "Sur la table"], correct: 0, explanation: "Le panier à linge sert à rassembler les vêtements sales." },
    { type: "understand", title: "Pourquoi le panier ?", question: "Pourquoi mettre le linge sale au bon endroit ?", answers: ["Pour qu’il soit lavé et pour garder la maison propre", "Pour le cacher", "Pour le mouiller encore plus"], correct: 0, explanation: "Le panier aide à organiser le linge." },
    { type: "act", title: "Après les jeux dehors", question: "Son t-shirt est sale. Que fait-il ?", answers: ["Il le met dans le panier à linge", "Il le remet dans l’armoire", "Il le laisse par terre"], correct: 0, explanation: "Le panier à linge est le bon endroit." },
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
},
  safety: {
  m1: [
    { type: "story", title: "Je traverse en sécurité", content: { 6: "Pip s’arrête avec son adulte avant de traverser.", 7: "Pip regarde à gauche et à droite avec son adulte.", 8: "Pip traverse toujours avec un adulte, sur un passage adapté, après vérification." } },
    { type: "observe", title: "Comment traverser ?", question: "Pour traverser la rue, que fais-tu ?", answers: ["Tu t’arrêtes et regardes avec l’adulte", "Tu cours entre les voitures", "Tu regardes ton téléphone"], correct: 0, explanation: "On traverse avec un adulte, sur un passage adapté, après vérification." },
    { type: "understand", title: "Pourquoi s’arrêter ?", question: "Pourquoi s’arrêter avant de traverser ?", answers: ["Pour vérifier qu’aucune voiture n’arrive", "Pour jouer", "Parce que c’est joli"], correct: 0, explanation: "S’arrêter permet de voir si c’est sûr." },
    { type: "act", title: "Pip veut traverser", question: "Comment Pip traverse-t-il la rue avec son adulte ?", answers: ["Il attend son adulte et regarde avec lui", "Il traverse en courant", "Il ferme les yeux"], correct: 0, explanation: "Traverser avec un adulte est la règle." },
    { type: "challenge", title: "Défi – Traversée", question: "Quel comportement met un piéton en danger ?", answers: ["Traverser avec un adulte après avoir regardé", "Courir entre les voitures", "Utiliser un passage piéton"], correct: 1, explanation: "Courir entre les voitures est très dangereux." }
  ],
  m2: [
    { type: "story", title: "Je reste près de l’adulte", content: { 6: "Dans le magasin, Pip reste près de son adulte.", 7: "Pip sait que rester proche évite de se perdre.", 8: "Pip reste toujours à portée de vue de son adulte dans les lieux publics." } },
    { type: "observe", title: "Dans le magasin", question: "Tu ne retrouves plus ton parent dans un magasin. Que fais-tu ?", answers: ["Rester dans un endroit sûr et demander à un employé", "Sortir seul du magasin", "Suivre une personne inconnue"], correct: 0, explanation: "Reste dans un lieu sûr et demande de l’aide à un employé." },
    { type: "understand", title: "Pourquoi rester proche ?", question: "Pourquoi rester près de l’adulte ?", answers: ["Pour ne pas se perdre", "Pour courir plus loin", "Parce que c’est interdit de jouer"], correct: 0, explanation: "Rester proche permet de rester en sécurité." },
    { type: "act", title: "Pip est dans un grand magasin", question: "Comment Pip réagit-il lorsqu’il ne retrouve plus son parent dans le magasin ?", answers: ["Il reste près de son adulte", "Il part explorer seul", "Il suit quelqu’un d’autre"], correct: 0, explanation: "Rester près de l’adulte est le bon réflexe." },
    { type: "challenge", title: "Défi – Lieu public", question: "Que ne faut-il pas faire si on se perd ?", answers: ["Rester dans un endroit sûr et demander à un employé", "Sortir seul dehors", "Suivre un inconnu"], correct: 1, explanation: "Sortir seul peut être dangereux. Il faut rester dans un lieu sûr." }
  ],
  m3: [
    { type: "story", title: "Les inconnus", content: { 6: "Une personne que Pip ne connaît pas lui propose de partir. Il dit non.", 7: "Pip refuse et rejoint immédiatement son adulte de confiance.", 8: "Pip sait qu’il ne doit jamais partir avec une personne sans l’accord de son adulte." } },
    { type: "observe", title: "Une personne inconnue", question: "Une personne inconnue te propose de partir avec elle. Que fais-tu ?", answers: ["Tu refuses et rejoins un adulte de confiance", "Tu la suis", "Tu gardes le secret"], correct: 0, explanation: "Ne pars jamais avec une personne sans l’accord de ton adulte de confiance." },
    { type: "understand", title: "Pourquoi refuser ?", question: "Pourquoi ne pas partir avec une personne inconnue ?", answers: ["Parce que c’est dangereux sans l’accord de ton adulte", "Parce que c’est impoli de refuser", "Parce que les inconnus sont toujours méchants"], correct: 0, explanation: "On ne part jamais avec quelqu’un sans l’accord de son adulte de confiance." },
    { type: "act", title: "Pip est sollicité", question: "Que fait Pip quand une personne inconnue lui propose de partir ?", answers: ["Il dit non et rejoint son adulte", "Il suit la personne", "Il ne dit rien à personne"], correct: 0, explanation: "Refuser et rejoindre son adulte est la bonne réaction." },
    { type: "challenge", title: "Défi – Inconnu", question: "Quelle réaction est la plus sûre ?", answers: ["Dire non et rejoindre un adulte de confiance", "Suivre la personne", "Garder le secret"], correct: 0, explanation: "Toujours rejoindre un adulte de confiance." }
  ],
  m4: [
    { type: "story", title: "À la maison, prudence", content: { 6: "Pip trouve un médicament. Il n’y touche pas et appelle un adulte.", 7: "Pip reconnaît qu’un médicament ne doit jamais être pris seul.", 8: "Pip sait qu’il faut prévenir un adulte face à un danger domestique." } },
    { type: "observe", title: "Tu trouves un médicament", question: "Tu trouves un médicament par terre. Que fais-tu ?", answers: ["Tu n’y touches pas et préviens un adulte", "Tu le goûtes", "Tu le ranges dans ta poche"], correct: 0, explanation: "Un médicament ne doit jamais être pris sans un adulte." },
    { type: "understand", title: "Odeur de fumée", question: "Tu sens une odeur de fumée. Que fais-tu ?", answers: ["Tu préviens immédiatement un adulte", "Tu te caches", "Tu cherches seul la source"], correct: 0, explanation: "Préviens vite un adulte et suis ses consignes." },
    { type: "act", title: "Pip voit quelque chose de dangereux", question: "Que fait Pip lorsqu’il repère un danger à la maison ?", answers: ["Il prévient un adulte", "Il touche pour voir", "Il ignore"], correct: 0, explanation: "Prévenir un adulte est toujours le bon réflexe." },
    { type: "challenge", title: "Défi – Dangers maison", question: "Quel geste est dangereux lorsqu’on trouve un médicament ?", answers: ["Prévenir un adulte", "Goûter un médicament trouvé", "Ne pas toucher et appeler"], correct: 1, explanation: "On ne goûte jamais un médicament seul." }
  ],
  m5: [
    { type: "story", title: "Je connais les secours", content: { 6: "Pip apprend que le 112 sert pour les urgences.", 7: "Pip sait qu’il faut appeler le 112 avec un adulte si possible.", 8: "Pip comprend que le 112 est le numéro d’urgence européen." } },
    { type: "observe", title: "Quel numéro ?", question: "Quel numéro européen permet d’appeler les urgences ?", answers: ["112", "123", "9999"], correct: 0, explanation: "Le 112 est le numéro d’urgence européen. Appelle avec un adulte si possible." },
    { type: "understand", title: "Quand appeler ?", question: "Dans quelle situation peut-on appeler le 112 ?", answers: ["En cas d’urgence grave", "Pour demander l’heure", "Pour jouer"], correct: 0, explanation: "Le 112 est réservé aux vraies urgences." },
    { type: "act", title: "Pip voit une situation grave", question: "Quelle est la première réaction de Pip face à une urgence grave ?", answers: ["Il prévient un adulte et ils appellent le 112 si besoin", "Il appelle seul sans dire à personne", "Il ne fait rien"], correct: 0, explanation: "Prévenir un adulte et appeler ensemble est le mieux." },
    { type: "challenge", title: "Défi – Urgences", question: "Quel numéro n’est pas le numéro d’urgence européen ?", answers: ["112", "15 (SAMU en France)", "123"], correct: 2, explanation: "123 n’est pas un numéro d’urgence. Le 112 fonctionne partout en Europe." }
  ],
  m6: [
    { type: "story", title: "Mes bons réflexes", content: { 6: "Pip se blesse. Il prévient tout de suite un adulte.", 7: "Pip sait demander de l’aide à un adulte de confiance.", 8: "Pip a le réflexe de parler à un adulte dès qu’il y a un problème." } },
    { type: "observe", title: "Tu te blesses", question: "Tu te blesses et tu as mal. Que fais-tu ?", answers: ["Tu préviens tout de suite un adulte", "Tu caches la blessure", "Tu continues comme si de rien n’était"], correct: 0, explanation: "Un adulte peut t’aider à obtenir les soins nécessaires." },
    { type: "understand", title: "Sur Internet", question: "Quelqu’un te demande une photo privée sur Internet. Que fais-tu ?", answers: ["Tu refuses et en parles à un adulte", "Tu l’envoies", "Tu donnes aussi ton adresse"], correct: 0, explanation: "Ne partage jamais d’informations ou d’images privées. Parle à un adulte." },
    { type: "act", title: "Pip a un problème", question: "Que fait Pip lorsqu’un problème lui arrive ?", answers: ["Il en parle à un adulte de confiance", "Il garde tout pour lui", "Il demande à un inconnu"], correct: 0, explanation: "Parler à un adulte de confiance est le meilleur réflexe." },
    { type: "challenge", title: "Défi final – Réflexes", question: "Quelle réaction est la plus sûre face à un problème ?", answers: ["En parler à un adulte de confiance", "Garder le secret", "Demander de l’aide à un inconnu sur Internet"], correct: 0, explanation: "Toujours privilégier un adulte de confiance." }
  ]
},
  help: {
  m1: [
    { type: "story", title: "Un ami a besoin d’aide", content: { 6: "Un camarade de Pip tombe. Pip prévient un adulte.", 7: "Pip demande à son camarade s’il va bien et appelle un adulte.", 8: "Pip montre qu’il se soucie de son camarade et demande de l’aide à un adulte." } },
    { type: "observe", title: "Un camarade tombe", question: "Un camarade tombe dans la cour. Que peux-tu faire ?", answers: ["Prévenir un adulte et lui demander s’il va bien", "Rire de lui", "Le laisser seul"], correct: 0, explanation: "Préviens un adulte et montre que tu te soucies de lui." },
    { type: "understand", title: "Pourquoi aider ?", question: "Pourquoi prévenir un adulte ?", answers: ["Parce qu’un adulte peut mieux aider", "Pour se moquer", "Pour ne rien faire"], correct: 0, explanation: "Un adulte sait mieux comment réagir." },
    { type: "act", title: "Pip voit son ami tomber", question: "Comment Pip aide-t-il son camarade qui vient de tomber ?", answers: ["Il prévient un adulte et reste près de lui", "Il rit", "Il part"], correct: 0, explanation: "Rester et prévenir un adulte est la bonne réaction." },
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
    { type: "act", title: "Pip est triste", question: "Que peut faire Pip quand il ressent de la tristesse ?", answers: ["Il en parle à un adulte de confiance", "Il ne dit rien à personne", "Il se fâche contre tout le monde"], correct: 0, explanation: "Parler à un adulte de confiance est un bon réflexe." },
    { type: "challenge", title: "Défi – Émotions", question: "Quelle réaction aide un ami triste ?", answers: ["L’écouter", "Se moquer de lui", "L’ignorer"], correct: 0, explanation: "Écouter est déjà une aide précieuse." }
  ],
  m5: [
    { type: "story", title: "Demander de l’aide", content: { 6: "Pip n’arrive pas à faire un exercice. Il demande un indice.", 7: "Pip comprend que demander de l’aide est normal et utile.", 8: "Pip demande de l’aide calmement quand il en a besoin." } },
    { type: "observe", title: "Tu n’y arrives pas", question: "Tu n’arrives pas à faire un exercice. Que fais-tu ?", answers: ["Demander un indice ou de l’aide", "Déchirer la feuille", "Abandonner sans rien dire"], correct: 0, explanation: "Demander de l’aide est un bon réflexe pour apprendre." },
    { type: "understand", title: "Pourquoi demander ?", question: "Pourquoi demander de l’aide est une bonne idée ?", answers: ["Parce que cela aide à apprendre", "Parce que c’est interdit de réussir seul", "Pour ne jamais essayer"], correct: 0, explanation: "Demander de l’aide permet de progresser." },
    { type: "act", title: "Pip bloque sur un exercice", question: "Que fait Pip lorsqu’il bloque sur un exercice ?", answers: ["Il demande de l’aide", "Il déchire sa feuille", "Il ne dit rien"], correct: 0, explanation: "Demander de l’aide est le bon réflexe." },
    { type: "challenge", title: "Défi – Aide", question: "Quelle action n’aide pas à apprendre ?", answers: ["Demander un indice", "Abandonner sans rien dire", "Réessayer après une explication"], correct: 1, explanation: "Abandonner sans demander d’aide empêche de progresser." }
  ],
  m6: [
    { type: "story", title: "L’équipe de Pip", content: { 6: "Pip et ses amis travaillent ensemble sur un projet.", 7: "Pip écoute les idées des autres et partage les siennes.", 8: "Pip comprend que coopérer permet de faire de belles choses ensemble." } },
    { type: "observe", title: "Un enfant est différent", question: "Un enfant est différent de toi. Comment le traiter ?", answers: ["Avec respect et gentillesse", "En l’excluant", "En l’insultant"], correct: 0, explanation: "Chacun mérite le respect." },
    { type: "understand", title: "Pourquoi travailler en équipe ?", question: "Pourquoi travailler en équipe ?", answers: ["Pour s’entraider et partager les idées", "Pour faire tout à la place des autres", "Pour gagner à tout prix"], correct: 0, explanation: "En équipe, chacun peut apporter quelque chose." },
    { type: "act", title: "Pip n’est pas d’accord", question: "Que peut-il faire ?", answers: ["Expliquer calmement son avis et écouter le sien", "Crier", "Le pousser"], correct: 0, explanation: "Parler calmement aide à trouver une solution." },
    { type: "challenge", title: "Défi final – Entraide", question: "Quelle attitude aide le plus une équipe ?", answers: ["Écouter et respecter les autres", "Crier plus fort que tout le monde", "Exclure ceux qui sont différents"], correct: 0, explanation: "Écouter et respecter permet de bien travailler ensemble." }
  ]
},
};

// Mini-jeux réellement interactifs : tri par catégories et remise en ordre.
const CUSTOM_GAMES = {
  money: { m5: { type: "sort", title: "Le tri des besoins et des envies", question: "Range chaque carte dans la bonne famille.", bins: ["BESOIN", "ENVIE"], items: [
    { text: "Boire de l'eau", bin: 0 }, { text: "Un jouet supplémentaire", bin: 1 },
    { text: "Manger quand on a faim", bin: 0 }, { text: "Un nouveau jeu alors qu'on en a déjà", bin: 1 },
    { text: "Un manteau quand il fait froid", bin: 0 }, { text: "Un gadget juste pour s'amuser", bin: 1 }
  ], explanation: "Un besoin est important pour vivre ou être protégé. Une envie fait plaisir, mais peut attendre." } },
  shops: { m3: { type: "sort", title: "Le panier varié", question: "Classe les aliments pour composer un panier varié.", bins: ["À AJOUTER POUR VARIER", "À GARDER POUR OCCASIONNEL"], items: [
    { text: "Une pomme", bin: 0 }, { text: "Des carottes", bin: 0 }, { text: "Des lentilles", bin: 0 },
    { text: "Des bonbons", bin: 1 }, { text: "Un soda très sucré", bin: 1 }, { text: "Des chips", bin: 1 }
  ], explanation: "Un panier varié donne une place à plusieurs familles d'aliments. Les produits très sucrés ou salés restent occasionnels." } },
  wellbeing: { m2: { type: "sort", title: "Quand se laver les mains ?", question: "Place chaque moment dans la bonne colonne.", bins: ["BON MOMENT POUR SE LAVER", "PAS NÉCESSAIRE À CE MOMENT-LÀ"], items: [
    { text: "Avant de manger", bin: 0 }, { text: "Après les toilettes", bin: 0 }, { text: "Après avoir touché un animal", bin: 0 },
    { text: "Après avoir lu un livre propre", bin: 1 }, { text: "Après avoir regardé un dessin animé", bin: 1 }, { text: "En se réveillant sans avoir rien touché", bin: 1 }
  ], explanation: "On se lave notamment les mains avant de manger, après les toilettes et après avoir touché un animal ou quelque chose de sale." } },
  home: { m1: { type: "sort", title: "La chambre bien rangée", question: "Range les gestes selon qu'ils aident ou non à garder la chambre sûre.", bins: ["BON GESTE", "À ÉVITER"], items: [
    { text: "Ranger les petites voitures dans une boîte", bin: 0 }, { text: "Mettre les chaussures hors du passage", bin: 0 }, { text: "Ranger les livres sur une étagère", bin: 0 },
    { text: "Laisser un jouet au milieu du sol", bin: 1 }, { text: "Empiler des objets devant la porte", bin: 1 }, { text: "Laisser un sac dans l'escalier", bin: 1 }
  ], explanation: "Ranger libère les passages et aide à retrouver ses affaires. Demande de l'aide pour les objets lourds ou difficiles à ranger." } },
  safety: { m4: { type: "sort", title: "À la maison, prudence !", question: "Classe les situations : que faut-il faire ?", bins: ["NE PAS TOUCHER, PRÉVENIR UN ADULTE", "GESTE SÛR"], items: [
    { text: "Un médicament trouvé par terre", bin: 0 }, { text: "Une prise électrique abîmée", bin: 0 }, { text: "Un produit de nettoyage ouvert", bin: 0 },
    { text: "Un jouet rangé dans sa boîte", bin: 1 }, { text: "Un livre posé sur une étagère", bin: 1 }, { text: "Se laver les mains avec un adulte", bin: 1 }
  ], explanation: "Ne touche jamais aux médicaments, prises abîmées ou produits ménagers. Éloigne-toi et préviens immédiatement un adulte." } },
  help: { m3: { type: "sort", title: "Jouer ensemble", question: "Classe les idées pour jouer ensemble sans se disputer.", bins: ["AIDE À PARTAGER", "RISQUE DE CRÉER UN CONFLIT"], items: [
    { text: "Faire chacun son tour", bin: 0 }, { text: "Proposer un jeu à plusieurs", bin: 0 }, { text: "Demander gentiment si on peut jouer après", bin: 0 },
    { text: "Arracher le jouet", bin: 1 }, { text: "Cacher le jouet", bin: 1 }, { text: "Crier pour passer avant les autres", bin: 1 }
  ], explanation: "Le tour de rôle, la demande polie et les jeux à plusieurs aident chacun à trouver sa place." } }
};
CUSTOM_GAMES.money.m1 = { type: "match", title: "Les pièces et leurs caractéristiques", question: "Associe chaque pièce à sa caractéristique.", pairs: [
  { left: "1 centime", right: "Petite pièce couleur cuivre" },
  { left: "1 euro", right: "Pièce bicolore argent et or" },
  { left: "2 euros", right: "Pièce bicolore, plus grande que 1 euro" }
], explanation: "Les pièces en centimes ont des couleurs différentes. Les pièces de 1 € et 2 € sont bicolores ; celle de 2 € est plus grande." };
CUSTOM_GAMES.home.m2 = { type: "sequence", title: "Préparer son sac", question: "Remets les étapes dans le bon ordre.", steps: ["Regarder la liste des affaires", "Rassembler ce dont on a besoin", "Placer les affaires dans le sac", "Vérifier qu'il ne manque rien"], explanation: "Une liste, la préparation, puis une dernière vérification : c'est une bonne méthode pour ne rien oublier." };

const STORE_KEY = "life-kids-expo-v2";
const COLORS = {
  ink: "#15283F", muted: "#718096", cream: "#F2F6FA", paper: "#FFFFFF",
  blue: "#B8D7EA", deepBlue: "#173B5E", orange: "#E9A83A",
  green: "#2F9B78", paleGreen: "#E1F3EC", gold: "#E6B94F",
  lavender: "#B9C8E0", coral: "#D98F78", aqua: "#8EC8C4"
};

const MASCOT = "🦊";
const initialProfile = { id: "child-1", name: "Explorateur", age: 7, xp: 0, coins: 0, completed: [], parentPin: "", avatar: "🧒", errors: {}, bestStreak: 0, activitiesDone: 0 };

// Générateur stable de mécaniques : le contenu pédagogique reste la source de vérité.
// Chaque mission propose lecture, observation, compréhension, mise en situation et défi.
function enrichActivity(activity, worldId, missionId, index) {
  if (activity.type === "story") return { ...activity, gameMode: "story" };
  if (activity.type === "sort") return { ...activity, gameMode: "sort" };
  if (activity.type === "sequence") return { ...activity, gameMode: "sequence" };
  if (activity.type === "match") return { ...activity, gameMode: "match", rightOptions: stableShuffle(activity.pairs.map(p => p.right), `${worldId}-${missionId}-${activity.title}-matches`) };
  const modes = { observe: "choice", understand: "truefalse", act: "avoid", challenge: "challenge" };
  const gameMode = modes[activity.type] || "choice";
  if (!activity.answers?.length) return { ...activity, gameMode };
  if (gameMode === "truefalse") {
    const seed = stableShuffle(activity.answers, `${worldId}-${missionId}-${activity.title}-statement`);
    const statementIsCorrect = seed[0].originalIndex === activity.correct;
    const statement = seed[0].value;
    return { ...activity, gameMode, statement, statementIsCorrect, question: `Est-ce la bonne réponse à cette question : « ${activity.question} » ?`, answers: ["Oui, c'est juste", "Non, ce n'est pas juste"], correct: statementIsCorrect ? 0 : 1, explanation: statementIsCorrect ? `Oui ! « ${statement} » est la bonne réponse. ${activity.explanation}` : `Non ! « ${statement} » n'est pas la bonne réponse. ${activity.explanation}` };
  }
  if (gameMode === "avoid") {
    const wrong = activity.answers.map((value, originalIndex) => ({ value, originalIndex })).filter(x => x.originalIndex !== activity.correct);
    const shuffled = stableShuffle(wrong, `${worldId}-${missionId}-${activity.title}-avoid`);
    return { ...activity, gameMode, question: `Quel choix faut-il éviter ? ${activity.question}`, answers: shuffled.map(x => x.value), answerMap: shuffled.map(x => x.originalIndex), correctDisplayIndex: -1, acceptsAnyWrong: true, explanation: "Ce choix peut entraîner un problème. Le bon réflexe est de choisir une solution plus sûre et adaptée." };
  }
  const shuffled = stableShuffle(activity.answers, `${worldId}-${missionId}-${activity.title}`);
  return { ...activity, gameMode, answers: shuffled.map(item => item.value), answerMap: shuffled.map(item => item.originalIndex), correctDisplayIndex: shuffled.findIndex(item => item.originalIndex === activity.correct) };
}

function stableShuffle(items, seedText) {
  const hash = (text) => {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  let seed = hash(seedText || "life-kids");
  const indexed = items.map((value, originalIndex) => ({ value, originalIndex }));
  for (let i = indexed.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return indexed;
}

function getActivities(worldId, missionId, age) {
  const acts = [...(ALL_ACTIVITIES[worldId]?.[missionId] || [])];
  const custom = CUSTOM_GAMES[worldId]?.[missionId];
  if (custom) acts[acts.length - 1] = custom;
  return acts.map((a, index) => {
    const adapted = a.type === "story" && a.content
      ? { ...a, text: a.content[age] || a.content[7] || a.content[6] }
      : a;
    return enrichActivity(adapted, worldId, missionId, index);
  });
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
function Button({ title, onPress, tone = "primary", disabled = false, style }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
      styles.button, tone === "secondary" && styles.buttonSecondary,
      tone === "soft" && styles.buttonSoft, tone === "danger" && styles.buttonDanger,
      disabled && styles.buttonDisabled, pressed && !disabled && { opacity: 0.82, transform: [{ scale: 0.99 }] }, style
    ]}>
      <Text style={[styles.buttonText, tone !== "primary" && styles.buttonTextDark]}>{title}</Text>
    </Pressable>
  );
}
function Header({ title, onBack, right }) {
  return <View style={styles.header}>
    <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ minWidth: 36, alignItems: "flex-end" }}>{right || null}</View>
  </View>;
}

export default function App() {
  // Audio natif Expo : les sons sont embarqués dans le projet et restent facultatifs.
  const musicPlayer = useAudioPlayer(require("./assets/audio/life_kids_theme.mp3"));
  const tapPlayer = useAudioPlayer(require("./assets/audio/tap.mp3"));
  const correctPlayer = useAudioPlayer(require("./assets/audio/correct.mp3"));
  const retryPlayer = useAudioPlayer(require("./assets/audio/try_again.mp3"));
  const rewardPlayer = useAudioPlayer(require("./assets/audio/reward.mp3"));
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(err => console.warn("Audio mode", err));
    try {
      musicPlayer.loop = true;
      musicPlayer.volume = 0.28;
      [tapPlayer, correctPlayer, retryPlayer, rewardPlayer].forEach(player => { player.volume = 0.75; });
    } catch (err) { console.warn("Initialisation audio", err); }
  }, []);

  useEffect(() => {
    if (!musicPlayer) return;
    if (musicOn) { try { musicPlayer.play(); } catch (err) { console.warn("Lecture musique", err); } }
    else musicPlayer.pause();
  }, [musicOn]);

  function playSfx(player) {
    if (!sfxOn) return;
    try {
      if (!player) return;
      Promise.resolve(player.seekTo(0)).catch(() => {}).finally(() => player.play());
    } catch (err) { console.warn("SFX", err); }
  }

  const [profile, setProfile] = useState(initialProfile);
  const [profiles, setProfiles] = useState([initialProfile]);
  const [activeProfileId, setActiveProfileId] = useState(initialProfile.id);
  const [screen, setScreen] = useState("home");
  const [purchasedProductIds, setPurchasedProductIds] = useState([]);
  const [lockedWorldIndex, setLockedWorldIndex] = useState(null);
  const [worldIndex, setWorldIndex] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [sortAnswers, setSortAnswers] = useState({});
  const [sequenceAnswers, setSequenceAnswers] = useState([]);
  const [matchAnswers, setMatchAnswers] = useState({});
  const [earnedThisRun, setEarnedThisRun] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [profileName, setProfileName] = useState("Explorateur");
  const [profileAge, setProfileAge] = useState("7");
  const [profileMode, setProfileMode] = useState("edit");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved.profiles) && saved.profiles.length) {
            const restored = saved.profiles.map((p, i) => ({ ...initialProfile, ...p, id: p.id || `child-${i + 1}` }));
            const active = restored.find(p => p.id === saved.activeProfileId) || restored[0];
            setProfiles(restored); setActiveProfileId(active.id); setProfile(active);
            setPurchasedProductIds(Array.isArray(saved.purchasedProductIds) ? saved.purchasedProductIds : []);
          } else if (saved.profile) {
            const migrated = { ...initialProfile, ...saved.profile, id: saved.profile.id || "child-1" };
            setProfile(migrated); setProfiles([migrated]); setActiveProfileId(migrated.id);
          }
        }
      } catch (e) { console.warn("Chargement sauvegarde impossible", e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    setProfiles(previous => {
      const exists = previous.some(p => p.id === profile.id);
      return exists ? previous.map(p => p.id === profile.id ? profile : p) : [...previous, profile];
    });
  }, [profile, loading]);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(STORE_KEY, JSON.stringify({ version: 4, profiles, activeProfileId, purchasedProductIds })).catch(e => console.warn("Sauvegarde impossible", e));
  }, [profiles, activeProfileId, purchasedProductIds, loading]);

  const currentWorld = WORLDS[worldIndex];
  const worldId = currentWorld?.id;
  const missionId = MISSIONS[worldId]?.[missionIndex]?.id;
  const activities = useMemo(() => getActivities(worldId, missionId, profile.age), [worldId, missionId, profile.age]);
  const currentActivity = activities[activityIndex] || {};
  const completedCount = profile.completed.length;
  const missionKey = (wi, mi) => `${WORLDS[wi].id}-${mi}`;
  const isMissionDone = (wi, mi) => profile.completed.includes(missionKey(wi, mi));

  function hasWorldAccess(id) {
    if (FREE_WORLD_IDS.includes(id)) return true;
    return purchasedProductIds.some(productId => PURCHASE_PRODUCTS.find(product => product.id === productId)?.worldIds.includes(id));
  }
  function openWorld(index) {
    playSfx(tapPlayer);
    const world = WORLDS[index];
    if (!hasWorldAccess(world.id)) {
      setLockedWorldIndex(index);
      openParents();
      return;
    }
    setWorldIndex(index); setScreen("missions");
  }
  function startMission(index) {
    if (!hasWorldAccess(worldId)) { setLockedWorldIndex(worldIndex); openParents(); return; }
    playSfx(tapPlayer);
    setMissionIndex(index); setActivityIndex(0); setSelected(null); setFeedback(""); setAttempts(0); setSortAnswers({}); setSequenceAnswers([]); setMatchAnswers({}); setMatchAnswers({}); setScreen("activity");
  }
  function answer(index) {
    if (feedback || currentActivity.type === "story" || currentActivity.gameMode === "sort" || currentActivity.gameMode === "sequence" || currentActivity.gameMode === "match") return;
    setSelected(index);
    const originalIndex = currentActivity.answerMap?.[index] ?? index;
    const correct = currentActivity.gameMode === "avoid"
      ? true
      : currentActivity.gameMode === "truefalse"
        ? index === currentActivity.correct
        : originalIndex === currentActivity.correct;
    setIsCorrect(correct);
    setAttempts(a => a + 1);
    if (!correct) {
      setProfile(p => ({
        ...p,
        errors: { ...p.errors, [currentActivity.title]: (p.errors[currentActivity.title] || 0) + 1 }
      }));
    }
    setFeedback(correct ? (currentActivity.gameMode === "avoid" ? "Bien vu ! Tu as repéré un choix à éviter." : currentActivity.gameMode === "truefalse" ? "Exact ! Tu as bien vérifié l'affirmation." : "Bravo ! Tu as trouvé la bonne réponse.") : "Bien essayé ! Voici un indice : relis calmement et essaie encore.");
    playSfx(correct ? correctPlayer : retryPlayer);
  }
  function submitSort() {
    if (Object.keys(sortAnswers).length !== currentActivity.items.length) {
      Alert.alert("Encore quelques cartes !", "Classe toutes les cartes avant de vérifier."); return;
    }
    const correct = currentActivity.items.every((item, index) => sortAnswers[index] === item.bin);
    setAttempts(a => a + 1); setIsCorrect(correct);
    if (!correct) setProfile(p => ({ ...p, errors: { ...p.errors, [currentActivity.title]: (p.errors[currentActivity.title] || 0) + 1 } }));
    setFeedback(correct ? "Bravo ! Toutes les cartes sont bien classées." : "Il y a encore une ou plusieurs cartes à déplacer. Essaie de nouveau !");
    if (correct) playSfx(correctPlayer); else playSfx(retryPlayer);
  }
  function submitMatch() {
    if (Object.keys(matchAnswers).length !== currentActivity.pairs.length) return;
    const correct = currentActivity.pairs.every((pair, i) => currentActivity.rightOptions[matchAnswers[i]]?.value === pair.right);
    setAttempts(a => a + 1); setIsCorrect(correct);
    if (!correct) setProfile(p => ({ ...p, errors: { ...p.errors, [currentActivity.title]: (p.errors[currentActivity.title] || 0) + 1 } }));
    setFeedback(correct ? "Bravo ! Toutes les associations sont correctes." : "Certaines associations ne correspondent pas. Essaie encore !");
    if (correct) playSfx(correctPlayer); else playSfx(retryPlayer);
  }
  function submitSequence() {
    if (sequenceAnswers.length !== currentActivity.steps.length) return;
    const correct = sequenceAnswers.every((value, index) => value === index);
    setAttempts(a => a + 1); setIsCorrect(correct);
    if (!correct) setProfile(p => ({ ...p, errors: { ...p.errors, [currentActivity.title]: (p.errors[currentActivity.title] || 0) + 1 } }));
    setFeedback(correct ? "Super ! Tu as retrouvé le bon ordre." : "Pas tout à fait. Recommence en réfléchissant à la première étape.");
    if (correct) playSfx(correctPlayer); else playSfx(retryPlayer);
  }

  function nextActivity() {
    playSfx(tapPlayer);
    if (activityIndex < activities.length - 1) {
      setActivityIndex(i => i + 1); setSelected(null); setFeedback(""); setAttempts(0); setSortAnswers({}); setSequenceAnswers([]); setMatchAnswers({});
    } else {
      const key = missionKey(worldIndex, missionIndex);
      const firstCompletion = !profile.completed.includes(key);
      setEarnedThisRun(firstCompletion);
      setProfile(p => p.completed.includes(key) ? p : { ...p, xp: p.xp + 50, coins: p.coins + 20, completed: [...p.completed, key] });
      if (firstCompletion) playSfx(rewardPlayer);
      setScreen("reward");
    }
  }
  function resetProgress() {
    Alert.alert("Réinitialiser la progression ?", "Cette action efface les XP, pièces et missions terminées de ce profil.", [
      { text: "Annuler", style: "cancel" },
      { text: "Réinitialiser", style: "destructive", onPress: () => setProfile(p => ({ ...p, xp: 0, coins: 0, completed: [], errors: {} })) }
    ]);
  }
  function openParents() {
    setParentPinInput("");
    if (!profile.parentPin && !profile.parentPinHash) setScreen("setPin");
    else setScreen("parentGate");
  }
  async function checkPin() {
    let valid = false;
    try {
      if (profile.parentPinHash && profile.parentPinSalt) {
        const candidate = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${profile.parentPinSalt}:${parentPinInput}`);
        valid = candidate === profile.parentPinHash;
      } else {
        // Migration transparente des anciens profils qui stockaient le PIN en clair.
        valid = parentPinInput === profile.parentPin;
        if (valid) {
          const salt = Crypto.randomUUID();
          const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${parentPinInput}`);
          setProfile(p => ({ ...p, parentPin: "", parentPinSalt: salt, parentPinHash: hash }));
        }
      }
    } catch (e) { console.warn("Vérification PIN", e); }
    if (valid) setScreen(lockedWorldIndex !== null ? "paywall" : "parents");
    else Alert.alert("Code incorrect", "Vérifie ton code PIN et réessaie.");
  }
  async function savePin() {
    if (!/^\d{4}$/.test(newPin)) return Alert.alert("Code invalide", "Choisis un code de 4 chiffres.");
    try {
      const salt = Crypto.randomUUID();
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${newPin}`);
      setProfile(p => ({ ...p, parentPin: "", parentPinSalt: salt, parentPinHash: hash }));
      setNewPin(""); setScreen(lockedWorldIndex !== null ? "paywall" : "parents");
    } catch (e) { Alert.alert("Erreur", "Le code n'a pas pu être enregistré. Réessaie."); }
  }
  function saveProfile() {
    const age = Number(profileAge);
    if (!profileName.trim()) return Alert.alert("Prénom manquant", "Saisis un prénom ou un surnom.");
    if (![6, 7, 8].includes(age)) return Alert.alert("Âge invalide", "L'âge doit être 6, 7 ou 8 ans.");
    if (profileMode === "create") {
      if (profiles.length >= 5) return Alert.alert("Limite atteinte", "Tu peux créer jusqu'à 5 profils enfants sur cet appareil.");
      const child = { ...initialProfile, id: `child-${Date.now()}`, name: profileName.trim(), age };
      setProfiles(list => [...list, child]); setProfile(child); setActiveProfileId(child.id);
    } else {
      setProfile(p => ({ ...p, name: profileName.trim(), age }));
    }
    setScreen("home");
  }

  if (loading) return <SafeAreaView style={styles.safe}><View style={styles.loading}><Text style={styles.logo}>LIFE KIDS</Text><Text style={styles.muted}>Préparation de ton aventure…</Text></View></SafeAreaView>;

  const renderActivityContent = () => {
    if (currentActivity.type === "story") {
      return (
        <Card style={styles.questionCard}>
          <Text style={styles.pipMini}>🐾 Pip te raconte…</Text>
          <Text style={styles.question}>{currentActivity.text}</Text>
          <Button title="J'ai compris  →" onPress={nextActivity} style={{ marginTop: 20 }} />
        </Card>
      );
    }
    if (currentActivity.gameMode === "sort") {
      return <Card style={styles.questionCard}>
        <Text style={styles.pipMini}>🐾 Pip te propose un jeu de tri !</Text>
        <Text style={styles.question}>{currentActivity.question}</Text>
        {currentActivity.items.map((item, i) => <View key={i} style={styles.sortItem}>
          <Text style={styles.sortItemText}>{item.text}</Text>
          <View style={styles.sortBinRow}>{currentActivity.bins.map((bin, b) => <Pressable key={b} disabled={!!feedback} onPress={() => setSortAnswers(v => ({ ...v, [i]: b }))} style={[styles.sortBin, sortAnswers[i] === b && styles.sortBinActive]}><Text style={[styles.sortBinText, sortAnswers[i] === b && styles.sortBinTextActive]}>{bin}</Text></Pressable>)}</View>
        </View>)}
        {feedback ? <View style={[styles.feedbackBox, isCorrect ? styles.feedbackGood : styles.feedbackTry]}><Text style={styles.feedbackTitle}>{isCorrect ? "🌟 Bravo !" : "💛 On recommence"}</Text><Text style={styles.feedbackText}>{isCorrect ? currentActivity.explanation : "Regarde chaque carte et essaie de la placer dans l'autre colonne si nécessaire."}</Text>{isCorrect ? <Button title={activityIndex === activities.length - 1 ? "Terminer la mission" : "Étape suivante →"} onPress={nextActivity} /> : <Button title="Recommencer le tri" tone="secondary" onPress={() => { setSortAnswers({}); setFeedback(""); }} />}</View> : <Button title="Vérifier mon tri" onPress={submitSort} disabled={Object.keys(sortAnswers).length !== currentActivity.items.length} />}
      </Card>;
    }
    if (currentActivity.gameMode === "match") {
      return <Card style={styles.questionCard}>
        <Text style={styles.pipMini}>🐾 Pip te propose un jeu d'association !</Text><Text style={styles.question}>{currentActivity.question}</Text>
        {currentActivity.pairs.map((pair, i) => <View key={i} style={styles.matchRow}>
          <Text style={styles.matchLeft}>{pair.left}</Text>
          <View style={{ flex: 1, gap: 6 }}>{currentActivity.rightOptions.map((option, j) => <Pressable key={j} disabled={!!feedback} onPress={() => setMatchAnswers(v => ({ ...v, [i]: j }))} style={[styles.matchOption, matchAnswers[i] === j && styles.sortBinActive]}><Text style={[styles.matchOptionText, matchAnswers[i] === j && styles.sortBinTextActive]}>{option.value}</Text></Pressable>)}</View>
        </View>)}
        {feedback ? <View style={[styles.feedbackBox, isCorrect ? styles.feedbackGood : styles.feedbackTry]}><Text style={styles.feedbackTitle}>{isCorrect ? "🌟 Bien associé !" : "💛 On recommence"}</Text><Text style={styles.feedbackText}>{isCorrect ? currentActivity.explanation : "Relis les caractéristiques et associe chaque pièce à la bonne description."}</Text>{isCorrect ? <Button title="Étape suivante →" onPress={nextActivity} /> : <Button title="Recommencer" tone="secondary" onPress={() => { setMatchAnswers({}); setFeedback(""); }} />}</View> : <Button title="Vérifier mes associations" onPress={submitMatch} disabled={Object.keys(matchAnswers).length !== currentActivity.pairs.length} />}
      </Card>;
    }
    if (currentActivity.gameMode === "sequence") {
      const shuffledSteps = stableShuffle(currentActivity.steps || [], `${worldId}-${missionId}-${currentActivity.title}-steps`);
      return <Card style={styles.questionCard}>
        <Text style={styles.pipMini}>🐾 Pip te propose un jeu d'ordre !</Text><Text style={styles.question}>{currentActivity.question}</Text>
        <Text style={styles.hint}>Appuie sur les étapes dans le bon ordre.</Text>
        <View style={styles.sequenceProgress}><Text style={styles.sequenceProgressText}>{sequenceAnswers.length} / {currentActivity.steps.length} étapes choisies</Text></View>
        {shuffledSteps.map(step => { const index = currentActivity.steps.indexOf(step.value); const chosenAt = sequenceAnswers.indexOf(index); return <Pressable key={index} disabled={!!feedback || chosenAt >= 0} onPress={() => setSequenceAnswers(v => [...v, index])} style={[styles.answer, chosenAt >= 0 && styles.answerCorrect]}><Text style={styles.answerLetter}>{chosenAt >= 0 ? chosenAt + 1 : "＋"}</Text><Text style={styles.answerText}>{step.value}</Text></Pressable>; })}
        {feedback ? <View style={[styles.feedbackBox, isCorrect ? styles.feedbackGood : styles.feedbackTry]}><Text style={styles.feedbackTitle}>{isCorrect ? "🌟 Dans le bon ordre !" : "💛 On recommence"}</Text><Text style={styles.feedbackText}>{isCorrect ? currentActivity.explanation : "Reprends les étapes et place-les dans l'ordre où tu les réaliserais."}</Text>{isCorrect ? <Button title="Terminer cette étape" onPress={nextActivity} /> : <Button title="Recommencer" tone="secondary" onPress={() => { setSequenceAnswers([]); setFeedback(""); }} />}</View> : <><Button title="Vérifier l'ordre" onPress={submitSequence} disabled={sequenceAnswers.length !== currentActivity.steps.length} /><Button title="Effacer mes choix" tone="secondary" onPress={() => setSequenceAnswers([])} /></>}
      </Card>;
    }
    return (
      <Card style={styles.questionCard}>
        <Text style={styles.pipMini}>🐾 Pip te demande…</Text>
        <Text style={styles.gameModePill}>{currentActivity.gameMode === "truefalse" ? "⚖️ VRAI OU FAUX" : currentActivity.gameMode === "avoid" ? "🛑 LE BON RÉFLEXE" : currentActivity.gameMode === "challenge" ? "🏆 DÉFI FINAL" : "👀 J'OBSERVE"}</Text>
        <Text style={styles.question}>{currentActivity.question}</Text>
        {currentActivity.gameMode === "truefalse" && <View style={styles.statementBox}><Text style={styles.statementText}>« {currentActivity.statement} »</Text></View>}
        {currentActivity.answers?.map((a, i) => {
          let answerStyle = styles.answer;
          if (feedback && currentActivity.gameMode !== "avoid" && i === currentActivity.correctDisplayIndex) answerStyle = [styles.answer, styles.answerCorrect];
          if (feedback && currentActivity.gameMode === "truefalse" && i === currentActivity.correct) answerStyle = [styles.answer, styles.answerCorrect];
          else if (feedback && i === selected && !isCorrect) answerStyle = [styles.answer, styles.answerWrong];
          return <Pressable key={i} disabled={!!feedback} onPress={() => answer(i)} style={answerStyle}>
            <Text style={styles.answerLetter}>{String.fromCharCode(65 + i)}</Text>
            <Text style={styles.answerText}>{a}</Text>
          </Pressable>;
        })}
        {feedback ? <View style={[styles.feedbackBox, isCorrect ? styles.feedbackGood : styles.feedbackTry]}>
          <Text style={styles.feedbackTitle}>{isCorrect ? "🌟 Bravo !" : "💛 On réessaie ? "}</Text>
          <Text style={styles.feedbackText}>{isCorrect ? currentActivity.explanation : (profile.age === 6 ? "Petit indice : prends ton temps, regarde les choix et essaie encore." : profile.age === 7 ? "Petit indice : relis la situation et cherche ce qui aiderait le mieux Pip." : "Petit indice : réfléchis aux conséquences de chaque choix, puis essaie encore.")}</Text>
          {isCorrect ? <Button title={activityIndex === activities.length - 1 ? "Terminer la mission" : "Défi suivant  →"} onPress={nextActivity} style={{ marginTop: 12 }} /> : <Button title="Réessayer" onPress={() => { setSelected(null); setFeedback(""); }} tone="secondary" style={{ marginTop: 12 }} />}
        </View> : <Text style={styles.hint}>{profile.age === 6 ? "Regarde les choix un par un. Tu peux prendre ton temps !" : profile.age === 7 ? "Choisis la réponse qui aide le mieux Pip." : "Compare les conséquences de chaque choix avant de répondre."}</Text>}
      </Card>
    );
  };

  const renderWorldCard = (w, i) => {
    const done = MISSIONS[w.id]?.filter((_, mi) => isMissionDone(i, mi)).length || 0;
    const unlocked = hasWorldAccess(w.id);
    return <Pressable key={w.id} onPress={() => openWorld(i)} style={({ pressed }) => [styles.islandCard, pressed && styles.islandPressed]}>
      <Image source={{ uri: w.art }} style={styles.islandArtwork} resizeMode="cover" />
      <View style={[styles.worldAccessPill, unlocked ? styles.worldFreePill : styles.worldLockedPill]}>
        <Text style={styles.worldAccessText}>{unlocked ? "✓ GRATUIT" : "🔒 EXTENSION"}</Text>
      </View>
      <View style={styles.islandCardFooter}>
        <Text style={styles.islandName}>{w.name}</Text>
        <View style={styles.islandBottom}>
          <Text style={styles.islandDone}>⭐ {done}/6 missions</Text>
          <Text style={styles.islandGo}>{unlocked ? "Explorer  ›" : "Parents  ›"}</Text>
        </View>
      </View>
    </Pressable>;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      {screen === "home" && <ScrollView contentContainerStyle={styles.home}>
        <View style={styles.topPill}><Text style={styles.topPillText}>🌈 TON GRAND TERRAIN DE JEU</Text></View>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <Pressable onPress={() => setMusicOn(v => !v)} style={styles.soundToggle}><Text style={styles.soundToggleText}>{musicOn ? "🎵 Musique ON" : "🔇 Musique OFF"}</Text></Pressable>
          <Pressable onPress={() => setSfxOn(v => !v)} style={styles.soundToggle}><Text style={styles.soundToggleText}>{sfxOn ? "🔔 Sons ON" : "🔕 Sons OFF"}</Text></Pressable>
        </View>
        <View style={styles.hero}>
          <Image source={{ uri: WORLD_ART.hero }} style={styles.homeHeroArt} resizeMode="cover" accessibilityLabel="Pip et son compagnon dans un paysage d’aventure" />
          <Text style={styles.brand}>LIFE KIDS</Text>
          <Text style={styles.tagline}>Apprendre à grandir en s'amusant !</Text>
          <Text style={styles.welcome}>Salut {profile.name} ! 👋</Text>
          <Text style={styles.smallMuted}>Prêt(e) à retrouver Pip ? ({profile.age} ans)</Text>
        </View>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}><Text style={styles.statIcon}>⭐</Text><Text style={styles.statNumber}>{profile.xp}</Text><Text style={styles.statLabel}>XP</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statIcon}>🪙</Text><Text style={styles.statNumber}>{profile.coins}</Text><Text style={styles.statLabel}>Pièces</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statIcon}>🏅</Text><Text style={styles.statNumber}>{completedCount}/36</Text><Text style={styles.statLabel}>Missions</Text></Card>
        </View>
        <Button title="🚀  Commencer l'aventure" onPress={() => setScreen("worlds")} style={{ marginTop: 18 }} />
        <Button title="👤  Profils des enfants" tone="secondary" onPress={() => setScreen("profiles")} />
        <Button title="✏️  Modifier mon profil" tone="soft" onPress={() => { setProfileName(profile.name); setProfileAge(String(profile.age)); setProfileMode("edit"); setScreen("profile"); }} />
        <Button title="🔐  Espace parents" tone="soft" onPress={openParents} />
        <View style={styles.footerNote}><Text style={styles.footerText}>Une aventure imaginée pour les explorateurs de 6 à 8 ans.</Text></View>
      </ScrollView>}

      {screen === "worlds" && <View style={styles.flex}>
        <Header title="L'archipel de Pip" onBack={() => setScreen("home")} right={<Text style={styles.headerStat}>⭐ {profile.xp}</Text>} />
        <ScrollView style={styles.mapScreen} contentContainerStyle={styles.mapContent}>
          <View style={styles.mapHeroCompact}>
            <View style={styles.mapHeroCopy}>
              <Text style={styles.mapHeroEyebrow}>L'AVENTURE COMMENCE ICI</Text>
              <Text style={styles.mapHeroTitle}>Choisis ton monde</Text>
              <Text style={styles.mapHeroSub}>Deux mondes gratuits, quatre nouvelles aventures à débloquer.</Text>
            </View>
            <View style={styles.mapProgressLine}>
              <View style={styles.mapProgressTrack}><View style={[styles.mapProgressFill, { width: `${completedCount / 36 * 100}%` }]} /></View>
              <Text style={styles.mapProgressLabel}>{completedCount}/36 missions</Text>
            </View>
          </View>

          <View style={styles.worldSectionHeader}>
            <Text style={styles.worldSectionTitle}>À découvrir gratuitement</Text>
            <Text style={styles.worldSectionCount}>2 MONDES</Text>
          </View>
          <View style={styles.islandGrid}>
            {WORLDS.slice(0, 2).map((w, i) => renderWorldCard(w, i))}
          </View>

          <View style={[styles.worldSectionHeader, { marginTop: 24 }]}>
            <Text style={styles.worldSectionTitle}>Les extensions</Text>
            <Text style={styles.worldSectionCount}>4 MONDES</Text>
          </View>
          <View style={styles.islandGrid}>
            {WORLDS.slice(2).map((w, index) => renderWorldCard(w, index + 2))}
          </View>

          <Pressable onPress={() => { setScreen("paywall"); }} style={styles.mapPremiumBanner}>
            <View style={styles.mapPremiumIcon}><Text style={{fontSize:25}}>♛</Text></View>
            <View style={{flex:1}}>
              <Text style={styles.mapPremiumTitle}>Envie d'explorer les 6 mondes ?</Text>
              <Text style={styles.mapPremiumText}>Découvre le pack intégral dans l'espace parents.</Text>
            </View>
            <Text style={styles.mapPremiumArrow}>›</Text>
          </Pressable>
          <View style={styles.mapTip}><Text style={styles.mapTipIcon}>🧭</Text><Text style={styles.mapTipText}>Pip : « Chaque île t'apprend quelque chose d'important. On y va ? »</Text></View>
        </ScrollView>
      </View>}

      {screen === "missions" && hasWorldAccess(worldId) && <View style={styles.flex}>
        <Header title={currentWorld.name} onBack={() => setScreen("worlds")} right={<Text style={styles.headerStat}>🪙 {profile.coins}</Text>} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.worldBanner, { backgroundColor: "#DCEAF2" }]}> 
            <Image source={{ uri: currentWorld.art }} style={styles.missionArtwork} resizeMode="cover" />
            <Text style={{ fontSize: 30 }}>{currentWorld.emoji}</Text>
            <Text style={styles.worldBannerTitle}>{currentWorld.name}</Text>
            <Text style={styles.worldBannerText}>{currentWorld.intro}</Text>
          </View>
          <Text style={styles.sectionTitle}>Les 6 missions</Text>
          {(MISSIONS[worldId] || []).map((m, i) => {
            const done = isMissionDone(worldIndex, i);
            return <Pressable key={m.id} onPress={() => startMission(i)} style={styles.missionRow}>
              <View style={[styles.missionNumber, { backgroundColor: done ? COLORS.green : COLORS.cream }]}><Text style={[styles.missionNumberText, done && { color: "#fff" }]}>{done ? "✓" : i + 1}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.missionTitle}>{m.title}</Text><Text style={styles.missionSub}>{done ? "Mission terminée • Rejouable" : "5 étapes • ~5 min"}</Text></View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>;
          })}
        </ScrollView>
      </View>}

      {screen === "activity" && <View style={styles.flex}>
        <Header title={`Mission ${missionIndex + 1}/6`} onBack={() => setScreen("missions")} right={<Text style={styles.headerStat}>⭐ {profile.xp}</Text>} />
        <ScrollView contentContainerStyle={styles.activityPage}>
          <View style={[styles.activityWorld, { backgroundColor: "#E5EEF4" }]}> 
            <Image source={{ uri: WORLD_ART.pip }} style={styles.activityPipArt} resizeMode="contain" />
            <Text style={{ fontSize: 24 }}>{currentWorld.emoji}</Text>
            <Text style={styles.activityMission}>{MISSIONS[worldId]?.[missionIndex]?.title}</Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((activityIndex + (isCorrect ? 1 : 0)) / activities.length) * 100}%` }]} /></View>
          <Text style={styles.activityCount}>ÉTAPE {activityIndex + 1} SUR {activities.length} • {({story:"HISTOIRE",choice:"OBSERVATION",truefalse:"VRAI OU FAUX",avoid:"BON RÉFLEXE",challenge:"DÉFI FINAL",sort:"JEU DE TRI",sequence:"MISE EN ORDRE",match:"ASSOCIATION"})[currentActivity.gameMode] || currentActivity.type?.toUpperCase()}</Text>
          {renderActivityContent()}
        </ScrollView>
      </View>}

      {screen === "reward" && <View style={styles.rewardPage}>
        <Text style={styles.rewardStars}>🎉 ✨ 🏆 ✨ 🎉</Text>
        <View style={styles.rewardMascot}><Image source={{ uri: WORLD_ART.pip }} style={styles.rewardPipArt} resizeMode="contain" /></View>
        <Text style={styles.rewardTitle}>Mission réussie !</Text>
        <Text style={styles.rewardSubtitle}>Pip est très fier de toi, {profile.name} !</Text>
        {earnedThisRun ? <View style={styles.rewardPills}><Text style={styles.rewardPill}>⭐ +50 XP</Text><Text style={styles.rewardPill}>🪙 +20 pièces</Text></View> : <Text style={styles.rewardSubtitle}>Tu as déjà remporté la récompense de cette mission. Tu peux la refaire pour t'entraîner !</Text>}
        <Text style={styles.rewardTotal}>Tu as maintenant {profile.xp} XP et {profile.coins} pièces.</Text>
        <Button title="Voir les missions" onPress={() => setScreen("missions")} style={{ marginTop: 30 }} />
        <Button title="Retour aux mondes" tone="secondary" onPress={() => setScreen("worlds")} />
      </View>}

      {screen === "profiles" && <View style={styles.flex}>
        <Header title="Profils des enfants" onBack={() => setScreen("home")} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Qui joue aujourd'hui ?</Text>
          {profiles.map(child => <Pressable key={child.id} onPress={() => { setProfile(child); setActiveProfileId(child.id); setScreen("home"); }} style={[styles.missionRow, child.id === activeProfileId && { borderColor: COLORS.green, borderWidth: 2 }]}>
            <Image source={{ uri: WORLD_ART.pip }} style={styles.profilePipArt} resizeMode="contain" />
            <View style={{ flex: 1 }}><Text style={styles.missionTitle}>{child.name} • {child.age} ans</Text><Text style={styles.missionSub}>{child.completed?.length || 0}/36 missions • {child.xp || 0} XP</Text></View>
            <Text style={styles.chevron}>{child.id === activeProfileId ? "✓" : "›"}</Text>
          </Pressable>)}
          <Button title="＋ Ajouter un enfant" onPress={() => { setProfileName(""); setProfileAge("7"); setProfileMode("create"); setScreen("profile"); }} />
        </ScrollView>
      </View>}

      {screen === "profile" && <View style={styles.flex}>
        <Header title={profileMode === "create" ? "Nouveau profil" : "Mon profil"} onBack={() => setScreen(profileMode === "create" ? "profiles" : "home")} />
        <View style={styles.formPage}>
          <Text style={styles.formEmoji}>🧒</Text>
          <Text style={styles.formTitle}>Qui part à l'aventure ?</Text>
          <Text style={styles.label}>Ton prénom ou surnom</Text>
          <TextInput value={profileName} onChangeText={setProfileName} style={styles.input} placeholder="Ton prénom" />
          <Text style={styles.label}>Ton âge</Text>
          <View style={styles.ageRow}>{[6, 7, 8].map(a => <Pressable key={a} onPress={() => setProfileAge(String(a))} style={[styles.ageChoice, profileAge === String(a) && styles.ageChoiceActive]}><Text style={[styles.ageText, profileAge === String(a) && { color: "#fff" }]}>{a} ans</Text></Pressable>)}</View>
          <Button title={profileMode === "create" ? "Créer ce profil" : "Enregistrer mon profil"} onPress={saveProfile} />
        </View>
      </View>}

      {screen === "setPin" && <View style={styles.flex}>
        <Header title="Espace parents" onBack={() => setScreen("home")} />
        <View style={styles.formPage}>
          <Text style={styles.formEmoji}>🔐</Text>
          <Text style={styles.formTitle}>Créer le code parent</Text>
          <Text style={styles.formHelp}>Choisis un code à 4 chiffres. Note : ce PIN est un prototype local, pas une sécurité robuste pour une application commerciale.</Text>
          <TextInput value={newPin} onChangeText={setNewPin} style={styles.input} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="4 chiffres" />
          <Button title="Créer mon code" onPress={savePin} />
        </View>
      </View>}

      {screen === "parentGate" && <View style={styles.flex}>
        <Header title="Vérification parent" onBack={() => setScreen("home")} />
        <View style={styles.formPage}>
          <Text style={styles.formEmoji}>🛡️</Text>
          <Text style={styles.formTitle}>Code parental</Text>
          <TextInput value={parentPinInput} onChangeText={setParentPinInput} style={styles.input} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="Code à 4 chiffres" />
          <Button title="Valider" onPress={checkPin} />
        </View>
      </View>}

      {screen === "parents" && <View style={styles.flex}>
        <Header title="Espace parents" onBack={() => setScreen("home")} />
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <Text style={styles.sectionTitle}>Tableau de bord</Text>
            <Text style={styles.parentLine}>Profil actif : {profile.name}, {profile.age} ans</Text>
            <Text style={styles.parentLine}>Profils enregistrés : {profiles.length}/5</Text>
            <Button title="Gérer les profils enfants" tone="secondary" onPress={() => setScreen("profiles")} />
            <Text style={styles.parentLine}>Progression : {completedCount} missions sur 36</Text>
            <Text style={styles.parentLine}>Récompenses : {profile.xp} XP • {profile.coins} pièces</Text>
            <View style={styles.parentProgress}><View style={[styles.parentProgressFill, { width: `${completedCount / 36 * 100}%` }]} /></View>
          </Card>
          <Card>
            <Text style={styles.sectionTitle}>Notions à retravailler</Text>
            {Object.keys(profile.errors || {}).length === 0 ? <Text style={styles.muted}>Aucune erreur mémorisée pour le moment.</Text> :
              Object.entries(profile.errors).slice(0, 5).map(([k, v]) => <Text key={k} style={styles.parentLine}>• {k} ({v} essai(s))</Text>)}
          </Card>
          <Card>
            <Text style={styles.sectionTitle}>Contenus LIFE KIDS</Text>
            <Text style={styles.parentLine}>Gratuit : L'île de l'argent et Le village des courses.</Text>
            <Text style={styles.parentLine}>Extensions : 4 univers supplémentaires à débloquer.</Text>
            <Button title="Voir les extensions et les tarifs" onPress={() => { setLockedWorldIndex(null); setScreen("paywall"); }} />
          </Card>
          <Card>
            <Text style={styles.sectionTitle}>Réglages</Text>
            <Button title="Changer le code PIN" tone="secondary" onPress={() => { setNewPin(""); setScreen("changePin"); }} />
            <Button title="Réinitialiser la progression" tone="danger" onPress={resetProgress} />
            <Text style={styles.smallMuted}>Prototype local. Pour une commercialisation, prévoir une vraie authentification et une synchronisation.</Text>
          </Card>
        </ScrollView>
      </View>}

      {screen === "paywall" && <View style={styles.flex}>
        <Header title="Les aventures Premium" onBack={() => { setLockedWorldIndex(null); setScreen("parents"); }} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.paywallHero}>
            <Image source={{ uri: WORLD_ART.premium }} style={styles.premiumArtwork} resizeMode="cover" accessibilityLabel="Illustration des aventures Premium LIFE KIDS" />
            <Text style={styles.paywallTitle}>Encore quatre mondes à explorer !</Text>
            <Text style={styles.paywallIntro}>Les deux premiers univers restent gratuits. Les extensions permettent de prolonger l'aventure de Pip.</Text>
          </View>
          {PURCHASE_PRODUCTS.map(product => {
            const owned = purchasedProductIds.includes(product.id);
            return <Card key={product.id}>
              <View style={styles.offerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.offerTitle}>{product.title}</Text>
                  <Text style={styles.muted}>{product.description}</Text>
                </View>
                <Text style={styles.offerPrice}>{product.price}</Text>
              </View>
              <Text style={styles.smallMuted}>{owned ? "Déjà débloqué sur cet appareil" : "Déblocage définitif prévu après achat dans la boutique officielle."}</Text>
              <Button title={owned ? "Contenu débloqué ✓" : "Achat bientôt disponible"} tone={owned ? "soft" : "secondary"} disabled={!owned} onPress={() => {}} />
            </Card>;
          })}
          <Card>
            <Text style={styles.sectionTitle}>Pourquoi les achats ne sont-ils pas encore actifs ?</Text>
            <Text style={styles.parentLine}>Cette version prépare les offres et le verrouillage. Les paiements seront activés après configuration des achats intégrés Apple et Google, avec restauration des achats.</Text>
            <Text style={styles.smallMuted}>Aucun paiement n'est effectué dans cette version de test.</Text>
          </Card>
        </ScrollView>
      </View>}

      {screen === "changePin" && <View style={styles.flex}>
        <Header title="Changer le code" onBack={() => setScreen("parents")} />
        <View style={styles.formPage}>
          <Text style={styles.formEmoji}>🔑</Text>
          <Text style={styles.formTitle}>Nouveau code parent</Text>
          <TextInput value={newPin} onChangeText={setNewPin} style={styles.input} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="4 chiffres" />
          <Button title="Enregistrer" onPress={savePin} />
        </View>
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  flex: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  logo: { fontSize: 30, fontWeight: "900", letterSpacing: 2, color: COLORS.deepBlue },
  muted: { color: COLORS.muted, fontSize: 14 },
  home: { padding: 22, paddingBottom: 40, alignItems: "stretch" },
  soundToggle: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "#E8E0D3" },
  soundToggleText: { fontSize: 12, fontWeight: "900", color: COLORS.deepBlue },
  topPill: { alignSelf: "center", backgroundColor: "#E6F5F3", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, marginTop: 14 },
  topPillText: { fontSize: 11, fontWeight: "900", letterSpacing: 1, color: "#287C78" },
  hero: { alignItems: "center", paddingTop: 24, paddingBottom: 20 },
  pipArtwork: { width: 250, height: 190, marginTop: 4, marginBottom: 2 },
  premiumArtwork: { width: "100%", height: 176, borderRadius: 18, marginBottom: 14 },
  mascotStage: { width: 174, height: 154, alignItems: "center", justifyContent: "center", position: "relative" },
  mascotBubble: { width: 132, height: 132, borderRadius: 44, backgroundColor: "#FFDFA0", alignItems: "center", justifyContent: "center", borderWidth: 6, borderColor: "#fff", elevation: 10, shadowColor: "#A47B42", shadowOpacity: .24, shadowRadius: 16, shadowOffset: { width: 0, height: 9 }, zIndex: 2 },
  mascot: { fontSize: 76, textShadowColor: "rgba(53,35,80,.18)", textShadowOffset: { width: 0, height: 5 }, textShadowRadius: 5 },
  mascotShadow: { position: "absolute", bottom: 3, width: 112, height: 18, borderRadius: 20, backgroundColor: "#E8D7B8", opacity: .65 },
  mascotSparkle: { position: "absolute", right: 13, top: 12, width: 29, height: 29, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", elevation: 4, zIndex: 3 },
  brand: { fontSize: 36, fontWeight: "900", letterSpacing: 2, color: COLORS.deepBlue, marginTop: 20 },
  tagline: { fontSize: 15, color: COLORS.muted, marginTop: 5 },
  welcome: { fontSize: 21, fontWeight: "800", color: COLORS.ink, marginTop: 26 },
  smallMuted: { fontSize: 12, color: COLORS.muted, marginTop: 8, lineHeight: 18 },
  statsRow: { flexDirection: "row", gap: 9, marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 17, marginBottom: 14, borderWidth: 1, borderColor: "#F0E8D8", elevation: 2, shadowColor: "#9A835E", shadowOpacity: .07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 13, paddingHorizontal: 4, marginBottom: 0 },
  statIcon: { fontSize: 19 },
  statNumber: { fontSize: 20, fontWeight: "900", color: COLORS.ink, marginTop: 3 },
  statLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "700", marginTop: 1 },
  button: { backgroundColor: COLORS.orange, borderRadius: 15, minHeight: 52, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 13, marginTop: 10, elevation: 2, shadowColor: "#A65B18", shadowOpacity: .12, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  buttonSecondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E9EF", elevation: 0 },
  buttonSoft: { backgroundColor: "#E6F5F3", elevation: 0 },
  buttonDanger: { backgroundColor: "#FCE8E5", elevation: 0 },
  buttonDisabled: { opacity: .45 },
  buttonText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  buttonTextDark: { color: COLORS.ink },
  footerNote: { alignItems: "center", marginTop: 20 },
  footerText: { fontSize: 11, color: COLORS.muted, textAlign: "center" },
  header: { height: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#EEE6D8", backgroundColor: COLORS.cream },
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 30, lineHeight: 32, color: COLORS.ink, marginTop: -4 },
  headerTitle: { fontSize: 17, fontWeight: "900", color: COLORS.ink, flex: 1, textAlign: "center" },
  headerStat: { fontSize: 12, fontWeight: "800", color: COLORS.deepBlue },
  content: { padding: 18, paddingBottom: 40 },
  worldBanner: { borderRadius: 28, padding: 23, alignItems: "center", marginBottom: 20, borderWidth: 3, borderColor: "rgba(255,255,255,.7)", elevation: 7, shadowColor: "#566879", shadowOpacity: .16, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  worldBannerTitle: { fontSize: 22, fontWeight: "900", color: "#18304B", marginTop: 8, textAlign: "center" },
  worldBannerText: { fontSize: 13, color: "#29465B", textAlign: "center", lineHeight: 19, marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: COLORS.ink, marginBottom: 12 },
  missionRow: { backgroundColor: "#fff", borderRadius: 19, padding: 14, marginBottom: 11, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#F0E8D8", elevation: 2, shadowColor: "#8B7B60", shadowOpacity: .06, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  missionNumber: { width: 39, height: 39, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  missionNumberText: { fontWeight: "900", fontSize: 16, color: COLORS.ink },
  missionTitle: { fontSize: 14, fontWeight: "800", color: COLORS.ink },
  missionSub: { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  activityPage: { padding: 16, paddingBottom: 32 },
  activityWorld: { borderRadius: 22, padding: 15, alignItems: "center", marginBottom: 14 },
  activityMission: { fontSize: 18, fontWeight: "900", color: COLORS.ink, marginTop: 5 },
  progressTrack: { height: 9, backgroundColor: "#E6E8E9", borderRadius: 20, overflow: "hidden", marginBottom: 9 },
  progressFill: { height: 9, backgroundColor: COLORS.green, borderRadius: 20 },
  activityCount: { fontSize: 11, fontWeight: "900", letterSpacing: 1, color: COLORS.muted, textAlign: "center", marginBottom: 12 },
  questionCard: { padding: 18 },
  pipMini: { fontSize: 12, fontWeight: "800", color: COLORS.orange, textAlign: "center", marginBottom: 13 },
  gameModePill: { alignSelf: "center", overflow: "hidden", backgroundColor: "#EAF5FF", color: COLORS.deepBlue, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 7, fontSize: 11, fontWeight: "900", marginBottom: 12 },
  statementBox: { backgroundColor: "#FFF3D8", borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#F2D99D" },
  statementText: { color: COLORS.ink, fontSize: 17, lineHeight: 24, textAlign: "center", fontWeight: "800" },
  sortItem: { backgroundColor: "#F6F8FB", borderRadius: 16, padding: 11, marginBottom: 9, borderWidth: 1, borderColor: "#E6EAF0" },
  sortItemText: { fontSize: 14, fontWeight: "800", color: COLORS.ink, textAlign: "center", marginBottom: 8 },
  sortBinRow: { flexDirection: "row", gap: 7 },
  sortBin: { flex: 1, borderRadius: 11, paddingVertical: 9, paddingHorizontal: 5, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE4EC", minHeight: 42, justifyContent: "center" },
  sortBinActive: { backgroundColor: "#DDF5E7", borderColor: COLORS.green, borderWidth: 2 },
  sortBinText: { fontSize: 10, fontWeight: "900", textAlign: "center", color: COLORS.deepBlue },
  sortBinTextActive: { color: "#176B4A" },
  sequenceProgress: { backgroundColor: "#EAF5FF", borderRadius: 12, padding: 10, marginBottom: 12 },
  sequenceProgressText: { textAlign: "center", fontSize: 12, fontWeight: "900", color: COLORS.deepBlue },
  matchRow: { backgroundColor: "#F6F8FB", borderRadius: 16, padding: 10, marginBottom: 10, flexDirection: "row", gap: 9, alignItems: "center" },
  matchLeft: { width: "28%", fontSize: 13, fontWeight: "900", color: COLORS.deepBlue, textAlign: "center" },
  matchOption: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 8, borderWidth: 1, borderColor: "#DCE4EC" },
  matchOptionText: { fontSize: 11, fontWeight: "700", color: COLORS.ink, textAlign: "center" },
  question: { fontSize: 21, fontWeight: "900", color: COLORS.ink, textAlign: "center", lineHeight: 28, marginBottom: 20 },
  answer: { minHeight: 57, borderRadius: 15, backgroundColor: "#F5F7FA", borderWidth: 1, borderColor: "#E5EAF0", flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 10, gap: 11 },
  answerCorrect: { backgroundColor: "#E1F5E8", borderColor: COLORS.green, borderWidth: 2 },
  answerWrong: { backgroundColor: "#FCE9E6", borderColor: "#E48A7C", borderWidth: 2 },
  answerLetter: { width: 30, height: 30, borderRadius: 10, backgroundColor: "#fff", textAlign: "center", textAlignVertical: "center", overflow: "hidden", fontWeight: "900", color: COLORS.ink, paddingTop: 5 },
  answerText: { fontSize: 14, fontWeight: "700", color: COLORS.ink, flex: 1 },
  hint: { fontSize: 12, color: COLORS.muted, textAlign: "center", lineHeight: 18, marginTop: 8 },
  feedbackBox: { borderRadius: 16, padding: 14, marginTop: 7 },
  feedbackGood: { backgroundColor: "#E4F6E9" },
  feedbackTry: { backgroundColor: "#FFF1D9" },
  feedbackTitle: { fontSize: 16, fontWeight: "900", color: COLORS.ink },
  feedbackText: { fontSize: 13, color: COLORS.ink, lineHeight: 19, marginTop: 5 },
  rewardPage: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  rewardStars: { fontSize: 27, marginBottom: 18 },
  rewardMascot: { width: 130, height: 130, borderRadius: 44, backgroundColor: "#FFE2A9", alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: "#fff" },
  rewardTitle: { fontSize: 30, fontWeight: "900", color: COLORS.deepBlue, marginTop: 22 },
  rewardSubtitle: { fontSize: 15, color: COLORS.muted, marginTop: 8, textAlign: "center" },
  rewardPills: { flexDirection: "row", gap: 10, marginTop: 22 },
  rewardPill: { backgroundColor: "#fff", paddingHorizontal: 15, paddingVertical: 12, borderRadius: 16, fontWeight: "900", color: COLORS.ink, overflow: "hidden" },
  rewardTotal: { fontSize: 13, color: COLORS.muted, marginTop: 18, textAlign: "center" },
  formPage: { flex: 1, justifyContent: "center", padding: 24 },
  formEmoji: { fontSize: 54, textAlign: "center", marginBottom: 16 },
  formTitle: { fontSize: 24, fontWeight: "900", color: COLORS.ink, textAlign: "center", marginBottom: 22 },
  formHelp: { fontSize: 14, color: COLORS.muted, textAlign: "center", lineHeight: 21, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "800", color: COLORS.ink, marginTop: 13, marginBottom: 7 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6E1D8", borderRadius: 14, padding: 15, fontSize: 17, color: COLORS.ink },
  ageRow: { flexDirection: "row", gap: 10, marginBottom: 22 },
  ageChoice: { flex: 1, padding: 15, backgroundColor: "#fff", borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#E6E1D8" },
  ageChoiceActive: { backgroundColor: COLORS.deepBlue, borderColor: COLORS.deepBlue },
  ageText: { fontWeight: "900", color: COLORS.ink },
  parentLine: { fontSize: 14, color: COLORS.ink, marginBottom: 10 },
  parentProgress: { height: 10, backgroundColor: "#EDF0F1", borderRadius: 20, overflow: "hidden", marginTop: 10 },
  parentProgressFill: { height: 10, backgroundColor: COLORS.green, borderRadius: 20 },
  mapScreen: { flex: 1, backgroundColor: "#BDEBFA" },
  mapContent: { padding: 16, paddingBottom: 34 },
  mapHero: { backgroundColor: "#EAF9FF", borderRadius: 28, padding: 18, alignItems: "center", marginBottom: 18, borderWidth: 2, borderColor: "#FFFFFF", elevation: 5, shadowColor: "#326B91", shadowOpacity: .16, shadowRadius: 9, shadowOffset: { width: 0, height: 5 } },
  mapHeroIcon: { fontSize: 27, marginBottom: 5 },
  mapHeroTitle: { fontSize: 23, fontWeight: "900", color: "#173B5B", textAlign: "center" },
  mapHeroSub: { fontSize: 12, color: "#42677F", textAlign: "center", marginTop: 5 },
  mapProgressTrack: { width: "88%", height: 9, backgroundColor: "#D1E7EF", borderRadius: 20, overflow: "hidden", marginTop: 14 },
  mapProgressFill: { height: 9, backgroundColor: "#25A879", borderRadius: 20 },
  mapProgressLabel: { fontSize: 10, fontWeight: "800", color: "#42677F", marginTop: 5 },
  islandGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 14 },
  islandCard: { width: "48.3%", minHeight: 190, borderRadius: 30, padding: 12, alignItems: "center", justifyContent: "flex-start", borderWidth: 3, borderColor: "rgba(255,255,255,.9)", elevation: 8, shadowColor: "#28506A", shadowOpacity: .22, shadowRadius: 10, shadowOffset: { width: 0, height: 7 }, overflow: "hidden" },
  islandPressed: { transform: [{ translateY: 3 }, { scale: .98 }], elevation: 3 },
  lockedRibbon: { position: "absolute", top: 12, right: 10, backgroundColor: "rgba(255,255,255,.92)", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  lockedRibbonText: { fontSize: 9, fontWeight: "900", color: "#695B86", letterSpacing: .7 },
  paywallHero: { alignItems: "center", backgroundColor: "#EAF5F4", borderRadius: 22, padding: 22, marginBottom: 16 },
  paywallTitle: { fontSize: 22, fontWeight: "900", color: COLORS.deepBlue, textAlign: "center", marginTop: 10 },
  paywallIntro: { fontSize: 14, color: COLORS.muted, textAlign: "center", lineHeight: 21, marginTop: 8 },
  offerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  offerTitle: { fontSize: 16, fontWeight: "900", color: COLORS.deepBlue, marginBottom: 5 },
  offerPrice: { fontSize: 20, fontWeight: "900", color: COLORS.green },
  islandTopGlow: { position: "absolute", top: -26, left: 12, right: 12, height: 64, borderRadius: 50, backgroundColor: "rgba(255,255,255,.25)" },
  islandBadge: { width: 76, height: 76, borderRadius: 27, backgroundColor: "rgba(255,255,255,.86)", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,.95)", elevation: 4, shadowColor: "#314B60", shadowOpacity: .15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, marginTop: 3 },
  islandEmoji: { fontSize: 42 },
  islandNumber: { fontSize: 9, fontWeight: "900", letterSpacing: 1.2, color: "rgba(24,48,75,.65)", marginTop: 8 },
  islandName: { fontSize: 13, fontWeight: "900", color: "#18304B", textAlign: "center", marginTop: 3, minHeight: 34 },
  islandBottom: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, backgroundColor: "rgba(255,255,255,.68)", borderRadius: 18, paddingHorizontal: 9, paddingVertical: 7 },
  islandDone: { fontSize: 10, fontWeight: "900", color: "#23415B" },
  islandGo: { fontSize: 10, fontWeight: "900", color: "#23415B" },
  islandBase: { position: "absolute", bottom: -13, left: 15, right: 15, height: 20, borderRadius: 20, backgroundColor: "rgba(75,65,45,.12)" },
  mapTip: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFF8E9", borderRadius: 22, padding: 14, marginTop: 18, borderWidth: 2, borderColor: "#FFFFFF", elevation: 3 },
  mapTipIcon: { fontSize: 34 },
  mapTipText: { flex: 1, fontSize: 12, fontWeight: "700", color: "#29465B", lineHeight: 18 },

  // Direction artistique premium LIFE KIDS : bleu nuit, ivoire, or doux et illustrations peintes.
  homeHeroArt: { width: "100%", height: 230, marginTop: 12, marginBottom: 4, borderRadius: 22, overflow: "hidden" },
  islandArtwork: { position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: 112, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  missionArtwork: { width: "100%", height: 132, borderRadius: 18, marginBottom: 10 },
  activityPipArt: { width: 104, height: 74, marginBottom: 2 },
  rewardPipArt: { width: 150, height: 105 },
  profilePipArt: { width: 58, height: 48 },
  safe: { flex: 1, backgroundColor: "#EEF3F7" },
  home: { padding: 18, paddingBottom: 42, alignItems: "stretch", backgroundColor: "#EEF3F7" },
  topPill: { alignSelf: "center", backgroundColor: "#173B5E", paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22, marginTop: 8 },
  topPillText: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5, color: "#F5D78B" },
  soundToggle: { backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "#DCE5EC" },
  soundToggleText: { fontSize: 11, fontWeight: "800", color: "#244B70" },
  brand: { fontSize: 34, fontWeight: "900", letterSpacing: 1.2, color: "#173B5E", marginTop: 5 },
  tagline: { fontSize: 14, color: "#718096", marginTop: 4, fontWeight: "600" },
  welcome: { fontSize: 21, fontWeight: "800", color: "#15283F", marginTop: 18 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 17, marginBottom: 13, borderWidth: 1, borderColor: "#E2EAF0", elevation: 3, shadowColor: "#173B5E", shadowOpacity: .07, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  button: { backgroundColor: "#DDA83D", borderRadius: 16, minHeight: 52, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, paddingVertical: 13, marginTop: 10, elevation: 2, shadowColor: "#173B5E", shadowOpacity: .12, shadowRadius: 7, shadowOffset: { width: 0, height: 3 } },
  buttonSecondary: { backgroundColor: "#173B5E", borderWidth: 1, borderColor: "#173B5E", elevation: 0 },
  buttonSoft: { backgroundColor: "#E3EDF3", elevation: 0 },
  buttonText: { fontSize: 15, fontWeight: "800", color: "#172B43" },
  buttonTextDark: { color: "#173B5E" },
  header: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#DDE6ED", backgroundColor: "#F8FAFC" },
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#E8EFF4", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#173B5E", flex: 1, textAlign: "center" },
  content: { padding: 16, paddingBottom: 36 },
  worldBanner: { borderRadius: 22, padding: 14, alignItems: "center", marginBottom: 18, borderWidth: 1, borderColor: "#DDE7EE", elevation: 3, shadowColor: "#173B5E", shadowOpacity: .08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  worldBannerTitle: { fontSize: 21, fontWeight: "900", color: "#173B5E", marginTop: 6, textAlign: "center" },
  worldBannerText: { fontSize: 13, color: "#53677C", textAlign: "center", lineHeight: 19, marginTop: 5 },
  islandCard: { minHeight: 174, borderRadius: 20, padding: 12, paddingTop: 116, alignItems: "center", justifyContent: "flex-end", borderWidth: 1, borderColor: "#DCE6ED", backgroundColor: "#FFFFFF", overflow: "hidden", elevation: 4, shadowColor: "#173B5E", shadowOpacity: .12, shadowRadius: 9, shadowOffset: { width: 0, height: 4 } },
  islandName: { fontSize: 13, fontWeight: "900", color: "#173B5E", textAlign: "center", marginTop: 3 },
  islandNumber: { fontSize: 9, fontWeight: "900", letterSpacing: 1.4, color: "#8797A8" },
  islandBadge: { position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,.94)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E3EAF0" },
  islandEmoji: { fontSize: 16 },
  islandBottom: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 7 },
  islandDone: { color: "#718096", fontSize: 10, fontWeight: "800" },
  islandGo: { color: "#1E6D63", fontSize: 10, fontWeight: "900" },
  lockedRibbon: { position: "absolute", top: 10, left: 8, backgroundColor: "#173B5E", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10 },
  lockedRibbonText: { color: "#F6D98C", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  missionRow: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#E2EAF0", elevation: 2, shadowColor: "#173B5E", shadowOpacity: .05, shadowRadius: 7, shadowOffset: { width: 0, height: 3 } },
  missionNumber: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#E8EFF4" },
  missionTitle: { fontSize: 14, fontWeight: "800", color: "#173B5E" },
  activityWorld: { borderRadius: 20, padding: 12, alignItems: "center", marginBottom: 14, borderWidth: 1, borderColor: "#DDE7EE" },
  questionCard: { padding: 19, borderRadius: 22 },
  question: { color: "#172B43", fontSize: 18, lineHeight: 26, textAlign: "center", fontWeight: "800" },
  answer: { backgroundColor: "#F7FAFC", borderRadius: 15, padding: 14, marginTop: 9, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#DCE6ED" },
  answerCorrect: { backgroundColor: "#E2F3EC", borderColor: "#6CB99A" },
  rewardPage: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#EAF1F6" },
  mapContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 38, backgroundColor: "#EAF2F7" },
  mapHeroCompact: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 17, marginBottom: 22, borderWidth: 1, borderColor: "#DCE6EE", flexDirection: "row", alignItems: "center", gap: 14, elevation: 2, shadowColor: "#173B5E", shadowOpacity: .07, shadowRadius: 8, shadowOffset: {width:0,height:3} },
  mapHeroCopy: { flex: 1 },
  mapHeroEyebrow: { fontSize: 9, letterSpacing: 1.2, fontWeight: "900", color: "#B18435", marginBottom: 5 },
  mapHeroTitle: { fontSize: 22, fontWeight: "900", color: "#173B5E" },
  mapHeroSub: { fontSize: 12, color: "#61758A", lineHeight: 17, marginTop: 5 },
  mapProgressLine: { width: 92, alignItems: "center" },
  mapProgressTrack: { width: "100%", height: 8, backgroundColor: "#E5EDF3", borderRadius: 20, overflow: "hidden", marginTop: 0 },
  mapProgressFill: { height: 8, backgroundColor: "#2A9B78", borderRadius: 20 },
  mapProgressLabel: { fontSize: 10, fontWeight: "800", color: "#61758A", marginTop: 6 },
  worldSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11, paddingHorizontal: 2 },
  worldSectionTitle: { fontSize: 17, fontWeight: "900", color: "#173B5E" },
  worldSectionCount: { fontSize: 9, fontWeight: "900", letterSpacing: 1, color: "#71869A" },
  islandGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 14 },
  islandCard: { width: "48.4%", height: 206, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE6ED", overflow: "hidden", elevation: 3, shadowColor: "#173B5E", shadowOpacity: .10, shadowRadius: 8, shadowOffset: {width:0,height:4} },
  islandArtwork: { width: "100%", height: 132, backgroundColor: "#DDEAF2" },
  islandCardFooter: { flex: 1, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 8, justifyContent: "center" },
  islandName: { fontSize: 12, lineHeight: 16, fontWeight: "900", color: "#173B5E", textAlign: "left", minHeight: 30 },
  islandBottom: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5 },
  islandDone: { color: "#718096", fontSize: 9, fontWeight: "800" },
  islandGo: { color: "#1E6D63", fontSize: 10, fontWeight: "900" },
  worldAccessPill: { position: "absolute", top: 8, left: 8, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 5 },
  worldFreePill: { backgroundColor: "#E0F4E9" },
  worldLockedPill: { backgroundColor: "#173B5E" },
  worldAccessText: { fontSize: 8, fontWeight: "900", letterSpacing: .5, color: "#173B5E" },
  mapPremiumBanner: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#173B5E", borderRadius: 20, padding: 15, marginTop: 24 },
  mapPremiumIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#F5D98E", alignItems: "center", justifyContent: "center" },
  mapPremiumTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  mapPremiumText: { color: "#DCE8F1", fontSize: 10, marginTop: 4, lineHeight: 14 },
  mapPremiumArrow: { color: "#F5D98E", fontSize: 30, fontWeight: "300" },
  paywallHero: { backgroundColor: "#173B5E", borderRadius: 22, padding: 14, marginBottom: 16 },
  paywallTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "center", marginTop: 5 },
  paywallIntro: { color: "#DCE8F0", fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 },

});