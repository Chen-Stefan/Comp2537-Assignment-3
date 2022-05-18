const express = require("express");
var session = require("express-session")
const res = require("express/lib/response");
const app = express();      
const bodyparser = require("body-parser");
const https = require('https');       
const mongoose = require('mongoose');


app.use(bodyparser.urlencoded({
    extended: true
  }));

  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));     
  
  app.listen(process.env.PORT || 5000, function (err) {     // anonymous function as the second parameter
      if(err) console.log(err);
  })

  
mongoose.connect(  // username   password             database name
  "mongodb+srv://stefan79:chenzehan789@cluster0.s5zqy.mongodb.net/pokemonDB?retryWrites=true&w=majority", 
  { useNewUrlParser: true, useUnifiedTopology: true });

const pokemonSchema = new mongoose.Schema({
  name: String,
  id: Number,
  type: [String],
  hp: Number,
  attack: Number,        
  defense: Number,        
  spAttack: Number,        
  spDefense: Number,        
  speed: Number,
  image: String
});

const timelineSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String
});  

const pokemonModel = mongoose.model("pokemons", pokemonSchema);
const timelineModel = mongoose.model("timelines", timelineSchema);       

app.get('/timeline/getAllEvents', function(req, res) {
    timelineModel.find({}, function(err, timelineData){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send(timelineData);
    });
  })
// add JSON objects(instances) to the collection in mongo database
// for html forms use post request, for others use put
app.put('/timeline/insert', function(req, res) {
    timelineModel.create({
        'text': req.body.text,
        'hits': req.body.hits,
        'time': req.body.time
    }, function(err, timelineData){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send(timelineData);
    });
  })

app.get('/timeline/delete/:id', function(req, res) {
    timelineModel.deleteOne({
        '_id': req.params.id
    }, function(err, timelineData){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send(`Timeline Data of ID ${req.params.id} deleted!`);
    });
  })

app.get('/timeline/deleteAllEvents', function(req, res) {
    timelineModel.deleteMany({}, function(err, timelineData){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send('All timeline events has been deleted from the database');
    });
  })
  
app.get('/timeline/incrementHits/:id', function(req, res) {
    timelineModel.updateOne({
        '_id': req.params.id
    }, {
        $inc: {'hits': 1}
    }, function(err, timelineData) {
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send(`Increment hit of ID ${req.params.id} by 1!`);
    });
  })

// load the pokemons from Mongo Atlas on the index.html page
app.get('/pokemons', function (req, res) {
  pokemonModel.find({},
    function (err, pokemons) {
      if (err) {
        console.log(err);
      } else {
        console.log("Data" + pokemons);
      }
      res.json(pokemons);
    })
})
// filter pokemon by type
app.get('/pokemons/:type', function (req, res) {
  pokemonModel.find({
    'type': req.params.type
  },
    function (err, pokemons) {
      if (err) {
        console.log(err);
      } else {
        console.log("Data" + pokemons);
      }
      res.json(pokemons);
    })
})
// filter pokemon by region
app.get('/filter/:region', function (req, res) {
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
  let startID = regionalID[`${req.params.region}`][0];
  let endID = regionalID[`${req.params.region}`][1];
  pokemonModel.find({
    'id': { $gte :  startID, $lte : endID}
  },
    function (err, pokemons) {
      if (err) {
        console.log(err);
      } else {
        console.log("Data" + pokemons);
      }
      res.json(pokemons);
    })
})
// search pokemon by name
app.get('/search/:name', function (req, res) {
  pokemonModel.find({
    'name': req.params.name
  },
    function (err, pokemons) {
      if (err) {
        console.log(err);
      } else {
        console.log("Data" + pokemons);
      }
      res.json(pokemons);
    })
})
// render my pokemon collection on mongoDB Atlas to the ejs profile page
app.get('/profile/:id', function (req, res) {    
  pokemonModel.find(
    {
      id: req.params.id 
    },
    function (err, pokemons) {
      let pokemon = pokemons[0];
      if (err) {
        console.log(err);
      } else {
        console.log("Data" + pokemons);
      }
      res.render("profile.ejs", {  
        "id": pokemon.id,
        "name": pokemon.name,
        "hp": pokemon.hp,
        "attack": pokemon.attack,        
        "defense": pokemon.defense,        
        "spAttack": pokemon.spAttack,        
        "spDefense": pokemon.spDefense,        
        "speed": pokemon.speed,
        "image": pokemon.image
      }) 
    }
  )
})

// res.send()一般用一次， res.write()会把string concatenate, 可以连用好多个

// sendFile 和res.render一样也可以send整个page to client, 但是sendFile只能send一个static page
// app.get('/', function(req, res){
//     res.sendFile(__dirname + "/index.html");
// })

