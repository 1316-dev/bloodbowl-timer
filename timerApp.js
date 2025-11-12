// identifiant des minuteurs
let timerId = null;
let timerTourId = null;

//Paramètre du jeu
// durée tour en minutes
const dureeTour = 4;  
const NbTourParJoueur = 16;
const TempsTourInitial = dureeTour*60;

// Variable d'état
let tempsTour = TempsTourInitial;
let tempsPartieJ1 = (dureeTour*NbTourParJoueur) * 60;
let compteurTourJ1 = 0;


//====================================
// Gestion du Timer de Tour Joueur 1
//====================================
// élément du DOM
const timerTourElement = document.getElementById("timerTour");

//variable affichage du timer
let minutesTour;
let secondesTour;

// Démarre le timer du tour
function demmarrerTour(){
  if(timerTourId){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")

  timerTourId = setInterval(() => {
    minutesTour = parseInt(tempsTour / 60, 10);
    secondesTour = parseInt(tempsTour % 60, 10);

    minutesTour  = minutesTour  < 10 ? "0" + minutesTour  : minutesTour ;
    secondesTour = secondesTour < 10 ? "0" + secondesTour : secondesTour;

    timerTourElement.innerText = `${minutesTour }:${secondesTour}`;
    tempsTour = tempsTour <= 0 ? 0 : tempsTour - 1;
  }, 1000);
}

// Arreter le timer de Tour
function arreterTour() {
  if (timerTourId){
    clearInterval(timerTourId);
    timerTourId = null;
  } else
  console.log("le minuteur n'est pas actif")
}

//Réinitialiser le timer du tour
function reinitialiserTour() {
  arreterTour();
  console.log(heuresPartieJ1 + " " + minutesPartieJ1 + " "+ secondesPartieJ1)
  console.log(minutesPartieJ1+(heuresPartieJ1*60))
  // opérateur Unaire Plus : pour convertir les variables de type String en int
  tempsTour = ((minutesPartieJ1*60)+((heuresPartieJ1)*3600)+((secondesPartieJ1)))/(NbTourParJoueur-compteurTourJ1);
  console.log(tempsTour)
}

//=======================================
// Gestion du Timer de Partie du Joeur 1
//=======================================

// élément du DOM
const timerPartieElement = document.getElementById("timerPartie");

//variable affichage du timer de Partie
let minutesPartieJ1;
let secondesPartieJ1;
let heuresPartieJ1; 

// Lancer le Timer de partie
function demmarrer(){
  if(timerId){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")


  timerId = setInterval(() => {
  minutesPartieJ1 = parseInt(tempsPartieJ1 / 60, 10);
  secondesPartieJ1 = parseInt(tempsPartieJ1 % 60, 10);
  heuresPartieJ1 = Math.trunc(minutesPartieJ1 / 60);
 
  //heuresPartieJ1 = heuresPartieJ1 < 10 ? "0" + heuresPartieJ1 + ":": heuresPartieJ1;
  heuresPartieJ1 = heuresPartieJ1 < 1 ? " " : heuresPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 > 60 ? (minutesPartieJ1-60) : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 == 60 ? "0" : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 < 10 ? "0" + minutesPartieJ1 : minutesPartieJ1;
  secondesPartieJ1 = secondesPartieJ1 < 10 ? "0" + secondesPartieJ1 : secondesPartieJ1;

  timerPartieElement.innerText = `${heuresPartieJ1}:${minutesPartieJ1}:${secondesPartieJ1}`;
  tempsPartieJ1 = tempsPartieJ1 <= 0 ? 0 : tempsPartieJ1 - 1;
}, 1000);
}

// Arreter le timer de partie
function arreter() {
  if (timerId){
    clearInterval(timerId);
    timerId = null;
  } else
  console.log("le minuteur n'est pas actif")
}

// ==================================
// Gestion des clicks sur les boutons
// ==================================

let $stop = document.getElementById("stop")
$stop.addEventListener("click", function (e){
arreter();
arreterTour();
reinitialiserTour();
compteurTourJ1+=1
});

let $start = document.getElementById("start")
$start.addEventListener("click", function (e){
demmarrer();
demmarrerTour();
});



/*
setInterval(() => {
  let minutesTour = parseInt(tempsTour / 60, 10);
  let secondesTour = parseInt(tempsTour % 60, 10);

  minutesTour  = minutesTour  < 10 ? "0" + minutesTour  : minutesTour ;
  secondesTour = secondesTour < 10 ? "0" + secondesTour : secondesTour;

  timerTourElement.innerText = `${minutesTour }:${secondesTour}`;
  tempsTour = tempsTour <= 0 ? 0 : tempsTour - 1;
}, 1000);
*/