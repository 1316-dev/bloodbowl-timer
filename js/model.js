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
      tempsPartie : 0,
        tempsRestantGlobal : 0,
        timerPartie: 0,
        timerTour: 0,
        toursRestants: 0,
        numeroTour: 0,
        compteurTour: 0,
        $btnStart : null
        
    
    },
    2: {
       tempsPartie : 0,
        tempsRestantGlobal : 0,
        timerPartie: 0,
        timerTour: 0,
        toursRestants: 0,
        numeroTour: 0,
        compteurTour: 0,
        $btnStart : null
    }
};


//=================================
// Paramètre lié au règle du jeu
//==================================

export const MAX_TOURS = 17;
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
    parseInt(heuresPartieChoisies) * 60 + parseInt(minutesPartieChoisies);

  // Temps de Tour en minutes (float)
  const tempsTourMinutes = tempsPartieTotalMinutes / (NbTourParJoueur * 2);

  // Temps total en secondes
  const tempsPartieTotalSecondes = tempsPartieTotalMinutes * 60;
  const tempsTourSecondes = tempsTourMinutes * 60;

  // Mise à jour de l'état global (en secondes)
  joueurs[1].tempsPartie = tempsPartieTotalSecondes / 2;
  joueurs[1].tempsTour = tempsTourSecondes;
  joueurs[2].tempsPartie = tempsPartieTotalSecondes / 2;
  joueurs[2].tempsTour = tempsTourSecondes;

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
    parseInt(heuresPartieEncours) * 60 + parseInt(minutesPartieEncours);

  // Temps de Tour en minutes (float)
  const tempsTourMinutes = tempsPartieTotalMinutes / tourEncours;

  // Temps total en secondes
  const tempsPartieTotalSecondes = tempsPartieTotalMinutes * 60;
  const tempsTourSecondes = tempsTourMinutes * 60;

  // Mise à jour de l'état global (en secondes)
  if (joueur === 1) {
    joueurs[1].tempsPartie = tempsPartieTotalSecondes;
    joueurs[1].tempsTour = tempsTourSecondes;
  } else if (joueur === 2) {
    joueurs[2].tempsPartie = tempsPartieTotalSecondes;
    joueurs[2].tempsTour = tempsTourSecondes;
  }

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

// L'intervalle de temps (1 seconde)
export function decrementerTemps() {
  if (joueurActif === 1) {
    joueurs[1].tempsPartie = joueurs[1].tempsPartie <= 0 ? 0 : joueurs[1].tempsPartie - 1;
    joueurs[1].tempsTour = joueurs[1].tempsTour <= 0 ? 0 : joueurs[1].tempsTour - 1;
  } else if (joueurActif === 2) {
    joueurs[2].tempsPartie = joueurs[2].tempsPartie <= 0 ? 0 : joueurs[2].tempsPartie - 1;
    joueurs[2].tempsTour = joueurs[2].tempsTour <= 0 ? 0 : joueurs[2].tempsTour - 1;
  }
}


export function reinitialiserTour(numeroJoueur) {
    const joueur = joueurs[numeroJoueur];

  // Calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
    joueur.tempsRestantGlobal = joueur.tempsPartie;
    joueur.toursRestants = NbTourParJoueur - joueur.compteurTour;
    
    if (joueur.toursRestants > 0) {
      // IMPORTANT : on réinitialise le tour du prochain joueur
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

export function etatCompteurPause() {
  if (compteurPause === PAUSE_OFF) {
    compteurPause = PAUSE_ON;
  } else compteurPause = PAUSE_OFF;
  return compteurPause;
}
