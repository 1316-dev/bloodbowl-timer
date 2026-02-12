// ===================================
// view.js
// Gestion de l'ensemble des liens avec la manipulation du DOM
//
// ===================================

import { 
    MAX_TOURS 
} from './model.js';

// Éléments du DOM

// Temps de Jeux choisit par les utilisateurs (input heures et input minutes)
// cette div nommé "form Nouvelle Partie" disparaitra au lancement de la partie
export const $form = document.getElementById("form");
export const $inputHeuresPartie = document.getElementById("inputHeuresPartie");
export const $inputminutesPartie = document.getElementById("inputminutesPartie");

// cette div nommé "form Partie en Cours" disparaitra au lancement de la partie
export const $inputHeuresPartieECJ1 = document.getElementById("inputHeuresPartieECJ1");
export const $inputMinutesPartieECJ1 = document.getElementById("inputMinutesPartieECJ1");
export const $inputTourECJ1 = document.getElementById("inputTourECJ1");

export const $inputHeuresPartieECJ2 = document.getElementById("inputHeuresPartieECJ2");
export const $inputMinutesPartieECJ2 = document.getElementById("inputMinutesPartieECJ2");
export const $inputTourECJ2 = document.getElementById("inputTourECJ2");

//Affichage du temps moyen d'un tour en début de partie
export const $tempstourElement = document.getElementById("tempstour");

// Nom des joueurs
export const $nomJ1 = document.getElementById("inputNomJ1"); 
export const $nomJ2 = document.getElementById("inputNomJ2"); 

// Consigne qui doivent disparaitre au démarrage
export const $consigneJ1 = document.getElementById("consigneJ1");
export const $consigneJ2 = document.getElementById("consigneJ2");
// Remplacer part : 
// le nom 
// le nombre de tour
// le timer Partie
// le timer Tour
export const $nomAfficheJ1 = document.getElementById("nomJ1");
export const timerPartieElementJ1 = document.getElementById("timerPartieJ1");
export const timerTourElementJ1 = document.getElementById("timerTourJ1");
export const $numeroTourJ1 = document.getElementById("numeroTourJ1");

export const $nomAfficheJ2 = document.getElementById("nomJ2"); 
export const timerPartieElementJ2 = document.getElementById("timerPartieJ2");
export const timerTourElementJ2 = document.getElementById("timerTourJ2");
export const $numeroTourJ2 = document.getElementById("numeroTourJ2");

// Éléments DOM Actifs (Boutons, Inputs, etc.)
export const $valider = document.getElementById("valider"); 
export const $startJ1 = document.getElementById("J1");
export const $startJ2 = document.getElementById("J2");
export const $pause = document.getElementById("pause");
export const $switch = document.getElementById("switch");
export const $inputRadio = document.getElementById("radio");   


// =======================================
// Fonctions d'affichage
// =======================================

/**
 * Transforme les temps secondes en heures/minutes/secondes
 * @param {*} secondesTotal 
 * @returns 
 */
function formaterTemps(secondesTotal) {
    const tempsRestant = secondesTotal <= 0 ? 0 : secondesTotal;
    let minutes = parseInt(tempsRestant / 60, 10);
    const secondes = parseInt(tempsRestant % 60, 10);
    const heures = Math.trunc(minutes / 60);

    const heuresStr = heures < 1 ? "" : (heures < 10 ? "0" + heures : heures) + ":";
    minutes = heures > 0 ? minutes % 60 : minutes;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondesStr = secondes < 10 ? "0" + secondes : secondes;

    return heures > 0 ? `${heuresStr} ${minutesStr} : ${secondesStr}` : `${minutesStr} : ${secondesStr}` ;
}

/**
 * permet d'afficher le timer de Partie du joueur en temps réel
 * @param {*} joueur 
 * @param {*} tempsTotalSecondes 
 */
export function afficherTempsGlobal(joueur, tempsTotalSecondes) {
    const element = joueur === 1 ? timerPartieElementJ1 : timerPartieElementJ2;
    element.innerText = `Partie ${formaterTemps(tempsTotalSecondes)}`;
}

/**
 * permet d'afficher le timer de Tour du joueur en temps réel
 * @param {*} joueur 
 * @param {*} tempsTotalSecondes 
 */
export function afficherTempsTour(joueur, tempsTotalSecondes) {
    const element = joueur === 1 ? timerTourElementJ1 : timerTourElementJ2;
    element.innerText = `Tour ${formaterTemps(tempsTotalSecondes)}`;
}

export function afficherDureeTour(tempsTotalSecondes) {
    $tempstourElement.innerText = `Durée d'un tour ${formaterTemps(tempsTotalSecondes)}`;
}
export function afficherDureeTourEnCours(tempsTotalSecondesJ1, tempsTotalSecondesJ2) {
    $tempstourElement.innerText = `Durée d'un tour \nJ1 ${formaterTemps(tempsTotalSecondesJ1)}\nJ2 ${formaterTemps(tempsTotalSecondesJ2)}`;
}


export function afficherNumeroTour(joueur, numeroTour) {
    const element = joueur === 1 ? $numeroTourJ1 : $numeroTourJ2;
    if(numeroTour < MAX_TOURS) {
    element.innerText = `Tour n° ${numeroTour}`;
    } else element.innerText = `Fin de partie`;
}

export function mettreAJourNoms(nomJoueurStr, $nomAfficheJoueur) {
    $nomAfficheJoueur.innerText = nomJoueurStr;
   
}


/**
 * Une fois la partie lancer plusieurs éléments changent d'état
 * Le formulaire du choix de l'heure et les consignes passent en display none
 * et les noms des joueurs deviennet visible
 */


export function masquerFormulaireEtConsignes() {
    $form.style.display = "none";
    $consigneJ1.style.display = "none";
    $consigneJ2.style.display = "none";
    $inputRadio.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
    $inputRadio.classList.add('d-none');
}

export function afficherNom() {
    $nomAfficheJ1.style.display = "block";
    $nomAfficheJ2.style.display = "block";
}

export function contourJoueurActif(joueur) {
    const elementJoueurActif = joueur === 1 ? $startJ1 : $startJ2;
    elementJoueurActif.classList.add("joueurActif");
    elementJoueurActif.classList.remove("grise");
    const elementJoueurPassif = joueur === 1 ? $startJ2 : $startJ1;
    elementJoueurPassif.classList.remove("joueurActif");
    elementJoueurPassif.classList.add("grise");
}

const $background = document.getElementById("background");

export function afficherTerrain(){
    $background.classList.remove('imgBackgroundBegin');
    $background.classList.add('imgBackground');
}



export function choixRadio(callback) {
    $inputRadio.addEventListener("change", (e) => {
  if (e.target.name === 'radioPartie' && e.target.type === 'radio') {
    callback(e.target.value);
  }
});

}

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
// Gestion des boutons radio
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