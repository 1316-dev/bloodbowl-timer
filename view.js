// ===================================
// view.js
// ===================================

// Éléments du DOM

// Temps de Jeux choisit par les utilisateurs (input heures et input minutes)
// cette div nommé "form" disparaitra au lancement de la partie
export const $form = document.getElementById("form");
export const $inputHeuresPartie = document.getElementById("inputHeuresPartie");
export const $inputminutesPartie = document.getElementById("inputminutesPartie");

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

    return `${heuresStr}${minutesStr}:${secondesStr}`;
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

export function afficherDureeTour(minutes, secondes) {
    $tempstourElement.innerText = `Durée d'un tour : ${minutes}:${secondes}`;
}

export function afficherNumeroTour(joueur, numeroTour) {
    const element = joueur === 1 ? $numeroTourJ1 : $numeroTourJ2;
    element.innerText = `Tour n°:${numeroTour}`;
}

export function mettreAJourNoms(nomJ1Str, nomJ2Str) {
    $nomAfficheJ1.innerText = nomJ1Str;
    $nomAfficheJ2.innerText = nomJ2Str;
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
    // Rendez les zones d'affichage des noms visibles si elles étaient cachées
    $nomAfficheJ1.style.visibility = "visible";
    $nomAfficheJ2.style.visibility = "visible";
}