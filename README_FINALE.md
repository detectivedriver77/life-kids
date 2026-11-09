# LIFE KIDS — version enrichie du prototype Expo

Application éducative mobile destinée aux enfants de 6 à 8 ans. Projet Expo SDK 54 / React Native 0.81 / React 19.

## Ce que contient cette version

- 6 mondes, 36 missions et 180 étapes pédagogiques (5 par mission).
- Histoires adaptées au profil d'âge (6, 7 ou 8 ans).
- Plusieurs formats d'interaction : histoire, choix illustré en cartes, vrai/faux, repérer un choix à éviter, tri par catégories, association et remise en ordre.
- Mini-jeux dédiés : besoins/envies, panier varié, hygiène des mains, rangement, sécurité domestique, entraide, pièces de monnaie et préparation du sac.
- Réponses mélangées de manière stable pour éviter que la bonne réponse soit toujours à la même place.
- Feedback, explications, indices selon l'âge et mémorisation des notions à retravailler.
- Récompense de mission accordée une seule fois, même si la mission est rejouée.
- Jusqu'à 5 profils enfants, progression séparée par profil et sauvegarde locale AsyncStorage.
- Musique et effets sonores avec expo-audio.
- PIN parental stocké sous forme de hash SHA-256 avec sel via expo-crypto. Les anciens PIN en clair sont migrés au prochain accès réussi.

## Lancer le projet

1. Décompresser le ZIP.
2. Dans le dossier `life-kids`, installer les dépendances : `npm install`.
3. Démarrer Expo : `npx expo start`.
4. Scanner le QR code avec Expo Go ou ouvrir le projet dans un navigateur avec la touche `w`.

Commandes utiles :

- `npx expo start --android`
- `npx expo start --ios`
- `npx expo start --web`

## Dépendances importantes

- `expo ~54.0.37`
- `expo-audio ~1.1.1`
- `expo-crypto ~15.0.8`
- `@react-native-async-storage/async-storage 2.2.0`

## Contrôles effectués sur les fichiers

- Analyse syntaxique JSX/JavaScript avec TypeScript transpileModule : aucune erreur de syntaxe détectée.
- Contrôle statique du catalogue : 6 mondes, 36 missions, 180 étapes de base, 36 histoires et 144 fiches-question ; aucun index de bonne réponse hors limites.
- Les mini-jeux personnalisés remplacent certaines étapes de défi, sans augmenter le nombre d'étapes par mission.
- Vérification de la présence des cinq fichiers audio référencés par App.js.

## Limites à connaître avant toute diffusion publique

Cette livraison est une version de développement enrichie, pas une certification de mise en production. Les contrôles statiques ne remplacent pas un test sur appareils Android et iOS physiques, ni une recette complète du parcours enfant/parent.

- Les données restent locales à l'appareil : aucune synchronisation cloud, aucun compte parent distant.
- Le PIN haché est une protection de confort locale, pas un système d'authentification forte. Un code à 4 chiffres reste devinable.
- La direction artistique utilise encore des illustrations/emoji et des composants React Native ; ce n'est pas un monde 3D temps réel.
- Les 180 étapes sont structurées et jouables, mais les contenus pédagogiques doivent être relus par un professionnel de l'éducation avant commercialisation.
- Il reste à effectuer les tests de bout en bout sur Expo Go iOS/Android, les builds EAS, l'accessibilité, les sauvegardes/restaurations et les politiques de confidentialité pour une application destinée aux enfants.

## Structure

- `App.js` : application, parcours, moteurs d'interaction et progression.
- `worlds.js`, `missions.js` et fichiers de contenu par monde : catalogue de référence historique du prototype.
- `assets/audio/` : musique et effets sonores.
- `app.json` / `package.json` : configuration Expo et dépendances.

## Modèle hybride – version 1.2
- Univers gratuits : `money` (L'île de l'argent) et `shops` (Le village des courses).
- Univers verrouillés : `wellbeing`, `home`, `safety`, `help`.
- Catalogue tarifaire de préparation : chaque extension 2,99 €, pack intégral 9,99 €.
- L'accès est vérifié à l'ouverture du monde et au démarrage d'une mission.
- Le parent doit passer par le PIN avant d'accéder à la page des offres.
- Les identifiants d'achats sont prévus dans la sauvegarde familiale locale (`purchasedProductIds`).
- IMPORTANT : les boutons d'achat restent volontairement inactifs dans cette version. Aucun paiement réel n'est traité. Il faut configurer les produits Apple App Store / Google Play et intégrer une bibliothèque d'achats intégrés dans un build natif (Expo Go ne suffit pas pour valider les achats).
- Prix proposés à tester, non validés par une étude de marché.
