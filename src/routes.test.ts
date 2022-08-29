process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../dist/server");
//import { app } from "./app";
let db = require("./fakeDb");
const mud = { name: "Mud", price: 2.5 };
const clouds = { name: "Clouds", price: 400 };

beforeEach(() => {
  db.push(mud);
});

afterEach(() => {
  db.length = 0;
});

describe("GET /items", () => {
  test("Get a list of items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mud);
  });
});

describe("POST /items", () => {
  test("Post an item", async () => {
    const res = await request(app).post("/items").send(clouds);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: clouds });
  });
});
