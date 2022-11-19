"use strict";
const game = document.getElementById("game");
const displayResult = document.createElement("h1");

// variables

const gameSize = 375;
const gameWidth = 25;
let letHeroPosition = 355;
let direction = 1; // 1 for right -1 for left
let movingVarsRef = null;
const removedVars = [];
const keyDownObjects = {};

for (let i = 0; i < gameSize; i++) {
  const enemy = document.createElement("div");
  game.appendChild(enemy);
}

// query selector for classes
const platforms = Array.from(document.querySelectorAll("#game div"));

let vars = (() => {
  const enemies = [];
  const max = 40;
  for (let i = 0; i <= max; i++) {
    if (i > 15 && i < 25) {
      continue;
    } else {
      enemies.push(i);
    }
  }
  return enemies;
})(); // <== this double parenthesis at the end executes it so that it executes the function and returns the value, vars is no longer a function but an array;

const drawVars = () => {
  for (let i = 0; i < vars.length; i++) {
    // platforms[vars[i]].classList.add("var");
    platforms[vars[i]].textContent = "var";
    platforms[vars[i]].style.fontSize = "15px";
    platforms[vars[i]].style.color = "blue";
  }
};

const removeVars = () => {
  for (let i = 0; i < vars.length; i++) {
    //platforms[vars[i]].classList.remove("var");
    platforms[vars[i]].textContent = "";
  }
};

drawVars();

// platforms[letHeroPosition].classList.add("let-hero");
platforms[letHeroPosition].textContent = "const";
platforms[letHeroPosition].fontWeight = "bolder";

const moveHero = (e) => {
  // remove where he is
  // platforms[letHeroPosition].classList.remove("let-hero");
  platforms[letHeroPosition].textContent = "";
  // what key is the user pressing? (left to right)
  if (
    e.key === "ArrowLeft" ||
    e.key === "a" ||
    (keyDownObjects["w"] && keyDownObjects["a"]) ||
    (keyDownObjects["ArrowUp"] && keyDownObjects["ArrowLeft"])
  ) {
    // if its divisible by 25 and leaves no remainder it means we are the left  edge
    if (letHeroPosition % gameWidth !== 0) {
      letHeroPosition -= 1;
    }
  } else if (
    e.key === "ArrowRight" ||
    e.key === "d" ||
    (keyDownObjects["w"] && keyDownObjects["d"]) ||
    (keyDownObjects["ArrowUp"] && keyDownObjects["ArrowRight"])
  ) {
    // if its not at the right handside edge then we can move keep moving right
    if (letHeroPosition % gameWidth < gameWidth - 1) {
      letHeroPosition += 1;
    }
  }
  // add where the hero is now
  // platforms[letHeroPosition].classList.add("let-hero");
  platforms[letHeroPosition].textContent = "const";
};
// each time we click a key down (as in press something not the arrow down (I think))
// why no parenthesis
// stackoverflow: no parenthesis because moveHero is being used as a function reference rather than returning the value of the function, if executed it would execute and return undefined

const moveVars = () => {
  // both leftEdge and rightEdge are booleans

  const leftEdge = vars[0] % gameWidth === 0; //they are now on the left edge

  // for the right edge the index is the very last invader (minus 1 because indexes start from 0 (length does not account for this))
  const rightEdge = vars[vars.length - 1] % gameWidth === gameWidth - 1;
  // remove the vars
  removeVars();

  // if vars have reached the rightEdge (judging from the position of the last var)
  // move all the vars in the opposite direction
  // because they are still touching the edge when moving down, ignore it if the direction has changed
  if (rightEdge && direction === 1) {
    for (let i = 0; i < vars.length; i++) {
      // this moves all the vars down 1 step
      vars[i] += gameWidth + 1;
      // this changes the direction of all the vars
      direction = -1;
    }
  }

  if (leftEdge && direction === -1) {
    for (let i = 0; i < vars.length; i++) {
      vars[i] += gameWidth - 1;
      direction = 1;
    }
  }
  // move all the vars by one depending on direction
  for (let i = 0; i < vars.length; i++) {
    vars[i] += direction;
  }
  // draw the vars (after moving)
  drawVars();
  // does the hero hit the var?
  if (platforms[letHeroPosition].textContent.includes("var", "let-hero")) {
    // Title screen
    displayResult.innerHTML = "GAME OVER";
    platforms[85].appendChild(displayResult);
    // save memory
    clearInterval(movingVarsRef);
  }

  // finding it hard to hit the bottom edge precisely;
  // this works for now, but does not hit the bottom precisely
  if (vars[vars.length - 1] > platforms.length - 2) {
    displayResult.innerHTML = "GAME OVER";
    platforms[85].appendChild(displayResult);
    clearInterval(movingVarsRef);
  }
  if (vars.length === 0) {
    console.log("you win");
    displayResult.innerHTML = "YOU WIN";
    // adds h1 display to the middle platform
    platforms[85].appendChild(displayResult);
    clearInterval(movingVarsRef);
  }
};
//turn it off here
movingVarsRef = setInterval(moveVars, 50);

// shooting the vars with lets
function shootLets(e) {
  keyDownObjects[e.key] = true;

  let letProjectileId;
  let letProjectileIndex = letHeroPosition; // im not sure about this
  const flyingLets = () => {
    try {
      if (letProjectileIndex >= 0) {
        // platforms[letProjectileIndex].classList.remove("let-projectile");
        if (letProjectileIndex < 350) {
          platforms[letProjectileIndex].textContent = "";
        }

        letProjectileIndex -= gameWidth;
        // platforms[letProjectileIndex].classList.add("let-projectile");
        platforms[letProjectileIndex].textContent = "let";
        platforms[letProjectileIndex].style.color = "purple";
        platforms[letProjectileIndex].fontWeight = "bold";
      } else {
        clearInterval(letProjectileId);
      }
    } catch (e) {
      console.log(e);
    }
    // does the projectile hit any of the vars
    if (vars.some((element) => element === letProjectileIndex && !removedVars.includes(element))) {
      // platforms[letProjectileIndex].classList.remove("let-projectile");
      platforms[letProjectileIndex].textContent = "";
      // platforms[letProjectileIndex].classList.remove("var");
      platforms[letProjectileIndex].classList.add("explosive");

      setTimeout(() => platforms[letProjectileIndex].classList.remove("explosive"), 100);
      clearInterval(letProjectileId);

      vars = vars.filter((element) => element !== letProjectileIndex);
    }
  };

  if (
    e.key === "ArrowUp" ||
    e.key === "w" ||
    (keyDownObjects["w"] && keyDownObjects["d"]) ||
    (keyDownObjects["w"] && keyDownObjects["a"]) ||
    (keyDownObjects["ArrowUp"] && keyDownObjects["ArrowLeft"]) ||
    (keyDownObjects["ArrowUp"] && keyDownObjects["ArrowRight"])
  ) {
    letProjectileId = setInterval(flyingLets, 100);
  }
}

document.addEventListener("keydown", shootLets);
document.addEventListener("keyup", (e) => delete keyDownObjects[e.key]);
document.addEventListener("keydown", moveHero);
