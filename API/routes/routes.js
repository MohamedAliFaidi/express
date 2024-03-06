    const express = require('express');
    const authRoutes = require('./auth.route');
    const userRoute = require('./user.route');
    const adminRoute = require('./admin.route');
    const Middleware = require('../middleware');

    class Routes  {
    static #router = express.Router();

    static #setupRoutes() {
        this.#router.use('/auth', authRoutes);
        this.#router.use('/user', Middleware.checkAuth, userRoute);
        this.#router.use('/admin', Middleware.checkAuth, Middleware.checkAdmin, adminRoute);
    }

    static getRouter() {
        this.#setupRoutes();
        return this.#router;
    }
    }

    module.exports = Routes.getRouter();
