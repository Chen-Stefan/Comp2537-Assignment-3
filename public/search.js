let currentType = null;
let currentRegion = null;
let pokemonName = null;
let nameInput = null;
let typeArray = [];
let typehitObject = {};
let regionHit = 1;
let nameHit = 1;
let regionidObject = {};
let nameidObject = {};
let now = new Date(Date.now());
let formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

// filter by type
function createSingleTypePokemon(data_t) {
    let pokemonID = data_t.id;
    let singlePokemonCard = 
        ` ${pokemonName}<div class="picture"> 
            <a href="http://localhost:5000/profile/${pokemonID}">
            <img src="${data_t.sprites.other["official-artwork"].front_default}">
            </a> </div>`; 
    $("#left-col").append(singlePokemonCard);
}

async function processPokemonByType(data) {
    let pokemonArray = data.pokemon;
    for(i = 0; i < pokemonArray.length; i++) {
        pokemonName = pokemonArray[i].pokemon.name;
        await $.ajax({
            type:"GET",
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
            success: createSingleTypePokemon
        })
    }  
}

function displaySpecificType(pokemonType) {
    $("#left-col").empty();
    let allTypes = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic",  "ice", "dragon", "dark", "fairy"];
    currentType = pokemonType;
    typeID = allTypes.indexOf(currentType) + 1
    $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/type/${typeID}`,
        success: processPokemonByType
    })
}

// filter by region
function createSingleRegionPokemon(data_r) {
    let pokemonID = data_r.id;
    let singleRegionPokemonName = data_r.name;
    let singlePokemonCard = 
        ` ${singleRegionPokemonName}<div class="picture"> 
            <a href="http://localhost:5000/profile/${pokemonID}">
            <img src="${data_r.sprites.other["official-artwork"].front_default}">
            </a> </div>`; 
    $("#left-col").append(singlePokemonCard);
}

function displaySpecificRegion(pokemonRegion) {
    $("#left-col").empty();
    let regionalID = {
        "kanto": [1, 151],
        "johto": [152, 251],
        "hoenn": [252, 386],
        "sinnoh": [387, 494],
        "unova": [495, 649],
        "kalos": [650, 721],
        "alola": [722, 809],
        "galar": [810, 898]
    }
    currentRegion = pokemonRegion;
    let startID = regionalID[currentRegion][0];
    let endID = regionalID[currentRegion][1];
    for (i = startID; i <= endID; i++) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: createSingleRegionPokemon
        })
    }
   
}

// search by name
function displaySearchResult(data_n) {
    $("#left-col").empty();
    let pokemonID = data_n.id;
    let singlePokemonCard = 
        ` ${nameInput}<div class="picture"> 
            <a href="http://localhost:5000/profile/${pokemonID}">
            <img src="${data_n.sprites.other["official-artwork"].front_default}">
            </a> </div>`; 
    $("#left-col").append(singlePokemonCard);
}

async function searchPokemonByName() {
    nameInput = $("#name-input").val();
    if (!/^[a-zA-Z]+$/.test(nameInput)) {
        alert("Wrong type! Please enter only string to search by name");
    }
    await $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${nameInput}`,
        success: displaySearchResult
    });
    addNewNameTimelineEvent(nameInput);
}
// add type filter timeline
function addNewTypeTimelineEvent(pokemonType) {
    if (!(typeArray.includes(pokemonType))) {
        typeArray.push(pokemonType);
        typehitObject[`${pokemonType}`] = 1;
        $.ajax({
            type: "PUT",
            url: "http://localhost:5000/timeline/insert",
            data: {
                text: `User searched for pokemon type: ${pokemonType}`,
                hits: 1,
                time: `${now}`
            },
            success: (res) => { 
                console.log(`We have a total of 1 search for type ${pokemonType}`)
            }
        })
    }else{
        $.ajax({
            type: "PUT",
            url: "http://localhost:5000/timeline/insert",
            data: {
                text: `User searched for pokemon type: ${pokemonType}`,
                hits: typehitObject[`${pokemonType}`],
                time: `${now}`
            },
            success: (res) => { 
                console.log(`We have a total of ${typehitObject[`${pokemonType}`] + 1} search for type ${pokemonType}`)
                let id = res._id;
                $.ajax({
                    type: "GET",
                    url: `http://localhost:5000/timeline/incrementHits/${id}`,
                    success: (res) => {typehitObject[`${pokemonType}`] ++;}
                })
            }
        })
    }
}
// add region filter timeline
function addNewRegionTimelineEvent(currentRegion) {
    if (!(currentRegion in regionidObject)) {
        $.ajax({
            type: "PUT",
            url: "http://localhost:5000/timeline/insert",
            data: {
                text: `User searched for pokemon region: ${currentRegion}`,
                hits: 1,
                time: `${now}`
            },
            success: (res) => {
                console.log("We have a new region search")
                // regionidObject[`${currentRegion}`] = res._id;
            }
        })
    }else{
        let id = regionidObject[`${currentRegion}`];
        $.ajax({
            type: "GET",
            url: `http://localhost:5000/timeline/incrementHits/${id}`,
            success: (res) => {console.log(res)}
        })
    }
}
// add name search timeline
function addNewNameTimelineEvent(nameInput) {
    if (!(nameInput in nameidObject)) {
        $.ajax({
            type: "PUT",
            url: "http://localhost:5000/timeline/insert",
            data: {
                text: `User searched for pokemon name: ${nameInput}`,
                hits: 1,
                time: `${now}`
            },
            success: (res) => {
                console.log("We have a new name search")
                nameidObject[`${nameInput}`] = res._id;
            }
        })
    }else {
        let id = nameidObject[`${nameInput}`];
        $.ajax({
            type: "GET",
            url: `http://localhost:5000/timeline/incrementHits/${id}`,
            success: (res) => {console.log(res)}
        })
    }
}

function setup() {
    $("#pokemon-type").change(() => {
        pokemonType = $("#pokemon-type option:selected").val();
        displaySpecificType(pokemonType);
        addNewTypeTimelineEvent(pokemonType);
    })

    displaySpecificRegion($("#pokemon-region option:selected").val());
    
    $("#pokemon-region").change(() => {
        pokemonRegion = $("#pokemon-region option:selected").val();
        displaySpecificRegion(pokemonRegion);
        addNewRegionTimelineEvent(currentRegion);
    })

    $("#search-btn").click(searchPokemonByName);
}

$(document).ready(setup);