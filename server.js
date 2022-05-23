const express = require("express");
// var session = require("express-session")
// const res = require("express/lib/response");
const app = express();      
const bodyparser = require("body-parser");
const https = require('https');       
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const timelineRoute = require('./routes/timeline');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.use(bodyparser.urlencoded({
  extended: true
}));

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// { useNewUrlParser: true, useUnifiedTopology: true }
// const timelineModel = mongoose.model("timelines", timelineSchema);       

app.listen(process.env.PORT || 5000, function (err) { 
  if(err) console.log(err);
})  

app.use(express.json());
// app.use('/timeline', timelineRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/timeline', timelineRoute);


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