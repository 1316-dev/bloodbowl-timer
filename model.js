// ===================================
// model.js
// ===================================

// Constantes
export const NbTourParJoueur = 16;
// null = pas démarré, 1 = J1, 2 = J2
export let joueurActif = null; 

// Variables d'état (temps en secondes)
export let tempsPartieJ1 = 0;
export let tempsTourJ1 = 0;
export let tempsPartieJ2 = 0;
export let tempsTourJ2 = 0;
export let compteurTourJ1 = 0;
export let compteurTourJ2 = 0;

// Variables pour les IDs des intervalles, utilisé pour arrêter les timers
export let timerIdJ1 = null;
export let timerTourIdJ1 = null;
export let timerIdJ2 = null;
export let timerTourIdJ2 = null;


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
export function calculerTempsInitiaux(heuresPartieChoisies, minutesPartieChoisies) {
    const tempsPartieTotalMinutes =
        parseInt(heuresPartieChoisies) * 60 + parseInt(minutesPartieChoisies);
    
    // Temps de Tour en minutes (float)
    const tempsTourMinutes = tempsPartieTotalMinutes / (NbTourParJoueur * 2); 
    
    // Temps total en secondes
    const tempsPartieTotalSecondes = tempsPartieTotalMinutes * 60;
    const tempsTourSecondes = tempsTourMinutes * 60;

    // Mise à jour de l'état global (en secondes)
    tempsPartieJ1 = tempsPartieTotalSecondes / 2;
    tempsTourJ1 = tempsTourSecondes;
    tempsPartieJ2 = tempsPartieTotalSecondes / 2;
    tempsTourJ2 = tempsTourSecondes;

    // Retourne la valeur pour l'affichage
    return convertMinutesToMinutesAndSeconds(tempsTourMinutes); 
}

// =======================================
// Mise à jour de l'état (fonctions de jeu)
// =======================================

// L'intervalle de temps (1 seconde)
export function decrementerTemps() {
    if (joueurActif === 1) {
        tempsPartieJ1 = tempsPartieJ1 <= 0 ? 0 : tempsPartieJ1 - 1;
        tempsTourJ1 = tempsTourJ1 <= 0 ? 0 : tempsTourJ1 - 1;
    } else if (joueurActif === 2) {
        tempsPartieJ2 = tempsPartieJ2 <= 0 ? 0 : tempsPartieJ2 - 1;
        tempsTourJ2 = tempsTourJ2 <= 0 ? 0 : tempsTourJ2 - 1;
    }
}

export function reinitialiserTour(joueur) {
    // Calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
    if (joueur === 1) {
        const tempsRestantGlobal = tempsPartieJ1; 
        const toursRestants = NbTourParJoueur - compteurTourJ1;
        if (toursRestants > 0) {
            // IMPORTANT : on réinitialise le tour du prochain joueur
            tempsTourJ2 = tempsRestantGlobal / toursRestants; 
        }
    } else if (joueur === 2) {
        const tempsRestantGlobal = tempsPartieJ2;
        const toursRestants = NbTourParJoueur - compteurTourJ2;
        if (toursRestants > 0) {
            // IMPORTANT : on réinitialise le tour du prochain joueur
            tempsTourJ1 = tempsRestantGlobal / toursRestants; 
        }
    }
}

export function passerAuJoueur(joueurSuivant) {
    if (joueurSuivant === 1) {
        compteurTourJ1 += 1;
    } else if (joueurSuivant === 2) {
        compteurTourJ2 += 1;
    }
    joueurActif = joueurSuivant;
}

// =======================================
// Mise à jour de l'état du compteur Pause
// =======================================

export const PAUSE_ON = 1;
export const PAUSE_OFF = 0;
let compteurPause = PAUSE_OFF;

export function etatCompteurPause(){
    if (compteurPause === PAUSE_OFF) {
        compteurPause = PAUSE_ON;
    } else compteurPause = PAUSE_OFF;
    return compteurPause;

}