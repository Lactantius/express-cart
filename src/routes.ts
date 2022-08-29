import { Router } from "express";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/lib/function";
//import { Item } from "./types";

const items = require("./fakeDb");

const router = Router();

router.get("/", (req, res) => {
  return res.json(items);
});

router.post("/", (req, res) => {
  const item = pipe(
    req.body,
    isInstanceOfItem,
    E.chain(addItem),
    E.foldW(makeError, identity)
  );
  return res.json(item);
});

function addItem(item: Item): E.Either<string, SuccessResponse> {
  return pipe(
    E.tryCatch(
      () => items.push(item),
      (err) => `Item ${item} could not be added`
    ),
    E.map(
      () =>
      ({
        added: item,
      } as SuccessResponse)
    )
  );
}

/*
 * Helpers
 */

/* Is there a DRYer way to check if something matches an interface? */
function isInstanceOfItem(obj: object): E.Either<string, Item> {
  const props = ["name", "price"];
  const isItem = typeof obj === "object" && props.every((prop) => prop in obj);
  return isItem ? E.right(obj as Item) : E.left("Not a valid item");
}

const makeError: (msg: string) => ErrorResponse = (msg: string) => ({
  error: msg,
});

/*
 * Interfaces
 */

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  [index: string]: Item;
}

export { router };
