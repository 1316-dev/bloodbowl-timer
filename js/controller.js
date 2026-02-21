// ===================================
// controller.js
// faire le lien entre la page html et les fichiers view.js et model.js
// ===================================

// Importations du Model (Logique/État)
import {
  joueurs,
  MI_TEMPS,
  MAX_TOURS,
  joueurActif,
  //tempsPartieJ1, tempsTourJ1, tempsPartieJ2, tempsTourJ2, compteurTourJ1, compteurTourJ2,
  etatCompteurPause,
  PAUSE_ON,
  calculerTempsInitiaux,
  decrementerTemps,
  passerAuJoueur,
  reinitialiserTour,
  calculerTempsEncours,
  setCompteurTour,
} from "./model.js";

// Importations de la View (DOM)
import {
  $inputHeuresPartie,
  $inputminutesPartie,
  $nomJ1,
  $nomJ2,
  gestionBoutonsRadio,
  afficherDureeTour,
  afficherTempsGlobal,
  afficherTempsTour,
  afficherNumeroTour,
  afficherDureeTourEnCours,
  masquerFormulaireEtConsignes,
  mettreAJourNoms,
  $valider,
  $startJ1,
  $startJ2,
  $pause,
  gestionSwitch,
  $nomAfficheJ1,
  $nomAfficheJ2,
  afficherNom,
  contourJoueurActif,
  afficherTerrain,
  choixRadio,
  $inputHeuresPartieECJ1,
  $inputMinutesPartieECJ1,
  $inputTourECJ1,
  $inputHeuresPartieECJ2,
  $inputMinutesPartieECJ2,
  $inputTourECJ2,
} from "./view.js";

//========================================
// Fonctions de Contrôleur (Gère les interactions entre le Model et la View)
// =======================================
gestionBoutonsRadio();
gestionSwitch();
joueurs[1].$btnStart = $startJ1;
joueurs[2].$btnStart = $startJ2;

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
      afficherTempsGlobal(1, joueurs[1].tempsPartie);
      afficherTempsTour(1, joueurs[1].tempsTour);
    }, 1000);
  } else {
    if (timerLoopJ2) return; // Déjà démarré
    timerLoopJ2 = setInterval(() => {
      decrementerTemps();
      afficherTempsGlobal(2, joueurs[2].tempsPartie);
      afficherTempsTour(2, joueurs[2].tempsTour);
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
  if (
    isNaN(heures) ||
    isNaN(minutes) ||
    heures === "" ||
    minutes === "" ||
    heures < 0 ||
    minutes < 0
  ) {
    return false;
  }
  if (tour !== null) {
    if (isNaN(tour) || tour === "" || tour <= 0) {
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
    if (validerInputsJoueur(heures, minutes)) {
      calculerTempsInitiaux(heures, minutes);
      // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
      afficherDureeTour(joueurs[1].tempsTour);
      etatPartie = 1;
    } else {
      // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
      alert(
        "Merci de remplir les champs d'heures, de minutes et de tour avec des nombres valides.",
      );
    }
  } else if (choixPartie === "enCours") {
    const heuresJ1 = Number($inputHeuresPartieECJ1.value);
    const minutesJ1 = Number($inputMinutesPartieECJ1.value);
    const tourJ1 = Number($inputTourECJ1.value);
    setCompteurTour(1, tourJ1);
    const heuresJ2 = Number($inputHeuresPartieECJ2.value);
    const minutesJ2 = Number($inputMinutesPartieECJ2.value);
    const tourJ2 = Number($inputTourECJ2.value);
    setCompteurTour(2, tourJ2);
    // 2. Validation stricte
    if (
      !validerInputsJoueur(heuresJ1, minutesJ1, tourJ1) ||
      !validerInputsJoueur(heuresJ2, minutesJ2, tourJ2)
    ) {
      // La popup s'affiche si la conversion échoue (NaN), si le champ est vide, ou si la valeur est négative
      alert(
        "Merci de remplir les champs d'heures, de minutes et de tour avec des nombres valides.",
      );
    }
  } else {
    calculerTempsEncours(1, heuresJ1, minutesJ1, tourJ1);
    calculerTempsEncours(2, heuresJ2, minutesJ2, tourJ2);
    // on affiche le temps de tour des joeurs
    afficherDureeTourEnCours(tempsTourJ1, tempsTourJ2);
    etatPartie = 1;
  }
});

// =======================================
// Gestion du Clic Joueurs (Démarrer la partie et passer au joueur suivant)
// =======================================

function gestionClicJoueur(joueur, adversaire) {
  if (etatPartie === 1) {
    if (joueurActif === null) {
      afficherTerrain();
      masquerFormulaireEtConsignes();
      afficherNom();
      afficherTempsGlobal(joueur, joueurs[joueur].tempsPartie);
      afficherTempsGlobal(adversaire, joueurs[adversaire].tempsPartie);
      afficherTempsTour(joueur, joueurs[joueur].tempsTour);
      afficherTempsTour(adversaire, joueurs[adversaire].tempsTour);

      // Début de partie (Joueur clique et donc lance le timer de l'adversaire qui commence la partie)

      contourJoueurActif(adversaire);
      demarrerTimer(adversaire);
      passerAuJoueur(adversaire);
      afficherNumeroTour(adversaire, joueurs[adversaire].compteurTour);
    } else if (joueurActif === joueur) {
      // vérifier si les deux joueurs sont à la mi-temps
      if (
        joueurs[joueur].compteurTour === MI_TEMPS &&
        joueurs[adversaire].compteurTour === MI_TEMPS
      ) {
        arreterTimer(joueur);
        etatCompteurPause();
        confirm("Mi temps ! Appuyer une fois prêt pour lancer le timer ?");
        etatCompteurPause();
        reinitialiserTour(joueur);
        contourJoueurActif(joueur);
        passerAuJoueur(joueur);
        demarrerTimer(joueur);
        afficherNumeroTour(joueur, joueurs[joueur].compteurTour);
        return;
      }
      // Si ce n'est pas la mi-temps, le joueur termine son tour, passe à l'adversaire
      arreterTimer(joueur);
      reinitialiserTour(joueur);
      contourJoueurActif(adversaire);
      passerAuJoueur(adversaire);
      if (joueurs[joueur].compteurTour < MAX_TOURS) {
        demarrerTimer(adversaire);
      }
      afficherNumeroTour(adversaire, joueurs[adversaire].compteurTour);
    }
  }
}

joueurs[1].$btnStart.addEventListener("click", () => {
  gestionClicJoueur(1, 2);
});

joueurs[2].$btnStart.addEventListener("click", () => {
  gestionClicJoueur(2, 1);
});

// =======================================
// Gestion du bouton pause
// =======================================

$pause.addEventListener("click", () => {
  if (etatPartie === 1) {
    let etatCompeur = etatCompteurPause();

    if (etatCompeur === PAUSE_ON) {
      arreterTimer(joueurActif);
    } else {
      demarrerTimer(joueurActif);
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
