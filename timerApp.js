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
$inputHeuresPartie.addEventListener('input', (event) => {
    // variable qui mémorise le temps de partie choisi
    heuresPartieChoisies = $inputHeuresPartie.value; 
    console.log("heures: "+ heuresPartieChoisies);
});

// Récupérer les minutes
const $inputminutesPartie = document.getElementById("inputminutesPartie");
$inputminutesPartie.addEventListener('input', (event) => {
    // variable qui mémorise le temps de partie choisi
    minutesPartieChoisies = $inputminutesPartie.value; 
    console.log("minutes: "+ minutesPartieChoisies);
});

//=====================================================
// Fonction de convertion minute en minutes + secondes
//====================================================

let minutes
let secondes

function convertMinutesToMinutesAndSeconds(minutes) {
    const totalSeconds = minutes * 60;
    const seconds = totalSeconds % 60;
    const remainingMinutes = (totalSeconds - seconds) / 60;
    return {
        minutes: remainingMinutes,
        secondes: seconds.toFixed(0)
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

let $valider = document.getElementById("valider")
$valider.addEventListener("click", function (e){
  tempsPartie = parseInt((heuresPartieChoisies)*60)+parseInt(minutesPartieChoisies)
  tempsTour = tempsPartie/(NbTourParJoueur*2).toFixed(2);
  conversion = convertMinutesToMinutesAndSeconds(tempsTour);
  console.log("temps de tour :" + tempsTour)
const tempstourElement = document.getElementById("tempstour");
tempstourElement.innerText = `Durée d'un tour : ${conversion.minutes}:${conversion.secondes}`;
  tempsPartieJ1 = (tempsPartie/2)*60;
  tempsTourJ1 = tempsTour*60
  tempsPartieJ2 = (tempsPartie/2)*60;
  tempsTourJ2 = tempsTour*60
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
function demmarrerTourj1(){
  if(timerTourIdJ1){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")

  timerTourIdJ1 = setInterval(() => {
    minutesTourJ1 = parseInt(tempsTourJ1 / 60, 10);
    secondesTourJ1 = parseInt(tempsTourJ1 % 60, 10);
    

    minutesTourJ1  = minutesTourJ1  < 10 ? "0" + minutesTourJ1  : minutesTourJ1 ;
    secondesTourJ1 = secondesTourJ1 < 10 ? "0" + secondesTourJ1 : secondesTourJ1;

    timerTourElementJ1.innerText = `${minutesTourJ1 }:${secondesTourJ1}`;
    tempsTourJ1 = tempsTourJ1 <= 0 ? 0 : tempsTourJ1 - 1;
  }, 1000);
}

// Arreter le timer de Tour
function arreterTourj1() {
  if (timerTourIdJ1){
    clearInterval(timerTourIdJ1);
    timerTourIdJ1 = null;
  } else
  console.log("le minuteur n'est pas actif")
}

//Réinitialiser le timer du tour
function reinitialiserTourJ1() {
  arreterTourj1();
  console.log(heuresPartieJ1 + " " + minutesPartieJ1 + " "+ secondesPartieJ1)
  console.log(minutesPartieJ1+(heuresPartieJ1*60))
  // opérateur Unaire Plus : pour convertir les variables de type String en int
  // calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  tempsTourJ1 = ((minutesPartieJ1*60)+((heuresPartieJ1)*3600)+((secondesPartieJ1)))/(NbTourParJoueur-compteurTourJ1);
  console.log(tempsTourJ1)
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
function demmarrerj1(){
  if(timerIdJ1){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")


  timerIdJ1 = setInterval(() => {
  minutesPartieJ1 = parseInt(tempsPartieJ1 / 60, 10);
  secondesPartieJ1 = parseInt(tempsPartieJ1 % 60, 10);
  heuresPartieJ1 = Math.trunc(minutesPartieJ1 / 60);
 
  //heuresPartieJ1 = heuresPartieJ1 < 10 ? "0" + heuresPartieJ1 + ":": heuresPartieJ1;
  heuresPartieJ1 = heuresPartieJ1 < 1 ? " " : heuresPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 > 60 ? (minutesPartieJ1-60) : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 == 60 ? "0" : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 < 10 ? "0" + minutesPartieJ1 : minutesPartieJ1;
  secondesPartieJ1 = secondesPartieJ1 < 10 ? "0" + secondesPartieJ1 : secondesPartieJ1;

  timerPartieElementJ1.innerText = `${heuresPartieJ1}:${minutesPartieJ1}:${secondesPartieJ1}`;
  tempsPartieJ1 = tempsPartieJ1 <= 0 ? 0 : tempsPartieJ1 - 1;
}, 1000);
}

// Arreter le timer de partie
function arreterj1() {
  if (timerIdJ1){
    clearInterval(timerIdJ1);
    timerIdJ1 = null;
  } else
  console.log("le minuteur n'est pas actif")
}

// ==================================
// Gestion des clicks sur les boutons
// ==================================

let compteur =0;

let $stopJ1 = document.getElementById("stopJ1")
$stopJ1.addEventListener("click", function (e){
arreterj1();
arreterTourj1();
reinitialiserTourJ1();
compteurTourJ1+=1
});

let $startJ1 = document.getElementById("startJ1")
$startJ1.addEventListener("click", function (e){
compteur+=1
console.log(compteur)
if (compteur % 2 != 0) {
  demmarrerj1();
  demmarrerTourj1();
  } else {
      arreterj1();
      arreterTourj1();
      reinitialiserTourJ1();
      compteurTourJ1+=1
}
});

let $pauseJ1 = document.getElementById("pauseJ1")
$pauseJ1.addEventListener("click", function (e){
arreterj1();
arreterTourj1();
});

//###########################################
// Gestion des timers du joueur 2
//###########################################

// identifiant des minuteurs
let timerIdJ2 = null;
let timerTourIdJ2 = null;

//Paramètre du jeu si fixe
// durée tour en minutes
//const dureeTour = 4;  
//const NbTourParJoueur = 16;
//const TempsTourInitial = dureeTour*60;

// Variable d'état
//let tempsPartieJ2 = (dureeTour*NbTourParJoueur) * 60;
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
function demmarrerTour(){
  if(timerTourIdJ2){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")

  timerTourIdJ2 = setInterval(() => {
    minutesTourJ2 = parseInt(tempsTourJ2 / 60, 10);
    secondesTourJ2 = parseInt(tempsTourJ2 % 60, 10);
    

    minutesTourJ2 = minutesTourJ2  < 10 ? "0" + minutesTourJ2  : minutesTourJ2 ;
    secondesTourJ2 = secondesTourJ2 < 10 ? "0" + secondesTourJ2 : secondesTourJ2;

    timerTourElementJ2.innerText = `${minutesTourJ2 }:${secondesTourJ2}`;
    tempsTourJ2 = tempsTourJ2 <= 0 ? 0 : tempsTourJ2 - 1;
  }, 1000);
}

// Arreter le timer de Tour
function arreterTour() {
  if (timerTourIdJ2){
    clearInterval(timerTourIdJ2);
    timerTourIdJ2 = null;
  } else
  console.log("le minuteur n'est pas actif")
}

//Réinitialiser le timer du tour
function reinitialiserTour() {
  arreterTour();
  console.log(heuresPartieJ2 + " " + minutesPartieJ2 + " "+ secondesPartieJ2)
  console.log(minutesPartieJ2+(heuresPartieJ2*60))
  // opérateur Unaire Plus : pour convertir les variables de type String en int
  // calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  tempsTourJ2 = ((minutesPartieJ2*60)+((heuresPartieJ2)*3600)+((secondesPartieJ2)))/(NbTourParJoueur-compteurTourJ2);
  console.log(tempsTourJ2)
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
function demmarrer(){
  if(timerIdJ2){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")


  timerIdJ2 = setInterval(() => {
  minutesPartieJ2 = parseInt(tempsPartieJ2 / 60, 10);
  secondesPartieJ2 = parseInt(tempsPartieJ2 % 60, 10);
  heuresPartieJ2 = Math.trunc(minutesPartieJ2 / 60);
 
  //heuresPartieJ2 = heuresPartieJ2 < 10 ? "0" + heuresPartieJ2 + ":": heuresPartieJ2;
  heuresPartieJ2 = heuresPartieJ2 < 1 ? " " : heuresPartieJ2;
  minutesPartieJ2 = minutesPartieJ2 > 60 ? (minutesPartieJ2-60) : minutesPartieJ2;
  minutesPartieJ2 = minutesPartieJ2 == 60 ? "0" : minutesPartieJ2;
  minutesPartieJ2 = minutesPartieJ2 < 10 ? "0" + minutesPartieJ2 : minutesPartieJ2;
  secondesPartieJ2 = secondesPartieJ2 < 10 ? "0" + secondesPartieJ2 : secondesPartieJ2;

  timerPartieElement.innerText = `${heuresPartieJ2}:${minutesPartieJ2}:${secondesPartieJ2}`;
  tempsPartieJ2 = tempsPartieJ2 <= 0 ? 0 : tempsPartieJ2 - 1;
}, 1000);
}

// Arreter le timer de partie
function arreter() {
  if (timerIdJ2){
    clearInterval(timerIdJ2);
    timerIdJ2 = null;
  } else
  console.log("le minuteur n'est pas actif")
}

// ==================================
// Gestion des clicks sur les boutons
// ==================================

let $stop = document.getElementById("stopJ2")
$stop.addEventListener("click", function (e){
arreter();
arreterTour();
reinitialiserTour();
compteurTourJ2+=1
});

let $start = document.getElementById("startJ2")
$start.addEventListener("click", function (e){
demmarrer();
demmarrerTour();
});
