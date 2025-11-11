const dureeTour = 4;
const NbTour = 15;
let tempsTour = dureeTour*60;

const timerTourElement = document.getElementById("timerTour");

setInterval(() => {
  let minutesTour = parseInt(tempsTour / 60, 10);
  let secondesTour = parseInt(tempsTour % 60, 10);

  minutesTour  = minutesTour  < 10 ? "0" + minutesTour  : minutesTour ;
  secondesTour = secondesTour < 10 ? "0" + secondesTour : secondesTour;

  timerTourElement.innerText = `${minutesTour }:${secondesTour}`;
  tempsTour = tempsTour <= 0 ? 0 : tempsTour - 1;
}, 1000);


const timerPartieElement = document.getElementById("timerPartie");
 let tempsPartie = (dureeTour*NbTour) * 60;

setInterval(() => {
  let minutesPartie = parseInt(tempsPartie / 60, 10);
  let secondesPartie = parseInt(tempsPartie % 60, 10);
  let heuresPartie = Math.trunc(minutesPartie / 60);
 
  heuresPartie = heuresPartie < 10 ? "0" + heuresPartie + ":": heuresPartie;
  heuresPartie = heuresPartie < 1 ? " " : heuresPartie;
  minutesPartie = minutesPartie > 60 ? (minutesPartie-60) : minutesPartie;
  minutesPartie = minutesPartie == 60 ? "0" : minutesPartie;
  minutesPartie = minutesPartie < 10 ? "0" + minutesPartie : minutesPartie;
  secondesPartie = secondesPartie < 10 ? "0" + secondesPartie : secondesPartie;

  timerPartieElement.innerText = `${heuresPartie}${minutesPartie}:${secondesPartie}`;
  tempsPartie = tempsPartie <= 0 ? 0 : tempsPartie - 1;
}, 1000);