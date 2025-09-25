import { Router } from "express";

const router = Router();

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

export default router;