// ===================================
// controller.js 
// faire le lien entre la page html et les fichiers view.js et model.js
// ===================================

// Importations du Model (Logique/État)
import { 
    joueurActif, tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2, 
    compteurTourJ1, compteurTourJ2, timerIdJ1, timerTourIdJ1, timerIdJ2, timerTourIdJ2,
    etatCompteurPause, PAUSE_ON, PAUSE_OFF,
    calculerTempsInitiaux, decrementerTemps, passerAuJoueur, reinitialiserTour 
} from './model.js';

// Importations de la View (DOM)
import { 
    $inputHeuresPartie, $inputminutesPartie, $nomJ1, $nomJ2,
    afficherDureeTour, afficherTempsGlobal, afficherTempsTour, afficherNumeroTour,
    masquerFormulaireEtConsignes, mettreAJourNoms,
    $valider, $startJ1, $startJ2, $pause, $switch 
} from './view.js';



// =======================================
// Fonctions de Timer (Gère l'intervalle)
// =======================================
let timerLoopJ1 = null;
let timerLoopJ2 = null;

function demarrerTimer(joueur) {
    if (joueur === 1) {
        if (timerLoopJ1) return; // Déjà démarré
        timerLoopJ1 = setInterval(() => {
            decrementerTemps();
            afficherTempsGlobal(1, tempsPartieJ1);
            afficherTempsTour(1, tempsTourJ1);
        }, 1000);
    } else {
        if (timerLoopJ2) return; // Déjà démarré
        timerLoopJ2 = setInterval(() => {
            decrementerTemps();
            afficherTempsGlobal(2, tempsPartieJ2);
            afficherTempsTour(2, tempsTourJ2);
        }, 1000);
    }
}

function arreterTimer(joueur) {
    if (joueur === 1) {
        clearInterval(timerLoopJ1);
        timerLoopJ1 = null;
    } else {
        clearInterval(timerLoopJ2);
        timerLoopJ2 = null;
    }
}

// =======================================
// Gestion des Inputs
// =======================================

let nomJ1Str = "";
let nomJ2Str = "";
let heuresPartieChoisies = 0;
let minutesPartieChoisies = 0;

$inputHeuresPartie.addEventListener("input", () => {
    heuresPartieChoisies = $inputHeuresPartie.value;
});
$inputminutesPartie.addEventListener("input", () => {
    minutesPartieChoisies = $inputminutesPartie.value;
});
$nomJ1.addEventListener("input", () => {
    nomJ1Str = $nomJ1.value;
    mettreAJourNoms(nomJ1Str, nomJ2Str);
});
$nomJ2.addEventListener("input", () => {
    nomJ2Str = $nomJ2.value;
    mettreAJourNoms(nomJ1Str, nomJ2Str);
});

// =======================================
// Gestion du Clic "Valider"
// =======================================

let etatPartie = 0;

$valider.addEventListener("click", () => {
    // 1. Appel du Model pour le calcul
    const conversion = calculerTempsInitiaux(heuresPartieChoisies, minutesPartieChoisies);
    
    // 2. Appel de la View pour l'affichage
    // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
    afficherDureeTour(tempsTourJ1);
    afficherTempsGlobal(1, tempsPartieJ1);
    afficherTempsGlobal(2, tempsPartieJ2);
    afficherTempsTour(1, tempsTourJ1);
    afficherTempsTour(2, tempsTourJ2);
    etatPartie = 1;

    console.log(`Temps de tour initial : ${conversion.minutes}:${conversion.secondes}`);
});

// =======================================
// Gestion du Clic J1
// =======================================

$startJ1.addEventListener("click", () => {
   
    if (etatPartie === 1) {
        if (joueurActif === null){
    
            masquerFormulaireEtConsignes();

            // Début de partie (J1 clique et donc lance le time de J2 qui commence la partie)
            passerAuJoueur(2); 
            demarrerTimer(2);
            
            afficherNumeroTour(2, 1);
        } else if (joueurActif === 1) {
            // J1 termine son tour, passe à J2
            arreterTimer(1);
            reinitialiserTour(1); // Réinitialise le temps de tour du prochain joueur (J2)  
            passerAuJoueur(2);
            demarrerTimer(2);
            afficherNumeroTour(2, compteurTourJ2);
        }
    }
});

// =======================================
// Gestion du Clic J2
// =======================================

$startJ2.addEventListener("click", () => {
    
    if (etatPartie === 1) {
        if (joueurActif === null){
    
            masquerFormulaireEtConsignes();
            // Début de partie (J1 commence)
            passerAuJoueur(1);
            demarrerTimer(1);
            
            afficherNumeroTour(2, 1);
        } else if (joueurActif === 2) {
            // J2 termine son tour, passe à J1
            arreterTimer(2);
            reinitialiserTour(2); // Réinitialise le temps de tour du prochain joueur (J1)
            
            passerAuJoueur(1);
            demarrerTimer(1);
            afficherNumeroTour(1, compteurTourJ1);
        }
    }
});

// =======================================
// Gestion du bouton pause
// =======================================

$pause.addEventListener("click", () => {

    if (etatPartie === 1) {
    let etatCompeur = etatCompteurPause();

    if (joueurActif === 1) {
        if (etatCompeur === PAUSE_ON) {
            arreterTimer(1);
            console.log(etatCompeur);
            console.log(joueurActif);
        } else {
            demarrerTimer(1);
        }
    } else if (joueurActif === 2) {
        if (etatCompeur === PAUSE_ON) {
            arreterTimer(2);
            console.log(etatCompeur);
            console.log(joueurActif);
        } else {
            demarrerTimer(2);
            console.log(etatCompeur);
            console.log(joueurActif);
        }
    }
}
});

// =======================================
// Gestion du switch (Rotation de l'affichage)
// =======================================

let compteurRotation = 0;
$switch.addEventListener("click", () => {
    const $textRotate = document.getElementById("J1"); 
    if (compteurRotation === 0) {
        $textRotate.classList.add("rotate");
        compteurRotation = 1;
    } else {
        $textRotate.classList.remove("rotate");
        compteurRotation = 0;
    }
});

// =======================================
// Gestion du onbeforeunload
// =======================================
window.onbeforeunload = function () {
    // Si la partie est démarrée
    if (joueurActif !== null) {
        return "Si vous quittez la page le Timer sera réinitialisé?";
    }
};