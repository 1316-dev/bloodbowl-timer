//###########################################
// Message d'alerte si on quitte la page
//###########################################

window.onbeforeunload = function () {
  if (joueurActif != null)
    return confirm("Si vous quittez la page le Timer sera réinitialisé?");
};

//###########################################
// Gestion des INPUT : saisi utilisateur
//###########################################

//====================================
// Récupérer le temps de partie choisi
//====================================

let heuresPartieChoisies;
let minutesPartieChoisies;

// Récupérer les heures
const $inputHeuresPartie = document.getElementById("inputHeuresPartie");
$inputHeuresPartie.addEventListener("input", (event) => {
  // variable qui mémorise le temps de partie choisi
  heuresPartieChoisies = $inputHeuresPartie.value;
  console.log("heures: " + heuresPartieChoisies);
});

// Récupérer les minutes
const $inputminutesPartie = document.getElementById("inputminutesPartie");
$inputminutesPartie.addEventListener("input", (event) => {
  // variable qui mémorise le temps de partie choisi
  minutesPartieChoisies = $inputminutesPartie.value;
  console.log("minutes: " + minutesPartieChoisies);
});

// Récupérer le nom du joueur Vert
const $nomJ1 = document.getElementById("inputNomJ1");
$nomJ1.addEventListener("input", (event) => {
  // variable qui mémorise le temps de partie choisi
  const nomJ1Str = $nomJ1.value;
  console.log(nomJ1Str);
  $inputNomJ1.innerText = `${nomJ1Str}`;
});

// Récupérer le nom du joueur Vert
const $nomJ2 = document.getElementById("inputNomJ2");
$nomJ2.addEventListener("input", (event) => {
  // variable qui mémorise le temps de partie choisi
  const nomJ2Str = $nomJ2.value;
  $inputNomJ2.innerText = `${nomJ2Str}`;
});

//=====================================================
// Fonction de convertion minute en minutes + secondes
//====================================================

let minutes;
let secondes;

function convertMinutesToMinutesAndSeconds(minutes) {
  const totalSeconds = minutes * 60;
  const seconds = totalSeconds % 60;
  const remainingMinutes = (totalSeconds - seconds) / 60;
  return {
    minutes: remainingMinutes,
    secondes: seconds.toFixed(0),
  };
}
//=======================================
// Calculer et afficher le temps d'un tour
//=======================================

// Variable d'état
let tempsPartie;
let tempsTour;
let conversion;
let tempsPartieJ1;
let tempsTourJ1;
let tempsPartieJ2;
let tempsTourJ2;
const NbTourParJoueur = 16;

let $valider = document.getElementById("valider");
$valider.addEventListener("click", function (e) {
  tempsPartie =
    parseInt(heuresPartieChoisies * 60) + parseInt(minutesPartieChoisies);
  tempsTour = tempsPartie / (NbTourParJoueur * 2).toFixed(2);
  conversion = convertMinutesToMinutesAndSeconds(tempsTour);
  console.log("temps de tour :" + tempsTour);
  const tempstourElement = document.getElementById("tempstour");
  tempstourElement.innerText = `Durée d'un tour : ${conversion.minutes}:${conversion.secondes}`;
  tempsPartieJ1 = (tempsPartie / 2) * 60;
  tempsTourJ1 = tempsTour * 60;
  tempsPartieJ2 = (tempsPartie / 2) * 60;
  tempsTourJ2 = tempsTour * 60;


});

//###########################################
// Gestion des timers du joueur 1
//###########################################

// identifiant des minuteurs
let timerIdJ1 = null;
let timerTourIdJ1 = null;

//Paramètre du jeu si fixe
// durée tour en minutes
//const dureeTour = 4;

//const TempsTourInitial = dureeTour*60;

// Variable d'état
//let tempsPartieJ1 = (dureeTour*NbTourParJoueur) * 60;
let compteurTourJ1 = 0;

