# LIFE KIDS – Application éducative premium (6-8 ans)

## Installation (Expo Snack ou projet local)

### Expo Snack
1. Va sur https://snack.expo.dev
2. Crée un nouveau Snack
3. Ajoute les fichiers suivants (copie-colle le contenu) :
   - `App.js`
   - `package.json`
   - Dossier `data/` avec tous les fichiers listés ci-dessous
4. Conserve tes fichiers audio dans `assets/audio/` :
   - life_kids_theme.wav
   - tap.wav
   - correct.wav
   - try_again.wav
   - reward.wav
5. Lance sur Web / Android / iOS (Expo Go)

### Projet local
```bash
npx create-expo-app life-kids --template blank
cd life-kids
# Remplace package.json et App.js
# Crée le dossier data/ et ajoute les fichiers
npm install
npx expo start
```

## Fonctionnalités terminées
- 6 mondes conservés avec identité visuelle
- 36 missions distinctes
- 180 activités pédagogiques uniques (5 par mission)
- Structure pédagogique : Découvrir → Observer → Comprendre → Agir → Défi final
- Adaptation au profil (6 / 7 / 8 ans)
- Système d’explications + indices + encouragement
- XP, pièces, badges de compétences, trophées par monde
- Espace parents enrichi (progression, notions à retravailler, PIN prototype)
- Sauvegarde AsyncStorage
- Audio conservé
- Compatible Web / Android / iOS

## À faire avant commercialisation
- Vraie authentification parent (remplacer le PIN prototype)
- Synchronisation multi-appareils
- Illustrations 2D/3D professionnelles (actuellement emojis + couleurs)
- Tests sur appareils réels
- Accessibilité renforcée
- Analytics pédagogiques anonymisés

## Âges
Le contenu s’adapte automatiquement selon l’âge choisi dans le profil.
