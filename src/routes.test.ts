process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../dist/server");
//import { app } from "./app";
let db = require("./fakeDb");
const mud = { name: "Mud", price: 2.5 };
const clouds = { name: "Clouds", price: 400 };

beforeEach(async () => {
  //db.push(mud);
  await request(app).post("/items").send(mud);
  /* For some reason this works, but just pushing to db doesn't */
});

afterEach(() => {
  db.length = 0;
});

describe("GET /items", () => {
  test("Get a list of items", async () => {
    db.push(mud);
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mud]);
  });
});

describe("POST /items", () => {
  test("Post an item", async () => {
    const res = await request(app).post("/items").send(clouds);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: clouds });
  });
});

describe("GET /items/:name", () => {
  test("Get a specific item", async () => {
    const res = await request(app).get("/items/Mud");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: mud });
  });

  test("Return 404 if item not found", async () => {
    const res = await request(app).get("/items/graphite");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item 'graphite' not found" });
  });
});

describe("PATCH /items/:name", () => {
  test("Edit an item", async () => {
    const res = await request(app).patch("/items/Mud").send({ price: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.edited.price).toEqual(4);
  });
});

describe("DELETE /items/:name", () => {
  test("Edit an item", async () => {
    const res = await request(app).delete("/items/Mud");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ deleted: mud });
    expect(items.length).toEqual(0);
  });
});
