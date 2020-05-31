import express from "express";
import mongoose from "mongoose";
// import { connectionString } from "./config";
import { Filter } from "./models";
import { generateCode } from "./CodeGenerator";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.post("/new", async (req, res) => {
  console.log(req.body);
  const filter = new Filter({
    code: generateCode(),
    filterObjects: req.body.filterObjects,
  });
  await filter.save();
  res.json(filter);
});

app.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const filter = await Filter.findOne({ code: req.params.id });
  if (filter === null) {
    return res.json(null);
  }
  return res.json(filter);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

(async () => {
  const connectionString =
    process.env.NODE_ENV === "production"
      ? process.env.CONNECTION_STRING
      : await import("./config").then(
          ({ connectionString }) => connectionString
        );

  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
