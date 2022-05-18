let image_grid = ""; 
let indexArray = [];

function grabPokemonImage(data) {
  console.log(data);
  let pokemonName = data[indexArray[i - 1]].name.charAt(0).toUpperCase() + data[indexArray[i - 1]].name.slice(1);
  image_grid += ` ${pokemonName}<div class="picture"> 
  <a href="/profile/${data[indexArray[i - 1]].id}">
  <img src="${data[indexArray[i - 1]].image}">
  </a> </div>`;
  
}

async function loadRandomPokemons() {
  // generate 9 unique random number between 1 and total count
  while (indexArray.length < 9) {
    let randomIndex = Math.floor(Math.random() * 14);
    if (indexArray.indexOf(randomIndex) === -1) indexArray.push(randomIndex);
  }
  for (i = 1; i <= 9; i++) {
    if (i % 3 == 1) {
      image_grid += `<div class="gallery">`;
    }
    await $.ajax({
      type: "GET",
      url: "https://frozen-plains-44646.herokuapp.com/pokemons",
      "success": grabPokemonImage 
    });

    if (i % 3 == 0) {
      image_grid += `</div>`;
    }
  }
  $("#container").html(image_grid);
}

function setup() {
  loadRandomPokemons();
}

$(document).ready(setup);
