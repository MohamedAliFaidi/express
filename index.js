const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const routes = require("./API/routes/routes");
const path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.setup();
    this.routes();
    this.listen();
  }

  setup() {
    dotenv.config();

    // Helmet middleware for security
  
    
    const cors = require('cors')
    this.app.use(cors({
      origin:"origins",
      credentials:true
    }))

    // Compression middleware
    this.app.use(compression());

    // Body parser middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(cookieParser());

    // Connect to MongoDB
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("mongodb connected"))
      .catch(() => console.log("error connecting to the database"));
  }

  routes() {
    // API routes
    this.app.use("/api", routes);

    // Static files

    if (process.env.NODE_ENV == "production") {
      this.app.use(express.static(path.join(__dirname, "./dist")));
      this.app.get("*", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "./dist", "index.html"));
      });
    } else {
      this.app.use(express.static(path.join(__dirname, "dist")));
      this.app.get("*", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "dist", "index.html"));
      });
    }
  }

  listen() {
    // Start the server
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

// Create an instance of the Server class
new Server();


