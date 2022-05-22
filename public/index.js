let image_grid = ""; 

function grabPokemonImage(data) {
  let pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  image_grid += ` ${pokemonName}<div class="picture"> 
  <a href="/profile/${data.id}">
  <img src="${data.sprites.other["official-artwork"].front_default}">
  </a> </div>`;
  
}

async function loadRandomPokemons() {
  let indexArray = [];
  while (indexArray.length < 9) {
    let randomIndex = Math.floor(Math.random() * 898) + 1;
    if (indexArray.indexOf(randomIndex) === -1) indexArray.push(randomIndex);
  }
  for (i = 1; i <= 9; i++) {
    if (i % 3 == 1) {
      image_grid += `<div class="gallery">`;
    }
    await $.ajax({
      type: "GET",
      url: `https://pokeapi.co/api/v2/pokemon/${indexArray[i - 1]}`,
      success: grabPokemonImage 
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
