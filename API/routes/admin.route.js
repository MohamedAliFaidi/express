const express = require("express");
const AdminController = require("../controllers/admin.controller");

class AdminRouter {
  static #router = express.Router();

  static #initializeRoutes() {
    this.#router.get("/isadmin", AdminController.checkAdmin);
    this.#router.get("/admintest", AdminController.testAdmin);
  }

  static getRouter() {
    this.#initializeRoutes();
    return this.#router;
  }
}

module.exports = AdminRouter.getRouter();
