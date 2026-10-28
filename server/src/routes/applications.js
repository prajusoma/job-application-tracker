import { Router } from "express";
import Application from "../models/Application.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", status = "" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ];
    }

    if (status) filter.status = status;

    res.json(await Application.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await Application.create(req.body));
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const item = await Application.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Application not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Application.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Application not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
