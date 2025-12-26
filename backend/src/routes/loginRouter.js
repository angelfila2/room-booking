import express from "express";
import loginService from "../services/loginService.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json("works");
});

router.post("/", async (request, res) => {
  const { username, password } = request.body;

  const result = await loginService.login({ username, password });

  if (!result) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  res.status(200).json(result);
});

export default router;
