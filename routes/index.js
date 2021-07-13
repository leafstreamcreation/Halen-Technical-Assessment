const router = require("express").Router();

const authRoutes = require("./auth.routes");

router.get("/", (req, res, next) => {
    res.status(200).send("Halen Technical Assessment: User login and confirmation backend is live!");
});

router.use("/auth", authRoutes);

module.exports = router;