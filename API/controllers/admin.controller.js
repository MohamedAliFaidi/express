class AdminController {
  static async testAdmin(req, res) {
    try {
      res.status(200).json({
        message: "you reached the backend admin route",
      });
    } catch (error) {
      console.log(error, "in controller");
      res.status(500).json({
        message: "error",
      });
    }
  }

  static async checkAdmin(req, res) {
    try {
      res.status(200).json({ message: "admin role exists" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  }
}

module.exports = AdminController;
