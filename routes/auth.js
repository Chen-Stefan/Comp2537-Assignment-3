const router = require("express").Router();
const bodyparser = require("body-parser");
const User = require('../models/User');
const CryptoJS = require('crypto-js');
// const jwt = require('jsonwebtoken');

// REGISTER            如何查重要想办法弄
router.use(bodyparser.urlencoded({
  extended: true
}));

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
  });
  
  try{
    const savedUser = await newUser.save();
    console.log('Registration successful! User account has been created')
    res.redirect('/');
  } catch (err) {
    res.status(500).json(err);
  }
})

//LOGIN

router.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      console.log('User does not exist, please create a new user');
      res.redirect('/');
    } 
    else {
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (originalPassword != req.body.password) {
          console.log('Password is incorrect, please try again');
        res.redirect('/');

        }  
    }
    
    // const accessToken = jwt.sign(
    //   {
    //   id: user._id, 
    //   isAdmin:  user.isAdmin
    //   },
    //   process.env.JWT_SECRET,
    //   {expiresIn: '30d'}
    // );

    // const {password, ...others} = user._doc;
    // res.status(200).json({...others});
})


module.exports = router;