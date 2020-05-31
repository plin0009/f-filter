import { brighter, dimmer, colors, warmer, colder } from "./grammar";
import { FilterObject } from "./types";
import { RGBtoHSL } from "./filters";

const textToFilter = (text: string) => {
  let args = {};
  const hidden = false;

  if (text.includes("grayscale")) {
    return { name: "grayscale", args, hidden } as FilterObject;
  }
  for (let i = 0; i < brighter.length; i++) {
    const word = brighter[i];
    if (text.includes(word)) {
      args = { intensity: 20 };
      return { name: "brightness", args, hidden } as FilterObject;
    }
  }
  for (let i = 0; i < dimmer.length; i++) {
    const word = dimmer[i];
    if (text.includes(word)) {
      args = { intensity: -20 };
      return { name: "brightness", args, hidden } as FilterObject;
    }
  }

  for (let i = 0; i < warmer.length; i++) {
    const word = warmer[i];
    if (text.includes(word)) {
      args = { intensity: 50 };
      return { name: "temperature", args, hidden } as FilterObject;
    }
  }
  for (let i = 0; i < colder.length; i++) {
    const word = colder[i];
    if (text.includes(word)) {
      args = { intensity: -50 };
      return { name: "temperature", args, hidden } as FilterObject;
    }
  }

  const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
  for (let i = 0; i < colorKeys.length; i++) {
    const color = colorKeys[i];
    if (text.includes(color)) {
      args = { hue: RGBtoHSL(colors[color]).h, positiveIntensity: 80 };
      return { name: "tint", args, hidden } as FilterObject;
    }
  }
  return null;
};

export default textToFilter;