//====================================
// Gestion du Timer de Tour Joueur 1
//====================================
// élément du DOM
const timerTourElementJ1 = document.getElementById("timerTourJ1");

//variable affichage du timer
let minutesTourJ1;
let secondesTourJ1;

// Démarre le timer du tour
function demmarrerTourJ1() {
  // if(timerTourIdJ1){
  //   console.log("Le minuteur est déjà en cours.");
  //   return;
  // }
  // console.log("Minuteur démarré")

  timerTourIdJ1 = setInterval(() => {
    minutesTourJ1 = parseInt(tempsTourJ1 / 60, 10);
    secondesTourJ1 = parseInt(tempsTourJ1 % 60, 10);

    minutesTourJ1 = minutesTourJ1 < 10 ? "0" + minutesTourJ1 : minutesTourJ1;
    secondesTourJ1 =
      secondesTourJ1 < 10 ? "0" + secondesTourJ1 : secondesTourJ1;

    timerTourElementJ1.innerText = `Tour  ${minutesTourJ1}:${secondesTourJ1}`;
    tempsTourJ1 = tempsTourJ1 <= 0 ? 0 : tempsTourJ1 - 1;
  }, 1000);
}

// Arreter le timer de Tour
function arreterTourJ1() {
  if (timerTourIdJ1) {
    clearInterval(timerTourIdJ1);
    timerTourIdJ1 = null;
  } else console.log("le minuteur n'est pas actif");
}

//Réinitialiser le timer du tour
function reinitialiserTourJ1() {
  arreterTourJ1();

  // opérateur Unaire Plus : pour convertir les variables de type String en int
  // calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  tempsTourJ1 =
    (minutesPartieJ1 * 60 + heuresPartieJ1 * 3600 + secondesPartieJ1) /
    (NbTourParJoueur - compteurTourJ1);
  console.log(tempsTourJ1);
}

//=======================================
// Gestion du Timer de Partie du Joeur 1
//=======================================

// élément du DOM
const timerPartieElementJ1 = document.getElementById("timerPartieJ1");

//variable affichage du timer de Partie
let minutesPartieJ1;
let secondesPartieJ1;
let heuresPartieJ1;

// Lancer le Timer de partie
function demmarrerJ1() {
  // if(timerIdJ1){
  //   console.log("Le minuteur est déjà en cours.");
  //   return;
  // }
  // console.log("Minuteur démarré")

  timerIdJ1 = setInterval(() => {
    minutesPartieJ1 = parseInt(tempsPartieJ1 / 60, 10);
    secondesPartieJ1 = parseInt(tempsPartieJ1 % 60, 10);
    heuresPartieJ1 = Math.trunc(minutesPartieJ1 / 60);

    //heuresPartieJ1 = heuresPartieJ1 < 10 ? "0" + heuresPartieJ1 + ":": heuresPartieJ1;
    heuresPartieJ1 = heuresPartieJ1 < 1 ? " " : heuresPartieJ1;
    minutesPartieJ1 =
      minutesPartieJ1 > 60 ? minutesPartieJ1 - 60 : minutesPartieJ1;
    minutesPartieJ1 = minutesPartieJ1 == 60 ? "0" : minutesPartieJ1;
    minutesPartieJ1 =
      minutesPartieJ1 < 10 ? "0" + minutesPartieJ1 : minutesPartieJ1;
    secondesPartieJ1 =
      secondesPartieJ1 < 10 ? "0" + secondesPartieJ1 : secondesPartieJ1;

    timerPartieElementJ1.innerText = `Partie  ${heuresPartieJ1}:${minutesPartieJ1}:${secondesPartieJ1}`;
    tempsPartieJ1 = tempsPartieJ1 <= 0 ? 0 : tempsPartieJ1 - 1;
  }, 1000);
}

// Arreter le timer de partie
function arreterJ1() {
  if (timerIdJ1) {
    clearInterval(timerIdJ1);
    timerIdJ1 = null;
  } else console.log("le minuteur n'est pas actif");
}

