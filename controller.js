// ===================================
// controller.js 
// faire le lien entre la page html et les fichiers view.js et model.js
// ===================================

// Importations du Model (Logique/État)
import { 
    joueurActif, tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2, 
    compteurTourJ1, compteurTourJ2, etatCompteurPause, PAUSE_ON, 
    calculerTempsInitiaux, decrementerTemps, passerAuJoueur, reinitialiserTour 
} from './model.js';

// Importations de la View (DOM)
import { 
    $inputHeuresPartie, $inputminutesPartie, $nomJ1, $nomJ2,
    afficherDureeTour, afficherTempsGlobal, afficherTempsTour, afficherNumeroTour,
    masquerFormulaireEtConsignes, mettreAJourNoms,
    $valider, $startJ1, $startJ2, $pause, $switch , $nomAfficheJ1, $nomAfficheJ2,
    contourJoueurActif
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
    mettreAJourNoms(nomJ1Str, $nomAfficheJ1);
});
$nomJ2.addEventListener("input", () => {
    nomJ2Str = $nomJ2.value;
    mettreAJourNoms(nomJ2Str, $nomAfficheJ2);
});


// =======================================
// Gestion du Clic "Valider"
// =======================================

let etatPartie = 0;

$valider.addEventListener("click", () => {
    const heures = Number(heuresPartieChoisies);
    const minutes = Number(minutesPartieChoisies);
    
    // 2. Validation stricte
    if (isNaN(heures) || isNaN(minutes) || heures === "" || minutes === "" || heures < 0 || minutes < 0) {
        
        // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
        alert("Merci de remplir les champs d'heures et de minutes avec des nombres valides.");
        
    } else  {
    
    const conversion = calculerTempsInitiaux(heures, minutes);
    
    // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
    afficherDureeTour(tempsTourJ1);
    etatPartie = 1;
    }
});

// =======================================
// Gestion du Clic J1
// =======================================


$startJ1.addEventListener("click", () => {
   
    if (etatPartie === 1) {
        if (joueurActif === null){
    
            masquerFormulaireEtConsignes();
            afficherTempsGlobal(1, tempsPartieJ1);
            afficherTempsGlobal(2, tempsPartieJ2);
            afficherTempsTour(1, tempsTourJ1);
            afficherTempsTour(2, tempsTourJ2);

            // Début de partie (J1 clique et donc lance le timer de J2 qui commence la partie)
            
            contourJoueurActif(2);
            demarrerTimer(2);
            passerAuJoueur(2);
            afficherNumeroTour(2, compteurTourJ2);
            
        } else if (joueurActif === 1) {
            // J1 termine son tour, passe à J2
            arreterTimer(1);
            reinitialiserTour(1); // Réinitialise le temps de tour du prochain joueur (J2)  
            contourJoueurActif(2);
            passerAuJoueur(2);
            if (compteurTourJ1 < 17 ) {
            demarrerTimer(2);
            }
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
            afficherTempsGlobal(1, tempsPartieJ1);
            afficherTempsGlobal(2, tempsPartieJ2);
            afficherTempsTour(1, tempsTourJ1);
            afficherTempsTour(2, tempsTourJ2);
            // Début de partie (J1 commence)
            contourJoueurActif(1);
            passerAuJoueur(1);
            demarrerTimer(1);
            
            afficherNumeroTour(1, compteurTourJ1);
            
        } else if (joueurActif === 2) {
           
            // J2 termine son tour, passe à J1
            arreterTimer(2);
            reinitialiserTour(2);
             console.log(compteurTourJ1) // Réinitialise le temps de tour du prochain joueur (J1)
            contourJoueurActif(1);
            if (compteurTourJ2 < 17 ) {
            demarrerTimer(1);
            }
            passerAuJoueur(1);
            
            afficherNumeroTour(1, compteurTourJ1);
             console.log("CJ1 =" + compteurTourJ1)
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
        } else {
            demarrerTimer(1);
        }
    } else if (joueurActif === 2) {
        if (etatCompeur === PAUSE_ON) {
            arreterTimer(2);
        } else {
            demarrerTimer(2);
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

// =======================================
// Gestion des boutons radio (Rotation de l'affichage)
// =======================================

const $radioNouvelle = document.getElementById("radioNouvelle");
const $radioEnCours = document.getElementById("radioEnCours");
const $formNouvelle = document.getElementById("formNouvelle");
const $formEncours = document.querySelectorAll('.formEncours');

$radioEnCours.addEventListener("click", () => {
    $formNouvelle.style.display = "none";
    $formEncours.forEach(form => {
        form.style.display = "block";
    });
    $valider.value = "Valider";
  
})

$radioNouvelle.addEventListener("click", () => {
    $formNouvelle.style.display = "block";
    $formEncours.forEach(form => {
        form.style.display = "none";
    });
    $valider.value = "Calculer Tour";

})