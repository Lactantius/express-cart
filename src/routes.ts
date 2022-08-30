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
    E.chain(makeResponse(201)("added")),
    E.foldW(identity, identity)
  );
  res.statusCode = response.statusCode; /* Mutate state. Why not? */
  return res.json(response.body);
});

router.get("/:name", (req, res) => {
  const response = pipe(
    req.params.name,
    findItem,
    E.chain(makeResponse(200)("item")),
    E.foldW(identity, identity)
  );
  res.statusCode = response.statusCode;
  return res.json(response.body);
});

router.patch("/:name", (req, res) => {
  const item = findItem(req.params.name);
  const response = pipe(
    req.body,
    isInstanceOfItemEdit,
    E.chain(editItem(item)) /* What is the best way of handling this? */,
    E.chain(makeResponse(200)("edited")),
    E.foldW(identity, identity)
  );
  res.statusCode = response.statusCode;
  return res.json(response.body);
});

router.delete("/:name", (req, res) => {
  const response = pipe(
    req.params.name,
    findItem,
    E.chain(deleteItem),
    E.chain(makeResponse(200)("deleted")),
    E.foldW(identity, identity)
  );
  res.statusCode = response.statusCode;
  return res.json(response.body);
});

/*
 * Helpers
 */

const makeResponse: (
  code: number
) => (
    msg: string
  ) => (item: Item) => E.Either<ErrorResponse, SuccessResponse> =
  (code) => (msg) => (item) =>
    E.right({ body: { [msg]: item }, statusCode: code });

function findItem(name: string): E.Either<ErrorResponse, Item> {
  const item = items.find(
    (elem) => elem.name.toLowerCase() === name.toLowerCase()
  );
  return item
    ? E.right(item)
    : E.left(makeError(`Item '${name}' not found`, 404));
}

const editItem: (
  item: Item
) => (edits: ItemEdit) => E.Either<ErrorResponse, Item> = (item) => (edits) =>
  E.right(Object.assign(item, edits));

function addItem(item: Item): E.Either<ErrorResponse, Item> {
  return pipe(
    E.tryCatch(
      () => items.push(item),
      (err) => makeError(`Item ${item} could not be added`, 500)
    ),
    E.map(() => item)
  );
}

function deleteItem(item: Item): E.Either<ErrorResponse, Item> {
  const index = items.indexOf(item);
  return pipe(
    E.tryCatch(
      () => items.splice(index, 1),
      (err) => makeError(`Item ${item} could be be deleted`, 500)
    ),
    E.map(() => item)
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

function isInstanceOfItemEdit(obj: object): E.Either<ErrorResponse, ItemEdit> {
  const props = ["name", "price"];
  const isEdit = typeof obj === "object" && props.some((prop) => prop in obj);
  return isEdit
    ? E.right(obj as Item)
    : E.left(makeError("Not a valid edit", 400));
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

interface ItemEdit {
  name?: string;
  price?: number;
}

export { router };
