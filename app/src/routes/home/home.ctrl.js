"use strict";

const User = require("../../models/User")

const output = {

    home: (req, res) => {
        res.render("home/index");
    },

    board: (req, res) => {
        res.render("home/board");
    },

    login: (req, res) => {
        res.render("home/login");
    },

    register: (req, res) => {
        res.render("home/register");
    },
};

const process = {
    login: async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();

        const url = {
            method: "POST",
            path: "/login",
            status: response.err ? 400 : 200,
        };

        return res.json(response);
    },
    register: async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();

        const url = {
            method: "POST",
            path: "/register",
            status: response.err ? 409 : 201,
        };

        return res.json(response);
    }
};

module.exports = {
    output,
    process,
};