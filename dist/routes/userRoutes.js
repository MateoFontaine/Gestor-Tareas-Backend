"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ message: "GET / funciona" });
});
router.get("/test", (req, res) => {
    res.json({ message: "GET /test funciona" });
});
router.get("/:id", (req, res) => {
    res.json({
        message: "GET /:id funciona",
        id: req.params.id
    });
});
exports.default = router;
