import express from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/items", router);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
