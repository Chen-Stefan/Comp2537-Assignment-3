const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// UPDATE

router.put("/:id", verifyTokenAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been sucessfully deleted')
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER 

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findById(req.params.id);
    const {password, ...others} = user._doc;
    res.status(200).json({others});
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;

// GET ALL USERS