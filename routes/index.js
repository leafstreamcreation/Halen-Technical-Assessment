const router = require("express").Router();

const authRoutes = require("./auth.routes");

router.get("/", (req, res, next) => {
    res.status(200).send("Contact");
});

router.use("/auth", authRoutes);

module.exports = router;