let timerId = null;
let timerTourId = null;

const dureeTour = 2;
const NbTourParJoueur = 8;
const TempsTourInitial = dureeTour*60;

let tempsTour = TempsTourInitial;
let tempsPartieJ1 = (dureeTour*NbTourParJoueur) * 60;

const timerTourElement = document.getElementById("timerTour");

let minutesTour 
let secondesTour

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

function arreterTour() {
  if (timerTourId){
    clearInterval(timerTourId);
    timerTourId = null;
  } else
  console.log("le minuteur n'est pas actif")
}

function reinitialiserTour() {
  arreterTour();
  tempsTour = TempsTourInitial;
}

let $stop = document.getElementById("stop")
$stop.addEventListener("click", function (e){
console.log(minutesTour + ":" + secondesTour );
arreter();
arreterTour();
reinitialiserTour();
});

let $start = document.getElementById("start")
$start.addEventListener("click", function (e){
console.log(minutesTour + ":" + secondesTour );
demmarrer();
demmarrerTour();
});

const timerPartieElement = document.getElementById("timerPartie");

function demmarrer(){
  if(timerId){
    console.log("Le minuteur est déjà en cours.");
    return;
  }
  console.log("Minuteur démarré")


  timerId = setInterval(() => {
  let minutesPartieJ1 = parseInt(tempsPartieJ1 / 60, 10);
  let secondesPartieJ1 = parseInt(tempsPartieJ1 % 60, 10);
  let heuresPartieJ1 = Math.trunc(minutesPartieJ1 / 60);
 
  heuresPartieJ1 = heuresPartieJ1 < 10 ? "0" + heuresPartieJ1 + ":": heuresPartieJ1;
  heuresPartieJ1 = heuresPartieJ1 < 1 ? " " : heuresPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 > 60 ? (minutesPartieJ1-60) : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 == 60 ? "0" : minutesPartieJ1;
  minutesPartieJ1 = minutesPartieJ1 < 10 ? "0" + minutesPartieJ1 : minutesPartieJ1;
  secondesPartieJ1 = secondesPartieJ1 < 10 ? "0" + secondesPartieJ1 : secondesPartieJ1;

  timerPartieElement.innerText = `${heuresPartieJ1}${minutesPartieJ1}:${secondesPartieJ1}`;
  tempsPartieJ1 = tempsPartieJ1 <= 0 ? 0 : tempsPartieJ1 - 1;
}, 1000);
}

function arreter() {
  if (timerId){
    clearInterval(timerId);
    timerId = null;
  } else
  console.log("le minuteur n'est pas actif")
}

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