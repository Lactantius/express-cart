import { Router } from "express";
import { items } from "./fakeDb";

const router = Router();

router.get("/", (req, res) => {
  return res.json(items);
});

router.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json(body);
});

export { router };