// ==================================
// Gestion des clicks sur les boutons
// ==================================

let compteurJ1 = 0;
let compteurJ2 = 0;
// Si le premier Joueur de la partie est J1 alors let joueurActif = 1
// Si le premier Joueur de la partie est J2 alors let joueurActif = 2
let joueurActif;

// élément du DOM
const $consigneJ1 = document.getElementById("consigneJ1");
const $consigneJ2 = document.getElementById("consigneJ2");
const $inputNomJ1 = document.getElementById("nomJ1");
const $inputNomJ2 = document.getElementById("nomJ2");
const $form = document.getElementById("form");


// transformation en un seul bouton start/stop
let $startJ1 = document.getElementById("J1");
$startJ1.addEventListener("click", function (e) {
  $consigneJ1.style.display = "none";
  $consigneJ2.style.display = "none";
  $inputNomJ1.style.visibility = "visible";
  $inputNomJ2.style.visibility = "visible";
  compteurJ1 += 1;
  if (compteurJ2 == 0 && compteurJ1 % 2 != 0) {
    $form.style.display = "none";
    joueurActif = 2;
    demmarrerJ2();
    demmarrerTourJ2();
    compteurTourJ1 = 1;
    compteurTourJ2 = 1;
    $numeroTourJ2.innerText = `Tour n°:${compteurTourJ2}`;
  } else if (joueurActif == 1) {
    console.log("ici")
    arreterJ1();
    arreterTourJ1();
    reinitialiserTourJ2();
    demmarrerJ2();
    demmarrerTourJ2();
    compteurTourJ1 += 1;
    $numeroTourJ2.innerText = `Tour n°:${compteurTourJ2}`;
    joueurActif = 2;
  }
});



//=======================================
// Gestion d'affichage du nombre de tour
//=======================================

// élément du DOM
const $numeroTourJ1 = document.getElementById("numeroTourJ1");

//###########################################
// Gestion des timers du joueur 2
//###########################################

// identifiant des minuteurs
let timerIdJ2 = null;
let timerTourIdJ2 = null;

// Variable d'état
let compteurTourJ2 = 0;

//====================================
// Gestion du Timer de Tour Joueur 2
//====================================
// élément du DOM
const timerTourElementJ2 = document.getElementById("timerTourJ2");

//variable affichage du timer
let minutesTourJ2;
let secondesTourJ2;

// Démarre le timer du tour
function demmarrerTourJ2() {
  // if(timerTourIdJ2){
  //   console.log("Le minuteur est déjà en cours.");
  //   return;
  // }
  // console.log("Minuteur démarré")

  timerTourIdJ2 = setInterval(() => {
    minutesTourJ2 = parseInt(tempsTourJ2 / 60, 10);
    secondesTourJ2 = parseInt(tempsTourJ2 % 60, 10);

    minutesTourJ2 = minutesTourJ2 < 10 ? "0" + minutesTourJ2 : minutesTourJ2;
    secondesTourJ2 =
      secondesTourJ2 < 10 ? "0" + secondesTourJ2 : secondesTourJ2;

    timerTourElementJ2.innerText = `Tour  ${minutesTourJ2}:${secondesTourJ2}`;
    tempsTourJ2 = tempsTourJ2 <= 0 ? 0 : tempsTourJ2 - 1;
  }, 1000);
}

// Arreter le timer de Tour
function arreterTourJ2() {
  if (timerTourIdJ2) {
    clearInterval(timerTourIdJ2);
    timerTourIdJ2 = null;
  } else console.log("le minuteur n'est pas actif");
}

//Réinitialiser le timer du tour
function reinitialiserTourJ2() {
  arreterTourJ2();
  // opérateur Unaire Plus : pour convertir les variables de type String en int
  // calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  tempsTourJ2 =
    (minutesPartieJ2 * 60 + heuresPartieJ2 * 3600 + secondesPartieJ2) /
    (NbTourParJoueur - compteurTourJ2);
}

