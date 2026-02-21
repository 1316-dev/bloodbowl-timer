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
  basculerPause,
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

//=====================================
// Etat de partie
//=====================================
const ETAT_PARTIE = {
  INITIAL: 0,
  DEMARREE: 1,
};

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

function demarrerTimer(numeroJoueur) {
  if (joueurs[numeroJoueur].timerLoop) {
    return;
  } // Déjà démarré
  joueurs[numeroJoueur].timerLoop = setInterval(() => {
    decrementerTemps(numeroJoueur);
    afficherTempsGlobal(numeroJoueur, joueurs[numeroJoueur].tempsPartie);
    afficherTempsTour(numeroJoueur, joueurs[numeroJoueur].tempsTour);
  }, 1000);
}

function arreterTimer(numeroJoueur) {
  clearInterval(joueurs[numeroJoueur].timerLoop);
  joueurs[numeroJoueur].timerLoop = null;
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
    Number.isNaN(heures) ||
    Number.isNaN(minutes) ||
    heures === "" ||
    minutes === "" ||
    heures < 0 ||
    minutes < 0
  ) {
    return false;
  }
  if (tour !== null) {
    if (Number.isNaN(tour) || tour === "" || tour <= 0) {
      return false;
    }
  }
  return true;
}

let etatPartie = ETAT_PARTIE.INITIAL;

$valider.addEventListener("click", () => {
  if (choixPartie !== "enCours") {
    const heures = Number($inputHeuresPartie.value);
    const minutes = Number($inputminutesPartie.value);

    // 2. Validation stricte
    if (validerInputsJoueur(heures, minutes)) {
      calculerTempsInitiaux(heures, minutes);
      // on affiche le temps de tour d'un joueur pour éviter les erreurs d'arrondi
      afficherDureeTour(joueurs[1].tempsTour);
      etatPartie = ETAT_PARTIE.DEMARREE;
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
  }
});

function lancerPartie(joueur, adversaire) {
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
}

function lancerMiTemps(joueur) {
  arreterTimer(joueur);
  basculerPause();
  confirm("Mi temps ! Appuyer une fois prêt pour lancer le timer ?");
  basculerPause();
  reinitialiserTour(joueur);
  contourJoueurActif(joueur);
  passerAuJoueur(joueur);
  demarrerTimer(joueur);
  afficherNumeroTour(joueur, joueurs[joueur].compteurTour);
}

function lancerTourAdversaire(joueur, adversaire) {
  arreterTimer(joueur);
  reinitialiserTour(joueur);
  contourJoueurActif(adversaire);
  passerAuJoueur(adversaire);
  afficherNumeroTour(adversaire, joueurs[adversaire].compteurTour);
  demarrerTimer(adversaire);
}

// =======================================
// Gestion du Clic Joueurs (Démarrer la partie et passer au joueur suivant)
// =======================================

function gestionClicJoueur(joueur, adversaire) {
  if (etatPartie === ETAT_PARTIE.DEMARREE) {
    if (joueurActif === null) {
      lancerPartie(joueur, adversaire);
    } else if (joueurActif === joueur) {
      // vérifier si les deux joueurs sont à la mi-temps
      if (
        joueurs[joueur].compteurTour === MI_TEMPS &&
        joueurs[adversaire].compteurTour === MI_TEMPS
      ) {
        lancerMiTemps(joueur);
        return;
      }
      if (
        joueurs[joueur].compteurTour === MAX_TOURS &&
        joueurs[adversaire].compteurTour === MAX_TOURS
      ) {
        confirm("Fin du Mathch officiel ! Vous avez besoin de continuer ?");
      }
      // Si ce n'est pas la mi-temps ou si les joueurs veulent faire plus de 16 tours (ne cas de besoin)
      lancerTourAdversaire(joueur, adversaire);
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
  if (etatPartie === ETAT_PARTIE.DEMARREE) {
    let etatCompeur = basculerPause();

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
