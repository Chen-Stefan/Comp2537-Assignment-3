const express = require("express");
// var session = require("express-session")
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
// process.env.PORT || 
app.listen(5000, function (err) { 
  if(err) console.log(err);
})  

mongoose.connect(  // username   password             database name
  "mongodb+srv://stefan79:chenzehan789@cluster0.s5zqy.mongodb.net/pokemonDB?retryWrites=true&w=majority", 
  { useNewUrlParser: true, useUnifiedTopology: true });

const timelineSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String
});  

const timelineModel = mongoose.model("timelines", timelineSchema);       


app.get('/profile/:id', function (req, res) {   
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  let data = "";
  https.get(url, function(https_res) {
      https_res.on("data", function(chunk) {  
          data += chunk;
      })
      https_res.on("end", function() {
          data = JSON.parse(data);

          let hpArray = data.stats.filter((obj) => {
              return obj.stat.name == "hp"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          let attackArray = data.stats.filter((obj) => {
              return obj.stat.name == "attack"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          let defenseArray = data.stats.filter((obj) => {
              return obj.stat.name == "defense"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          let specialAttackArray = data.stats.filter((obj) => {
              return obj.stat.name == "special-attack"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          let specialDefenseArray = data.stats.filter((obj) => {
              return obj.stat.name == "special-defense"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          let speedArray = data.stats.filter((obj) => {
              return obj.stat.name == "speed"
          }).map((obj_) => {
              return obj_.base_stat     // 这个返回的是一个array
          })

          res.render("profile.ejs", {  
              "id": req.params.id,
              "name": data.name,
              "hp": hpArray[0],
              "attack": attackArray[0],        
              "defense": defenseArray[0],        
              "spAttack": specialAttackArray[0],        
              "spDefense": specialDefenseArray[0],        
              "speed": speedArray[0]       
          })
      })
  })              
})


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