//=======================================
// Gestion du Timer de Partie du Joeur 2
//=======================================

// élément du DOM
const timerPartieElement = document.getElementById("timerPartieJ2");

//variable affichage du timer de Partie
let minutesPartieJ2;
let secondesPartieJ2;
let heuresPartieJ2;

// Lancer le Timer de partie
function demmarrerJ2() {
  timerIdJ2 = setInterval(() => {
    minutesPartieJ2 = parseInt(tempsPartieJ2 / 60, 10);
    secondesPartieJ2 = parseInt(tempsPartieJ2 % 60, 10);
    heuresPartieJ2 = Math.trunc(minutesPartieJ2 / 60);

    //heuresPartieJ2 = heuresPartieJ2 < 10 ? "0" + heuresPartieJ2 + ":": heuresPartieJ2;
    heuresPartieJ2 = heuresPartieJ2 < 1 ? " " : heuresPartieJ2;
    minutesPartieJ2 =
      minutesPartieJ2 > 60 ? minutesPartieJ2 - 60 : minutesPartieJ2;
    minutesPartieJ2 = minutesPartieJ2 == 60 ? "0" : minutesPartieJ2;
    minutesPartieJ2 =
      minutesPartieJ2 < 10 ? "0" + minutesPartieJ2 : minutesPartieJ2;
    secondesPartieJ2 =
      secondesPartieJ2 < 10 ? "0" + secondesPartieJ2 : secondesPartieJ2;

    timerPartieElement.innerText = `Partie  ${heuresPartieJ2}:${minutesPartieJ2}:${secondesPartieJ2}`;
    tempsPartieJ2 = tempsPartieJ2 <= 0 ? 0 : tempsPartieJ2 - 1;
  }, 1000);
}

// Arreter le timer de partie
function arreterJ2() {
  if (timerIdJ2) {
    clearInterval(timerIdJ2);
    timerIdJ2 = null;
  } else console.log("le minuteur n'est pas actif");
}

// ==================================
// Gestion des clicks sur les boutons joueur 2
// ==================================

let $startJ2 = document.getElementById("J2");
$startJ2.addEventListener("click", function (e) {
  $consigneJ1.style.display = "none";
  $consigneJ2.style.display = "none";
  $inputNomJ1.style.visibility = "visible";
  $inputNomJ2.style.visibility = "visible";
  compteurJ2 += 1;
  if (compteurJ1 == 0 && compteurJ2 % 2 != 0) {
    $form.style.display = "none";
    joueurActif == 1;
    demmarrerJ1();
    demmarrerTourJ2();
    compteurTourJ2 = 1;
    compteurTourJ1 = 1;
    $numeroTourJ1.innerText = `Tour n°:${compteurTourJ1}`;
  } else if (joueurActif == 2) {
    console.log("la")
    demmarrerTourJ1();
    demmarrerJ1();
    arreterJ2();
    arreterTourJ2();
    reinitialiserTourJ2();
    compteurTourJ2 += 1;
    $numeroTourJ1.innerText = `Tour n°:${compteurTourJ1}`;
    joueurActif = 1;
  }
});

//=======================================
// Gestion d'affichage du nombre de tour
//=======================================

// élément du DOM
const $numeroTourJ2 = document.getElementById("numeroTourJ2");

//=======================================
// Gestion du bouton pause
//=======================================

let compteurPause = 0;
let $pause = document.getElementById("pause");
$pause.addEventListener("click", function (e) {
 if (joueurActif == 1){
  if (compteurPause % 2 == 0) {
    arreterJ1();
    arreterTourJ1();
    compteurPause += 1;
  } else {
    demmarrerJ1();
    demmarrerTourJ1();
    compteurPause += 1
  }} else if (joueurActif == 2){
    if (compteurPause % 2 == 0) {
    arreterJ2();
    arreterTourJ2();
    compteurPause += 1;
  } else {
    demmarrerJ2();
    demmarrerTourJ2();
    compteurPause += 1
  }}
});
