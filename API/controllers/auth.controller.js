const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Prom = require("../models/prom.model");
const Mailer = require("../utils/nodemailer");
class UserController {

  static async verifyCode(req, res) {
    try {
      const prom = await Prom.findOne({ code: req.body.code });
      if (!prom) {
        return res.status(400).json({ message: "invalid verification link" });
      }
      const isUser = await User.findOne({ email: prom.email });
      if (isUser) {
        return res.status(400).json({ message: "user already exist" });
      }
      res.status(200).json(prom);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async sendEmail(req, res) {
    try {
      const isUser = await User.findOne({ email: req.body.email });
      if (isUser) {
        return res.status(400).json({ message: "user already exist" });
      }
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      Mailer.sendEmail(
        req.body.email,
        "Email verification",
        `
      <p>Hello there!</p>
      <p>Your verification code is: <strong>${result}</strong></p>
      <p>Click the button below to verify your email:</p>
      <a href="http://localhost:5173/register?code=${result}">Production test</a>
      <a href="http://localhost:5173/register?code=${result}">dev link</a>
      <a href="http://localhost:3000/register?code=${result}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
    `
      );
      const prom = await Prom.create({
        email: req.body.email,
        name: req.body.username,
        code: result,
      });
      res.status(201).json(prom);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error" });
    }
  }
  static async register(req, res) {
    try {
      const isUser = await User.findOne({ email: req.body.email });
      if (isUser) {
        return res.status(400).json({ message: "user already exist" });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      const deleteProm = await Prom.deleteMany({ email: req.body.email });
      console.log(deleteProm);
      res.status(201).json({ message: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error" });
    }
  }

  static async login(req, res) {
    try {
      const isUser = await User.findOne({ email: req.body.email });
      if (!isUser) {
        return res.status(400).json({ message: "user not found" });
      }
      const match = await bcrypt.compare(req.body.password, isUser.password);
      if (!match) {
        return res.status(401).json({ message: "wrong password" });
      }
      const exp = Date.now() + 1000 * 60 * 60;
      const token = jwt.sign(
        { id: isUser._id, exp, role: isUser.role },
        process.env.SECRET_KEY
      );
      console.log(isUser);
      res
        .cookie("Authorization", token)
        .status(200)
        .json({
          user: {
            email: isUser.email,
            username: isUser.username,
            _id: isUser._id,
            role: isUser.role,
            avatar: isUser.avatar || null,
          },
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error" });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("Authorization");
      res.status(200).json({ message: "logged out" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error" });
    }
  }

    static async oauth(req, res) {
      try {
        const {google} = require('googleapis');

        /**
         * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
         * from the client_secret.json file. To get these credentials for your application, visit
         * https://console.cloud.google.com/apis/credentials.
         */
        const oauth2Client = new google.auth.OAuth2(
         process.env.GOOGLE_ID,
         process.env.GOOGLE_SECRET,
         process.env.GOOGLE_REDIRECT
        );
        
        // Access scopes for read-only Drive activity.
        const scopes = [
          "https://www.googleapis.com/auth/userinfo.profile"
        ];
        
        // Generate a url that asks permissions for the Drive activity scope
        const authorizationUrl = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          /** Pass in the scopes array defined above.
            * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
          scope: scopes,
          // Enable incremental authorization. Recommended as a best practice.
          include_granted_scopes: true
        });
        res.status(200).json({ authorizationUrl });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error" });
      }
    }
  }

module.exports = UserController;
