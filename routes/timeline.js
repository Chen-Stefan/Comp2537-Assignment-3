const router = require("express").Router();
// 创建一个timeline的route, 这样在server.js 里用 app.use 就可以从timeline route 下面分叉出好几个新的功能routes

router.get('/getAllEvents', function(req, res) {
    timelineModel.find({}, function(err, timelineData){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data " + timelineData);
        }
        res.send(timelineData);
    });
  })

router.put('/insert', function(req, res) {
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
  
 
module.exports = router;