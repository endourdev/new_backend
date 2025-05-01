module.exports = (req, res, next) => {
  try {
    const roles = req.auth.roles;

    if (!roles || !roles.includes('admin')) {
      return res.status(403).json({
        message: "Accès interdit : vous devez être administrateur."
      });
    }

    next(); // autorisé, on passe à la suite
  } catch (error) {
    console.error("Erreur dans le middleware checkAdminRole :", error);
    return res.status(500).json({
      message: "Erreur interne lors de la vérification du rôle.",
      error: error.message
    });
  }
};