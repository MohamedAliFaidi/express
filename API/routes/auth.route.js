const express = require("express");
const AuthController = require("../controllers/auth.controller");

class AuthRouter {
  static #router = express.Router();

  static #initializeRoutes() {
    this.#router.post("/register", AuthController.register);
    this.#router.post("/register-code", AuthController.verifyCode);
    this.#router.post("/send-email", AuthController.sendEmail);
    this.#router.post("/login", AuthController.login);
    this.#router.get("/oauth", AuthController.oauth);
    this.#router.get("/logout", AuthController.logout);
  }

  static getRouter() {
    this.#initializeRoutes();
    return this.#router;
  }
}

module.exports = AuthRouter.getRouter();
