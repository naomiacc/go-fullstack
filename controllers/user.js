const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// pour l'enregistrement des utilisateurs
exports.signup = (req, res, next) => {
  console.log("signup", req);
  bcrypt
    .hash(req.body.password, 10) // on hache le mot de passe, on lui passe le mdp du corps de la requete, on hache 10 tours
    .then((hash) => {
      // methode asynchrone avec catch pour récupérer les erreurs
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save() // methode save pour l'enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// pour connecter les utilisateurs existants et vérifier s'ils ont des identifiants valides
exports.login = (req, res, next) => {
  console.log("login", req);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      } else {
        console.log("e");
        bcrypt
          // Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
          .compare(req.body.password, user.password)
          .then((valid) => {
            // S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized avec le même message que lorsque l’utilisateur n’a pas été trouvé, afin de ne pas laisser quelqu’un vérifier si une autre personne est inscrite sur notre site.
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
            } else {
              // S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token.
              res.status(200).json({
                userId: user._id,
                // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h", // durée de chaque token, l'utilisateur devra donc se reconnecter au bout de 24 heures.
                }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    // erreur d'exécution de la base de donnée (et non de champs de saisie)
    .catch((error) => {
      res.status(500).json({ error });
    });
};
