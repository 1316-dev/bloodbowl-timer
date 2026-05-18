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
  sortiePause,
  sauvegarderEtat,
  restaurerEtat,
  supprimerEtat,
  reinitialiserJoueurs,
} from "./model.js";

// Importations de la View (DOM)
import {
  $inputHeuresPartie,
  $inputminutesPartie,
  $inputNomJ1,
  $inputNomJ2,
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
  afficherFinPartie,
  afficherBoutonMenu,
  afficherSwitch,
  afficherTimerJoueurs,
  reinitialiserBoutonPause,
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
// vérification de l'état sauvegardé
// =======================================

const etatSauvegarde = restaurerEtat();
if (etatSauvegarde) {
  bbConfirm({
    icon: "🔄",
    title: "Partie en cours détectée",
    message: "Voulez-vous reprendre la partie précédente ?",
    okLabel: "Reprendre",
    okClass: "btn-success",
    cancelLabel: "Nouvelle partie",
    onOk: () => {
      etatPartie = ETAT_PARTIE.DEMARREE;
      afficherTerrain();
      activerWakeLock();
      afficherBoutonMenu();
      afficherSwitch();
      afficherTimerJoueurs();
      masquerFormulaireEtConsignes();
      afficherNom();
      afficherTempsGlobal(1, joueurs[1].tempsPartie);
      afficherTempsGlobal(2, joueurs[2].tempsPartie);
      afficherTempsTour(1, joueurs[1].tempsTour);
      afficherTempsTour(2, joueurs[2].tempsTour);
      afficherNumeroTour(1, joueurs[1].compteurTour);
      afficherNumeroTour(2, joueurs[2].compteurTour);
      contourJoueurActif(etatSauvegarde.joueurActif);
      demarrerTimer(etatSauvegarde.joueurActif);
    },
    onCancel: () => {
      supprimerEtat();
      reinitialiserJoueurs();
    },
  });
}

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
    sauvegarderEtat();
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

$inputNomJ1.addEventListener("input", () => {
  mettreAJourNoms($inputNomJ1.value, $nomAfficheJ1);
});
$inputNomJ2.addEventListener("input", () => {
  mettreAJourNoms($inputNomJ2.value, $nomAfficheJ2);
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
      afficherTimerJoueurs();
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
    joueurs[1].compteurTour = tourJ1;
    calculerTempsEncours(1, heuresJ1, minutesJ1, tourJ1);
    setCompteurTour(1, tourJ1);
    const heuresJ2 = Number($inputHeuresPartieECJ2.value);
    const minutesJ2 = Number($inputMinutesPartieECJ2.value);
    const tourJ2 = Number($inputTourECJ2.value);
    joueurs[2].compteurTour = tourJ2;
    calculerTempsEncours(2, heuresJ2, minutesJ2, tourJ2);
    setCompteurTour(2, tourJ2);
    afficherDureeTour(joueurs[1].tempsTour);
    afficherDureeTour(joueurs[2].tempsTour);
    afficherTimerJoueurs();
    etatPartie = ETAT_PARTIE.DEMARREE;
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
    if (tourJ1 - tourJ2 > 1 || tourJ2 - tourJ1 > 1) {
      alert(
        "Merci de vérifier que les tours des deux joueurs sont cohérents (écart maximum de 1 tour).",
      );
    }
  }
});

function lancerPartie(joueur, adversaire) {
  activerWakeLock();
  afficherBoutonMenu();
  afficherTerrain();
  masquerFormulaireEtConsignes();
  afficherNom();
  afficherSwitch();
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

  bbConfirm({
    icon: "⏱️",
    title: "Mi-temps !",
    message: "Appuyez quand vous êtes prêt à reprendre.",
    okLabel: "▶ Lancer le timer",
    okClass: "btn-warning",
    showCancel: false,
    onOk: () => {
      basculerPause();
      reinitialiserTour(joueur);
      contourJoueurActif(joueur);
      passerAuJoueur(joueur);
      demarrerTimer(joueur);
      afficherNumeroTour(joueur, joueurs[joueur].compteurTour);
    },
  });
}

function lancerTourAdversaire(joueur, adversaire) {
  arreterTimer(joueur);
  reinitialiserTour(joueur);
  contourJoueurActif(adversaire);
  passerAuJoueur(adversaire);
  afficherNumeroTour(adversaire, joueurs[adversaire].compteurTour);
  demarrerTimer(adversaire);
}

function finDePartie(numeroJoueur, adversaire) {
  arreterTimer(numeroJoueur);
  arreterTimer(adversaire);
  supprimerEtat();
}

// =======================================
// Gestion du Clic Joueurs (Démarrer la partie et passer au joueur suivant)
// =======================================

