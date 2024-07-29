const verifyUser = (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Prijavite se ponovno." });
    }
    req.userId = req.session.user.id;
    req.userRole = req.session.user.role;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Greška u serveru prilikom provjere autentičnosti." });
  }
};
module.exports = verifyUser;
