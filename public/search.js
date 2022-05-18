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
    for(i = 0; i < data_t.length; i++) {
        let pokemonID = data_t[i].id;
        let pokemonName = data_t[i].name;
        let singlePokemonCard = 
        ` ${pokemonName}<div class="picture"> 
    <a href="https://frozen-plains-44646.herokuapp.com/profile/${pokemonID}">
    <img src="${data_t[i].image}">
    </a> </div>`; 
        $("#left-col").append(singlePokemonCard);
    }
}

function displaySpecificType(pokemonType) {
    $("#left-col").empty();
    currentType = pokemonType;
    $.ajax({
        type: "GET",
        url: `https://frozen-plains-44646.herokuapp.com/pokemons/${currentType}`,
        success: createSingleTypePokemon
    })
}

// filter by region
function createSingleRegionPokemon(data_r) {
    for(i = 0; i < data_r.length; i++) {
        let pokemonID = data_r[i].id;
        let singleRegionPokemonName = data_r[i].name;
        let singlePokemonCard = 
        ` ${singleRegionPokemonName}<div class="picture"> 
    <a href="https://frozen-plains-44646.herokuapp.com/profile/${pokemonID}">
    <img src="${data_r[i].image}">
    </a> </div>`; 
        $("#left-col").append(singlePokemonCard);
    }
}

function displaySpecificRegion(pokemonRegion) {
    $("#left-col").empty();
    currentRegion = pokemonRegion;
        $.ajax({
            type: "GET",
            url: `https://frozen-plains-44646.herokuapp.com/filter/${currentRegion}`,
            success: createSingleRegionPokemon
        })
}

// search by name
function displaySearchResult(data_n) {
    $("#left-col").empty();
    let pokemonID = data_n[0].id;
    let singlePokemonCard = 
    ` ${nameInput}<div class="picture"> 
    <a href="https://frozen-plains-44646.herokuapp.com/profile/${pokemonID}">
    <img src="${data_n[0].image}">
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
        url: `https://frozen-plains-44646.herokuapp.com/search/${nameInput}`,
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
            url: "https://frozen-plains-44646.herokuapp.com/timeline/insert",
            data: {
                text: `User searched for pokemon type: ${pokemonType}`,
                hits: 1,
                time: `${now}`
            },
            success: (res) => { 
                console.log(`We have a total of 1 search for type ${pokemonType}`)
                // console.log(typeArray)
            }
        })
    }else{
        $.ajax({
            type: "PUT",
            url: "https://frozen-plains-44646.herokuapp.com/timeline/insert",
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
                    url: `https://frozen-plains-44646.herokuapp.com/timeline/incrementHits/${id}`,
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
            url: "https://frozen-plains-44646.herokuapp.com/timeline/insert",
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
            url: `https://frozen-plains-44646.herokuapp.com/timeline/incrementHits/${id}`,
            success: (res) => {console.log(res)}
        })
    }
}
// add name search timeline
function addNewNameTimelineEvent(nameInput) {
    if (!(nameInput in nameidObject)) {
        $.ajax({
            type: "PUT",
            url: "https://frozen-plains-44646.herokuapp.com/timeline/insert",
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
            url: `https://frozen-plains-44646.herokuapp.com/timeline/incrementHits/${id}`,
            success: (res) => {console.log(res)}
        })
    }
}

function setup() {
    displaySpecificType($("#pokemon-type option:selected").val());

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