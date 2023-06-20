const canvas = document.getElementById("canvas"); //on pointe le cnavas
const ctx = canvas.getContext("2d"); // permet d'anime dans le canvas ac de la 2d
const img = new Image();
img.src = "./media/flappy-bird-set.png";

//genere settings
let gamePlaying = false; // c'est un tgle si on joue ou nn
const gravity = 0.9;
const speed = 3; // vitesse d'arrivage des poteau
const size = [51, 36]; // taille de l'oiseau largeur et hauteur
const jump = -11.5;
const cTenth = canvas.width / 10;

//pipe settings
const pipeWidth = 78; // largeur des pteau
const pipeGap = 270; // ecart entre les poteau
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

let index = 0, //effet paralxe poteau plus rapide
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight, //vol
  flyHeight; // hauteur de vol

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2; //dc hauteur du canvas / 2 - la taille de l'oiseau /2

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
  console.log(pipes);
};

const render = () => {
  // plus pour a chaque fois que la foncion se joue
  index++;

  //Background

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width), //ici il ya une largeur d'ecran en moins pour supprimer les defauts
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth, //un dixieme de l'ecran de canvas
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      // dc 9 parametre un pour img qyatre pour la decouper de son endroit et quatre pour la plcer sur le canvas
      img,
      432,
      Math.floor((index % 9) / 3) * size[1], //permetd de tomber sur
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );

    flyHeight = canvas.height / 2 - size[1] / 2;

    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245); //context sorte de textcontent pour inserer du text et le placer

    ctx.fillText("Cliquer pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
  }

  //Pipes display
  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      //top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      //bottom pipes
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        //remove pipe + create new one
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }

      //if hit the pipes and game

      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render); // fait la fonction en boucle
};

setup();

img.onload = render; // au chargement de la page tu joue

document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump); //au click donne la caleur du jump
