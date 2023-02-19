const router = require("./index");
const User = require("../models/user");

router.get('/profile/:id',async(req,res) => {
    console.log(req.params.id)
    const id = req.params.id
    const user = await User.findById(id)
    if(!user){
        console.log('err')
    }
    console.log(user.score.reverse_engineer)
    res.render('hackerboard.ejs',{data:{score: user.score, solved: user.solved}})
})

module.exports = router