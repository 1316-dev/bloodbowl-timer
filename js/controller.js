// ===================================
// controller.js 
// faire le lien entre la page html et les fichiers view.js et model.js
// ===================================

// Importations du Model (Logique/État)
import { 
    joueurActif, tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2, 
    compteurTourJ1, compteurTourJ2, etatCompteurPause, PAUSE_ON, 
    calculerTempsInitiaux, decrementerTemps, passerAuJoueur, reinitialiserTour,calculerTempsEncours, setCompteurTourJ1, setCompteurTourJ2 
} from './model.js';

// Importations de la View (DOM)
import { 
    $inputHeuresPartie, $inputminutesPartie, $nomJ1, $nomJ2,
    afficherDureeTour, afficherTempsGlobal, afficherTempsTour, afficherNumeroTour,
    masquerFormulaireEtConsignes, mettreAJourNoms,
    $valider, $startJ1, $startJ2, $pause, $switch , $nomAfficheJ1, $nomAfficheJ2,
    contourJoueurActif, afficherTerrain, choixRadio, $inputHeuresPartieECJ1, $inputMinutesPartieECJ1, $inputTourECJ1, $inputHeuresPartieECJ2, $inputMinutesPartieECJ2, $inputTourECJ2
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

//========================================
// choix radio - Nouvelle Partie ou en cours
//========================================

let choixPartie = "nouvelle";

choixRadio((valeurRecue) => {
    choixPartie = valeurRecue;
    console.log(choixPartie);
});


// =======================================
// Gestion des Inputs Nom joeurs
// =======================================

let nomJ1Str = "";
let nomJ2Str = "";

$nomJ1.addEventListener("input", () => {
    nomJ1Str = $nomJ1.value;
    mettreAJourNoms(nomJ1Str, $nomAfficheJ1);
});
$nomJ2.addEventListener("input", () => {
    nomJ2Str = $nomJ2.value;
    mettreAJourNoms(nomJ2Str, $nomAfficheJ2);
});

// =======================================
// Gestion des Inputs Partie en Cours
// =======================================

let heuresPartieECJ1 = 0;
let minutesPartieECJ1 = 0;
let tourECJ1 = 0;


$inputHeuresPartieECJ1.addEventListener("input", () => {
    heuresPartieECJ1 = $inputHeuresPartieECJ1.value;
});
$inputMinutesPartieECJ1.addEventListener("input", () => {
    minutesPartieECJ1 = $inputMinutesPartieECJ1.value;
});
$inputTourECJ1.addEventListener("input", () => {
    setCompteurTourJ1(Number($inputTourECJ1.value));
    tourECJ1 = Number($inputTourECJ1.value);
});

let heuresPartieECJ2 = 0;
let minutesPartieECJ2 = 0;
let tourECJ2 = 0;


$inputHeuresPartieECJ2.addEventListener("input", () => {
    heuresPartieECJ2 = $inputHeuresPartieECJ2.value;
});
$inputMinutesPartieECJ2.addEventListener("input", () => {
    minutesPartieECJ2 = $inputMinutesPartieECJ2.value;
});
$inputTourECJ2.addEventListener("input", () => {
    setCompteurTourJ2(Number($inputTourECJ2.value));
    tourECJ2 = Number($inputTourECJ2.value);
});

// =======================================
// Gestion des Inputs Nouvelle Partie
// =======================================

let heuresPartieChoisies = 0;
let minutesPartieChoisies = 0;

$inputHeuresPartie.addEventListener("input", () => {
    heuresPartieChoisies = $inputHeuresPartie.value;
});
$inputminutesPartie.addEventListener("input", () => {
    minutesPartieChoisies = $inputminutesPartie.value;
});



// =======================================
// Gestion du Clic "Valider"
// =======================================

let etatPartie = 0;

$valider.addEventListener("click", () => {
    
    
    if (choixPartie !== "enCours") {
        
        const heures = Number(heuresPartieChoisies);
        const minutes = Number(minutesPartieChoisies);
        
        // 2. Validation stricte
        if (isNaN(heures) || isNaN(minutes) || heures === "" || minutes === "" || heures < 0 || minutes < 0) {
            
            // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
            alert("Merci de remplir les champs d'heures et de minutes avec des nombres valides.");
            
        } else  {
        
        calculerTempsInitiaux(heures, minutes);
        
        // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
        afficherDureeTour(tempsTourJ1);
        etatPartie = 1;
        
        }
    }
    else if (choixPartie === "enCours") {
        const heuresJ1 = Number(heuresPartieECJ1);
        const minutesJ1 = Number(minutesPartieECJ1);
        const tourJ1 = Number(tourECJ1);
        const heuresJ2 = Number(heuresPartieECJ2);
        const minutesJ2 = Number(minutesPartieECJ2);
        const tourJ2 = Number(tourECJ2);    
        // 2. Validation stricte
        if (isNaN(heuresJ1) || isNaN(minutesJ1) || isNaN(tourJ1) || heuresJ1 === "" || minutesJ1 === "" || tourJ1 === "" || heuresJ1 < 0 || minutesJ1 < 0 || tourJ1 <= 0 ||
            isNaN(heuresJ2) || isNaN(minutesJ2) || isNaN(tourJ2) || heuresJ2 === "" || minutesJ2 === "" || tourJ2 === "" || heuresJ2 < 0 || minutesJ2 < 0 || tourJ2 <= 0) {     
            // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
            alert("Merci de remplir les champs d'heures, de minutes et de tour avec des nombres valides.");
        } else  {
        calculerTempsEncours(1, heuresJ1, minutesJ1, tourJ1);
        calculerTempsEncours(2, heuresJ2, minutesJ2, tourJ2);

        console.log("ici" +tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2);
        etatPartie = 1;
        }    
    }
});   

// =======================================
// Gestion du Clic J1
// =======================================


$startJ1.addEventListener("click", () => {
   
    if (etatPartie === 1) {
        if (joueurActif === null){
            afficherTerrain();
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
            afficherTerrain();
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