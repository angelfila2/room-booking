import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/bookingEnhancedController.js";

const router = express.Router();

// READ
router.get("/", getAll);
router.get("/:id", getById);

// CREATE
router.post("/", create);

// UPDATE
router.put("/:id", update);

// DELETE
router.delete("/:id", remove);

export default router;
