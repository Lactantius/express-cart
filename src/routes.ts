import { Router } from "express";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/lib/function";
import { Item } from "./types";

const items: Item[] = require("./fakeDb");

const router = Router();

/*
 * Routes
 */

router.get("/", (req, res) => {
  return res.json(items);
});

router.post("/", (req, res) => {
  const response: ErrorResponse | SuccessResponse = pipe(
    req.body,
    isInstanceOfItem,
    E.chain(addItem),
    E.foldW(identity, identity)
  );
  res.statusCode = response.statusCode; /* Mutate state. Why not? */
  return res.json(response.body);
});

router.get("/:name", (req, res) => {
  const item = items.find(
    (elem) => elem.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (item) {
    return res.json({ item: item });
  } else {
    res.statusCode = 404;
    return res.json({ error: `Item '${req.params.name}' not found` });
  }
});

// router.patch("/:name", (req, res) => { });

/*
 * Helpers
 */

function addItem(item: Item): E.Either<ErrorResponse, SuccessResponse> {
  return pipe(
    E.tryCatch(
      () => items.push(item),
      (err) => makeError(`Item ${item} could not be added`, 500)
    ),
    E.map(
      () =>
      ({
        body: {
          added: item,
        },
        statusCode: 201,
      } as SuccessResponse)
    )
  );
}

/* Is there a DRYer way to check if something matches an interface? */
function isInstanceOfItem(obj: object): E.Either<ErrorResponse, Item> {
  const props = ["name", "price"];
  const isItem = typeof obj === "object" && props.every((prop) => prop in obj);
  return isItem
    ? E.right(obj as Item)
    : E.left(makeError("Not a valid item", 400));
}

function makeError(msg: string, code: number): ErrorResponse {
  return { body: { error: msg }, statusCode: code };
}

/*
 * Interfaces
 */

interface ErrorResponse {
  body: {
    error: string;
  };
  statusCode: number;
}

interface SuccessResponse {
  body: {
    [index: string]: Item;
  };
  statusCode: number;
}

export { router };
