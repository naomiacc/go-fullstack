//
const express = require("express");
const router = express.Router();

// controleur pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

// création de deux routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