function gestionClicJoueur(joueur, adversaire) {
  sortiePause();
  reinitialiserBoutonPause();
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
        bbConfirm({
          icon: "🏆",
          title: "Fin du match officiel !",
          message: "Voulez-vous disputer des tours supplémentaires ?",
          okLabel: "Continuer",
          okClass: "btn-warning",
          cancelLabel: "Terminer la partie",
          onOk: () => {
            lancerTourAdversaire(joueur, adversaire);
          },
          onCancel: () => {
            finDePartie(joueur, adversaire);
            afficherFinPartie();
          },
        });
        return;
      }

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
      $pause.value = "▶ Reprendre";
      $pause.classList.add("btn-pause-active");
      $pause.classList.remove("btn-pause-inactive");
    } else {
      demarrerTimer(joueurActif);
      $pause.value = "Pause";
      $pause.classList.remove("btn-pause-active");
      $pause.classList.add("btn-pause-inactive");
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

// =======================================
// Choix rapide durée de partie
// =======================================
document.querySelectorAll('input[name="dureePartie"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const heuresInput = document.getElementById("inputHeuresPartie");
    const minutesInput = document.getElementById("inputminutesPartie");

    switch (e.target.value) {
      case "2h":
        heuresInput.value = 2;
        minutesInput.value = "00";
        break;
      case "2h30":
        heuresInput.value = 2;
        minutesInput.value = 30;
        break;
      case "perso":
      default:
        heuresInput.value = "";
        minutesInput.value = "";
        break;
    }
  });
});

// =======================================
// Gestion modale
// =======================================

function bbConfirm({
  icon,
  title,
  message,
  okLabel,
  okClass,
  cancelLabel,
  showCancel = true,
  onOk,
  onCancel,
}) {
  document.getElementById("bbModalIcon").textContent = icon;
  document.getElementById("bbModalTitle").textContent = title;
  document.getElementById("bbModalMsg").textContent = message;

  const okBtn = document.getElementById("bbModalOk");
  okBtn.textContent = okLabel;
  okBtn.className = "btn w-50 " + okClass;

  const cancelBtn = document.getElementById("bbModalCancel");
  cancelBtn.textContent = cancelLabel ?? "Annuler";

  cancelBtn.style.display = showCancel ? "" : "none";
  okBtn.className = "btn " + (showCancel ? "w-50" : "w-100") + " " + okClass;

  const modal = new bootstrap.Modal(document.getElementById("bbModal"));
  okBtn.onclick = () => {
    modal.hide();
    if (onOk) onOk();
  };
  cancelBtn.onclick = () => {
    modal.hide();
    if (onCancel) onCancel();
  };
  modal.show();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/bloodbowl-timer/sw.js")
    .then(() => console.log("SW enregistré"))
    .catch((err) => console.error("SW erreur:", err));
}

document.getElementById("selectNomJ1").addEventListener("change", (e) => {
  if (e.target.value === "Autre") {
    document.getElementById("inputNomJ1").value = "";
  } else {
    document.getElementById("inputNomJ1").value = e.target.value;
  }
  mettreAJourNoms(e.target.value, $nomAfficheJ1, $inputNomJ1);
});

document.getElementById("selectNomJ2").addEventListener("change", (e) => {
  if (e.target.value === "Autre") {
    document.getElementById("inputNomJ2").value = "";
  } else {
    document.getElementById("inputNomJ2").value = e.target.value;
  }
  mettreAJourNoms(e.target.value, $nomAfficheJ2, $inputNomJ2);
});

// =======================================
// Wake Lock — empêche la mise en veille
// =======================================
let wakeLock = null;
let wakeLockToggleInitialized = false;

async function activerWakeLock() {
  if (!("wakeLock" in navigator)) {
    document.getElementById("wakeLockUnsupported").style.display = "block";
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Wake Lock activé");

    // Toast discret en haut à droite
    const toastEl = document.getElementById("wakeLockToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Toggle haut dessus du terrain pour permettre à l'utilisateur de réactiver le Wake Lock si jamais il est désactivé (ex: changement d'onglet)
    document.getElementById("wakeLockInfo").style.display = "block";

    if (!wakeLockToggleInitialized) {
      wakeLockToggleInitialized = true;
      document
        .getElementById("wakeLockToggle")
        .addEventListener("change", async (e) => {
          if (e.target.checked) {
            try {
              wakeLock = await navigator.wakeLock.request("screen");
              // Toast à la réactivation aussi
              new bootstrap.Toast(toastEl).show();
              console.log("Wake Lock réactivé");
            } catch (err) {
              console.error("Wake Lock refusé:", err);
            }
          } else {
            if (wakeLock) {
              await wakeLock.release();
              wakeLock = null;
              console.log("Wake Lock désactivé");
            }
          }
        });
    }
  } catch (err) {
    console.error("Wake Lock refusé:", err);
  }
}
