const mongoose = require("mongoose");

class User {
  static #schema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    avatar: {
      url: String,
      public_id: String,
    },
  });

  static getModel() {
    return mongoose.model("User", this.#schema);
  }
}

module.exports = User.getModel();
