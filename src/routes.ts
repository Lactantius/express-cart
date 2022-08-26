import { Router } from "express";
import { Item } from "./types";
const items = require("./fakeDb");

const router = Router();

router.get("/", (req, res) => {
  return res.json(items);
});

router.post("/", (req, res) => {
  const body: object = req.body;

  if (instanceOfItem(body)) {
    items.push(body);
    return res.json({ added: body });
  } else {
    return res.json({ error: "Not a valid item" });
  }
});

function instanceOfItem(object: any): object is Item {
  const props = ["name", "string"];
  return "name" in object;
}

export { router };
