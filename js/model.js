// ===================================
// model.js
// fichier regroupement les fonctions :
// - de gestion des timer
// - converstion de temps
// - gestion des compteurs de tour et joueur actif
// ===================================

//================================
// Création des joueurs
//================================
export const joueurs = {
  1: {
    tempsPartie: 0,
    tempsRestantGlobal: 0,
    tempsTour: 0,
    toursRestants: 0,
    numeroTour: 0,
    compteurTour: 0,
    timerLoop: null,
    $btnStart: null,
  },
  2: {
    tempsPartie: 0,
    tempsRestantGlobal: 0,
    tempsTour: 0,
    toursRestants: 0,
    numeroTour: 0,
    compteurTour: 0,
    timerLoop: null,
    $btnStart: null,
  },
};

const nombreDeJoueurs = Object.keys(joueurs).length;

//=================================
// Paramètre lié au règle du jeu
//==================================

export const MAX_TOURS = 16;
export const MI_TEMPS = 8;

// =====================================================
// Fonction de convertion minute en minutes + secondes
// =====================================================
export function convertMinutesToMinutesAndSeconds(minutesFloat) {
  const totalSeconds = minutesFloat * 60;
  const seconds = totalSeconds % 60;
  const remainingMinutes = (totalSeconds - seconds) / 60;
  return {
    minutes: Math.trunc(remainingMinutes),
    secondes: seconds.toFixed(0),
  };
}

// =======================================
// Calculer et initialiser les temps
// =======================================

export const NbTourParJoueur = 16;

export function calculerTempsInitiaux(
  heuresPartieChoisies,
  minutesPartieChoisies,
) {
  const tempsPartieTotalMinutes =
    Number.parseInt(heuresPartieChoisies, 10) * 60 +
    Number.parseInt(minutesPartieChoisies, 10);

  // Temps de Tour en minutes (float)
  const tempsTourMinutes = tempsPartieTotalMinutes / (NbTourParJoueur * 2);

  // Temps total en secondes
  const tempsPartieTotalSecondes = tempsPartieTotalMinutes * 60;
  const tempsTourSecondes = tempsTourMinutes * 60;

  // Mise à jour de l'état global (en secondes)
  for (let ii = 1; ii <= nombreDeJoueurs; ii++) {
    joueurs[ii].tempsPartie = tempsPartieTotalSecondes / nombreDeJoueurs;
    joueurs[ii].tempsTour = tempsTourSecondes;
  }

  // Retourne la valeur pour l'affichage
  return convertMinutesToMinutesAndSeconds(tempsTourMinutes);
}

export function calculerTempsEncours(
  joueur,
  heuresPartieEncours,
  minutesPartieEncours,
  tourEncours,
) {
  const tempsPartieTotalMinutes =
    Number.parseInt(heuresPartieEncours, 10) * 60 +
    Number.parseInt(minutesPartieEncours, 10);

  // Temps de Tour en minutes (float)
  const tempsTourMinutes = tempsPartieTotalMinutes / tourEncours;

  // Temps total en secondes
  const tempsPartieTotalSecondes = tempsPartieTotalMinutes * 60;
  const tempsTourSecondes = tempsTourMinutes * 60;

  // Mise à jour de l'état global (en secondes) uniquement pour le joueur actif
  joueurs[joueur].tempsPartie = tempsPartieTotalSecondes;
  joueurs[joueur].tempsTour = tempsTourSecondes;

  // Retourne la valeur pour l'affichage
  return convertMinutesToMinutesAndSeconds(tempsTourMinutes);
}

// =======================================
// Mise à jour de l'état (fonctions de jeu)
// =======================================

export function setCompteurTour(numeroJoueur, nouvelleValeur) {
  joueurs[numeroJoueur].compteurTour = nouvelleValeur;
}

// Variables pour les IDs des intervalles, utilisé pour arrêter les timers
export let timerIdJ1 = null;
export let timerTourIdJ1 = null;
export let timerIdJ2 = null;
export let timerTourIdJ2 = null;

// null = pas démarré, 1 = J1, 2 = J2
export let joueurActif = null;

// L'intervalle de temps (1 seconde) etn epas descendre sous zéro
export function decrementerTemps(joueurActif) {
  joueurs[joueurActif].tempsPartie = Math.max(0, joueurs[joueurActif].tempsPartie - 1);
  joueurs[joueurActif].tempsTour = Math.max(0, joueurs[joueurActif].tempsTour - 1);
}

export function reinitialiserTour(numeroJoueur) {
  const joueur = joueurs[numeroJoueur];

  // Calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  joueur.tempsRestantGlobal = joueur.tempsPartie;
  joueur.toursRestants = NbTourParJoueur - joueur.compteurTour;

  if (joueur.toursRestants > 0) {
    joueur.tempsTour = joueur.tempsRestantGlobal / joueur.toursRestants;
  }
}

export function passerAuJoueur(numeroJoueur) {
  const joueur = joueurs[numeroJoueur];
  joueur.compteurTour += 1;
  joueurActif = numeroJoueur;
}

// =======================================
// Mise à jour de l'état du compteur Pause
// =======================================

export const PAUSE_ON = 1;
export const PAUSE_OFF = 0;
let compteurPause = PAUSE_OFF;

export function basculerPause() {
  if (compteurPause === PAUSE_OFF) {
    compteurPause = PAUSE_ON;
  } else compteurPause = PAUSE_OFF;
  return compteurPause;
}
