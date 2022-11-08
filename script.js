"use strict";
const game = document.getElementById("game");

// variables
const gameSize = 375;
const gameWidth = 25;
let letHeroPosition = 355;
let direction = 1; // 1 for right -1 for left
let movingVarsRef = null;

for (let i = 0; i < gameSize; i++) {
  const enemy = document.createElement("div");
  game.appendChild(enemy);
}


// query selector for classes
const platforms = Array.from(document.querySelectorAll("#game div"));

const vars = (() => {
  const enemies = [];
  const max = 40;
  for (let i = 0; i <= max; i++) {
    if (i > 15 && i < 25 ) {
      continue;
    } else {
      enemies.push(i);
    }
  }
  return enemies;
})(); // <== this double parenthesis at the end executes it so that it executes the function and returns the value, vars is no longer a function but an array;

const drawVars = () => {
  for (let i = 0; i < vars.length; i++) {
    platforms[vars[i]].classList.add("var");
  }
};

const removeVars = () => {
  for (let i = 0; i < vars.length; i++) {
    platforms[vars[i]].classList.remove("var");
  }
};

drawVars();

platforms[letHeroPosition].classList.add("let-hero");

const moveHero = (e) => {
  // remove where he is
  platforms[letHeroPosition].classList.remove("let-hero");
  // what key is the user pressing? (left to right)
  if (e.key === "ArrowLeft" || e.key === "a") {
    // if its divisible by 25 and leaves no remainder it means we are the left  edge
    if (letHeroPosition % gameWidth !== 0) {
      letHeroPosition -= 1;
    }
  } else if (e.key === "ArrowRight" || e.key === "d") {
    // if its not at the right handside edge then we can move keep moving right
    if (letHeroPosition % gameWidth < gameWidth - 1) {
      letHeroPosition += 1;
    }
  }
  // add where the hero is now
  platforms[letHeroPosition].classList.add("let-hero");
};
// each time we click a key down (as in press something not the arrow down (I think))
document.addEventListener("keydown", moveHero); // why no parenthesis
// stackoverflow: no parenthesis because moveHero is being used as a function reference rather than returning the value of the function, if executed it would execute and return undefined

const moveVars = () => {

  // both leftEdge and rightEdge are booleans

  const leftEdge = vars[0] % gameWidth === 0; //they are now on the left edge
  
  // for the right edge the index is the very last invader (minus 1 because indexes start from 0 (length does not account for this))
  const rightEdge = vars[vars.length - 1] % gameWidth === gameWidth - 1;
  
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

  for (let i = 0; i < vars.length; i++) {
    vars[i] += direction;
  }
  drawVars();
};

movingVarsRef = setInterval(moveVars, 200);