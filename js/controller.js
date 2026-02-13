// ===================================
// controller.js 
// faire le lien entre la page html et les fichiers view.js et model.js
// ===================================

// Importations du Model (Logique/État)
import { 
    MI_TEMPS,MAX_TOURS,joueurActif, tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2, 
    compteurTourJ1, compteurTourJ2, etatCompteurPause, PAUSE_ON, 
    calculerTempsInitiaux, decrementerTemps, passerAuJoueur, reinitialiserTour,calculerTempsEncours, setCompteurTourJ1, setCompteurTourJ2 
} from './model.js';

// Importations de la View (DOM)
import { 
    $inputHeuresPartie, $inputminutesPartie, $nomJ1, $nomJ2, gestionBoutonsRadio,
    afficherDureeTour, afficherTempsGlobal, afficherTempsTour, afficherNumeroTour, afficherDureeTourEnCours,
    masquerFormulaireEtConsignes, mettreAJourNoms,
    $valider, $startJ1, $startJ2, $pause, gestionSwitch , $nomAfficheJ1, $nomAfficheJ2, afficherNom,
    contourJoueurActif, afficherTerrain, choixRadio, $inputHeuresPartieECJ1, $inputMinutesPartieECJ1, $inputTourECJ1, $inputHeuresPartieECJ2, $inputMinutesPartieECJ2, $inputTourECJ2
} from './view.js';



//========================================
// Fonctions de Contrôleur (Gère les interactions entre le Model et la View)
// =======================================
gestionBoutonsRadio();
gestionSwitch();

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

//========================================
// choix radio - Nouvelle Partie ou en cours
//========================================

let choixPartie = "nouvelle";

choixRadio((valeurRecue) => {
    choixPartie = valeurRecue;
});


// =======================================
// Gestion des Inputs Nom joeurs
// =======================================


$nomJ1.addEventListener("input", () => {
    mettreAJourNoms($nomJ1.value, $nomAfficheJ1);
});
$nomJ2.addEventListener("input", () => {
    mettreAJourNoms($nomJ2.value, $nomAfficheJ2);
});





// =======================================
// Gestion du Clic "Valider"
// =======================================

function validerInputsJoueur(heures, minutes, tour = null) {
    if (isNaN(heures) || isNaN(minutes)  || 
        heures === "" || minutes === "" || 
        heures < 0 || minutes < 0 )
             {     
            return false;             
        } 
    if (tour !== null) {
         if ( isNaN(tour) ||  tour === "" || tour <= 0)
             {     
            return false;             
        } 
    }
    return true;
}

let etatPartie = 0;

$valider.addEventListener("click", () => {
    
    
    if (choixPartie !== "enCours") {
        
        const heures = Number($inputHeuresPartie.value);
        const minutes = Number($inputminutesPartie.value);
        
      // 2. Validation stricte
        if (validerInputsJoueur(heures,minutes)) {
            calculerTempsInitiaux(heures, minutes);
            // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
            afficherDureeTour(tempsTourJ1);
            etatPartie = 1;
        }
        
         else  {
        // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
            alert("Merci de remplir les champs d'heures, de minutes et de tour avec des nombres valides.");
       
        
        
        }
    }
    else if (choixPartie === "enCours") {
        const heuresJ1 = Number($inputHeuresPartieECJ1.value);
        const minutesJ1 = Number($inputMinutesPartieECJ1.value);
        const tourJ1 = Number($inputTourECJ1.value);
        setCompteurTourJ1(tourJ1);
        const heuresJ2 = Number($inputHeuresPartieECJ2.value);
        const minutesJ2 = Number($inputMinutesPartieECJ2.value);
        const tourJ2 = Number($inputTourECJ2.value);  
        setCompteurTourJ2(tourJ2);
        // 2. Validation stricte
        if (!validerInputsJoueur(heuresJ1,minutesJ1,tourJ1) || !validerInputsJoueur(heuresJ2,minutesJ2,tourJ2)) {
            // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
            alert("Merci de remplir les champs d'heures, de minutes et de tour avec des nombres valides.");
        }
        
        } else  {
        calculerTempsEncours(1, heuresJ1, minutesJ1, tourJ1);
        calculerTempsEncours(2, heuresJ2, minutesJ2, tourJ2);
        // on affiche le temps de tour des joeurs
        afficherDureeTourEnCours(tempsTourJ1, tempsTourJ2);
        etatPartie = 1;
        }    
    }
);   


// =======================================
// Gestion du Clic J1
// =======================================


$startJ1.addEventListener("click", () => {
   
    if (etatPartie === 1) {
        if (joueurActif === null){
            afficherTerrain();
            masquerFormulaireEtConsignes();
            afficherNom();
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
            if (compteurTourJ1 === MI_TEMPS && compteurTourJ2 === MI_TEMPS) {
                arreterTimer(1);
                etatCompteurPause()
                confirm("Mi temps ! Appuyer une fois prêt pour lancer le timer ?");
                etatCompteurPause()
                reinitialiserTour(2);  
                contourJoueurActif(1);
                passerAuJoueur(1);
                demarrerTimer(1);
                afficherNumeroTour(1, compteurTourJ1);
                return;
            }
            // J1 termine son tour, passe à J2
            arreterTimer(1);
            reinitialiserTour(2); // Réinitialise le temps de tour du prochain joueur (J2)  
            contourJoueurActif(2);
            

            
            passerAuJoueur(2);
            if (compteurTourJ1 < MAX_TOURS ) {
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
            afficherTerrain();
            masquerFormulaireEtConsignes();
             afficherNom();
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
            if (compteurTourJ1 === MI_TEMPS && compteurTourJ2 === MI_TEMPS) {
                arreterTimer(2);            
                confirm("Mi temps ! Appuyer une fois prêt pour lancer le timer ?");
                reinitialiserTour(1); 
                contourJoueurActif(2);
                demarrerTimer(2);
                passerAuJoueur(2);
                afficherNumeroTour(2, compteurTourJ2);
                return;
            }
            // J2 termine son tour, passe à J1
            arreterTimer(2);
            reinitialiserTour(1); // Réinitialise le temps de tour du prochain joueur (J1)
      
            contourJoueurActif(1);
            if (compteurTourJ2 < MAX_TOURS ) {
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
// Gestion du onbeforeunload
// =======================================
window.onbeforeunload = function () {
    // Si la partie est démarrée
    if (joueurActif !== null) {
        return "Si vous quittez la page le Timer sera réinitialisé?";
    }
};

