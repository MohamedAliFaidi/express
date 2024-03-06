const jwt = require("jsonwebtoken");

class Middleware {
  static #verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }

  static async checkAdmin(req, res, next) {
    try {
      const token = req.headers.cookie.split("=")[1];
      const decoded = Middleware.#verifyToken(token);
      if (decoded && decoded["role"] !== "admin") {
        return res
          .status(401)
          .json({ message: "Action reserved for admin only" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
    next();
  }

  static async checkAuth(req, res, next) {
    try {
      
  // add more verification 
      if (!req.headers.cookie) {
        return res
          .status(401)
          .json({ message: "Unauthorized access detected" });
      }
      const token = req.headers.cookie.split("=")[1];
      const decoded = Middleware.#verifyToken(token);
      if (decoded && decoded.exp < Date.now()) {
        res.clearCookie("Authorization");
        return res
          .status(400)
          .json({
            isAuth: false,
            message: "Session expired, please log in again",
          });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = Middleware;
