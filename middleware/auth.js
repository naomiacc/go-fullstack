// Nous allons à présent créer le middleware qui va vérifier que l’utilisateur est bien connecté
// et transmettre les informations de connexion aux différentes méthodes qui vont gérer les requêtes.

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("authentification", req);
  try {
    // Nous utilisons donc la fonction split pour tout récupérer après l'espace dans le header
    const token = req.headers.authorization.split(" ")[1];
    // Nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
