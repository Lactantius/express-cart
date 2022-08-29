process.env.NODE_ENV = "test";

//import * as request from "supertest";
const request = require("supertest")
const app = require("../dist/index")
