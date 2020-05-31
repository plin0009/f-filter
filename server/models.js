import mongoose, { Schema } from "mongoose";

export const Filter = mongoose.model(
  "Filter",
  new Schema({
    code: { type: String, required: true },
    filterObjects: [
      {
        name: { type: String, required: true },
        args: {
          hue: Number,
          color: {
            r: Number,
            g: Number,
            b: Number,
          },
          positiveIntensity: Number,
          intensity: Number,
        },
        hidden: Boolean,
      },
    ],
  })
);

export const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    codes: [String],
  })
);
