"use strict";
const main = document.getElementById("main");

// variables
const enemyCount = 230;
let letHeroPosition = 205;

for (let i = 0; i < enemyCount; i++) {
  const enemy = document.createElement("div");
  main.appendChild(enemy);
}
const vars = (() => {
  const enemies = [];
  const max = 40;
  for (let i = 0; i <= max; i++) {
    enemies.push(i);
  }
  return enemies;
})() // <== this double parenthesis at the end executes it so that it executes the function and returns the value, vars is no longer a function but an array;

console.log(vars);
// query selector for classes
const varPlatforms = Array.from(document.querySelectorAll('#main div'));
console.log('varPlatforms: ', varPlatforms);

const draw = () => {
  for (let i = 0; i < vars.length; i++) {
    varPlatforms[vars[i]].classList.add('var');
  }
}
draw();

varPlatforms[letHeroPosition].classList.add("let-hero");

