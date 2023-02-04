const router = require("./index");
const User = require("../models/user");

router.get('/profile',(req,res) => {
    res.json(User)
})

module.exports = router