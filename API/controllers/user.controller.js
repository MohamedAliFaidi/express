const dotenv = require("dotenv");
const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;

class UserController {
  static check(req, res) {
    try {
      res.status(200).json({
        message: "user role exists",
      });
    } catch (error) {
      console.log(error);
      res.clearCookie("Authorization");
      res.status(500).json({ error: error });
    }
  }

  static async #destroyOldAvatar  (publicId)  {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(result);
      });
    });
  };

  static async updateUser(req, res) {
    try {
      console.log(req.params,req.query)
      dotenv.config();
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
        secure: true,
      });

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          req.body.data,
          { folder: "avatars", resource_type: "auto" },
          function (error, result) {
            if (error) {
              console.log(error);
              reject(error);
            }
            resolve(result);
          }
        );
      });

      await User.findByIdAndUpdate(req.params.id, {
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      })

      res.status(200).json({ message: "updated with success",avatar : result});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error while uploading your file" });
    }
  }
}

module.exports = UserController;
