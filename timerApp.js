//###########################################
// Gestion des INPUT : saisi utilisateur
//###########################################


//====================================
// Récupérer le temps de partie choisi
//====================================

let heuresPartieChoisies
let minutesPartieChoisies

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
let tempsPartieJ1;
let conversion;
let tempsTourJ1

let $valider = document.getElementById("valider")
$valider.addEventListener("click", function (e){
  tempsPartie = parseInt((heuresPartieChoisies)*60)+parseInt(minutesPartieChoisies)
  tempsTour = tempsPartie/(NbTourParJoueur*2).toFixed(2);
  conversion = convertMinutesToMinutesAndSeconds(tempsTour);
  console.log("temps de tour :" + tempsTour)
const tempstourElement = document.getElementById("timerTour");
tempstourElement.innerText = `Durée d'un tour : ${conversion.minutes}:${conversion.secondes}`;
  tempsPartieJ1 = (tempsPartie/2)*60;
  tempsTourJ1 = tempsTour*60
});



//###########################################
// Gestion des timers
//###########################################

// identifiant des minuteurs
let timerId = null;
let timerTourId = null;

//Paramètre du jeu
// durée tour en minutes
const dureeTour = 4;  
const NbTourParJoueur = 16;
const TempsTourInitial = dureeTour*60;

// Variable d'état
//let tempsPartieJ1 = (dureeTour*NbTourParJoueur) * 60;
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
    minutesTour = parseInt(tempsTourJ1 / 60, 10);
    secondesTour = parseInt(tempsTourJ1 % 60, 10);
    

    minutesTour  = minutesTour  < 10 ? "0" + minutesTour  : minutesTour ;
    secondesTour = secondesTour < 10 ? "0" + secondesTour : secondesTour;

    timerTourElement.innerText = `${minutesTour }:${secondesTour}`;
    tempsTourJ1 = tempsTourJ1 <= 0 ? 0 : tempsTourJ1 - 1;
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
  // calcul de la durée du prochain tour : Temps global restants diviser par le nombre de tour restant
  tempsTourJ1 = ((minutesPartieJ1*60)+((heuresPartieJ1)*3600)+((secondesPartieJ1)))/(NbTourParJoueur-compteurTourJ1);
  console.log(tempsTourJ1)
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
