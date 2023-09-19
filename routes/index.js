import express from "express";
const router = express.Router()

router.get("/", (req,res) => {
    if(req.session.message) {
        res.locals.message = req.session.message
        req.session.message = undefined
    }
    res.render("index")
})

export default router  