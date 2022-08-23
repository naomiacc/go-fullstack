const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../controllers/stuff");

router.get("/", auth, stuffCtrl.getAllStuff);

// Express met à disposition le  body  des requêtes interceptées directement sur l'objet req
// Enregistrement des Things dans la base de données
router.post("/", auth, multer, stuffCtrl.createThing);

// Récupération d'un Thing spécifique
router.get("/:id", auth, stuffCtrl.getOneThing);

// pour mettre à jour un thing existant = modification d'un objet
router.put("/:id", auth, multer, stuffCtrl.modifyThing);

// pour supprimer un objet
router.delete("/:id", auth, stuffCtrl.deleteThing);

// Désormais, nous pouvons implémenter notre route GET afin qu'elle renvoie tous les Things dans la base de données
// nous utilisons la méthode find afin de renvoyer un tableau contenant tous les Things dans notre base de données.
router.get("/", auth, stuffCtrl.getAllThings);

module.exports = router;
