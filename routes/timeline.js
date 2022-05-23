const router = require("express").Router();
const Timeline = require("../models/Timeline");
const {verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

// GET ALL TIMELINE EVENTS

router.get('/getAllEvents', function(req, res) {
  Timeline.find({}, function(err, timelineData){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data " + timelineData);
      }
      res.send(timelineData);
  });
})

// INSERT A NEW EVENT 

router.put('/insert', function(req, res) {
  Timeline.create({
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

// UPDATE AN EVENT

router.put('/incrementHits/:id', function(req, res) {
  Timeline.updateOne({
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

// DELETE A SINGLE EVENT

router.delete('/delete/:id', function(req, res) {
  Timeline.deleteOne({
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

// CLEAR ALL EVENTS

router.delete('/deleteAllEvents', function(req, res) {
  Timeline.deleteMany({}, function(err, timelineData){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data " + timelineData);
      }
      res.send('All timeline events has been deleted from the database');
  });
})
  
module.exports = router;