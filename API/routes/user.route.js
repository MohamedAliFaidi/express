const express = require("express");
const UserController = require("../controllers/user.controller");

class UserRouter {
  static #router = express.Router();

  static #initializeRoutes() {
    this.#router.get("/check", UserController.check);
    this.#router.post("/update/:id", UserController.updateUser);
  }

  static getRouter() {
    this.#initializeRoutes();
    return this.#router;
  }
}

module.exports = UserRouter.getRouter();
