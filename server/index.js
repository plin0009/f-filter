import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(express.json());

app.post("/new", (req, res) => {
  console.log(req.body);
  res.json({});
});

app.get("/:id", (req, res) => {
  console.log(req.params.id);
  res.json({});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
