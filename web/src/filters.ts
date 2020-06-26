import {
  FilterObject,
  FilterFunctions,
  ColorRGB,
  ColorHSL,
  ColorHSV,
  DefaultFilterObjects,
  Curve,
} from "./types";

const getPixelsFromCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error(`no canvas context`);
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const setPixelsToCanvas = (pixelData: ImageData, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error(`No canvas context`);
  }
  ctx.putImageData(pixelData, 0, 0);
};

export const applyFilters = (
  filters: FilterObject[],
  canvas: HTMLCanvasElement
) => {
  let pixels = getPixelsFromCanvas(canvas);
  filters.forEach(({ hidden, name, args }) => {
    if (hidden) {
      return;
    }
    // @ts-ignore
    pixels = Filters[name](pixels, args);
  });
  setPixelsToCanvas(pixels, canvas);
};

// color functions
export const RGBtoHSL: (rgb: ColorRGB) => ColorHSL = ({ r, g, b }) => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const max = R > G ? (R > B ? R : G > B ? G : B) : G > B ? G : B;
  const min = R < G ? (R < B ? R : G < B ? G : B) : G < B ? G : B;
  const chroma = max - min;

  const l = (max + min) / 2;
  let h, s;
  if (chroma === 0) {
    h = 0;
    s = 0;
  } else {
    s = chroma / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case R:
        h = (G - B) / chroma;
        break;
      case G:
        h = (B - R) / chroma + 2;
        break;
      case B:
        h = (R - G) / chroma + 4;
        break;
      default:
        h = 0;
    }
  }
  h *= 60;
  if (h < 0) {
    h = 360 + h;
  }

  return { h, s, l };
};
export const HSLtoRGB: (hsl: ColorHSL) => ColorRGB = ({ h, s, l }) => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  let R, G, B;
  if (h < 60) {
    R = chroma;
    G = x;
    B = 0;
  } else if (h < 120) {
    R = x;
    G = chroma;
    B = 0;
  } else if (h < 180) {
    R = 0;
    G = chroma;
    B = x;
  } else if (h < 240) {
    R = 0;
    G = x;
    B = chroma;
  } else if (h < 300) {
    R = x;
    G = 0;
    B = chroma;
  } else if (h < 360) {
    R = chroma;
    G = 0;
    B = x;
  } else {
    R = 0;
    G = 0;
    B = 0;
  }

  const r = (R + m) * 255;
  const g = (G + m) * 255;
  const b = (B + m) * 255;
  return { r, g, b };
};

export const RGBtoHSV: (rgb: ColorRGB) => ColorHSV = ({ r, g, b }) => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const max = R > G ? (R > B ? R : G > B ? G : B) : G > B ? G : B;
  const min = R < G ? (R < B ? R : G < B ? G : B) : G < B ? G : B;
  const chroma = max - min;

  const v = max;
  let h, s;
  if (chroma === 0) {
    h = 0;
    s = 0;
  } else {
    s = chroma / v;
    switch (max) {
      case R:
        h = (G - B) / chroma;
        break;
      case G:
        h = (B - R) / chroma + 2;
        break;
      case B:
        h = (R - G) / chroma + 4;
        break;
      default:
        h = 0;
    }
  }
  h *= 60;
  if (h < 0) {
    h = 360 + h;
  }

  return { h, s, v };
};
export const HSVtoRGB: (hsb: ColorHSV) => ColorRGB = ({ h, s, v }) => {
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - chroma;
  let R, G, B;
  if (h < 60) {
    R = chroma;
    G = x;
    B = 0;
  } else if (h < 120) {
    R = x;
    G = chroma;
    B = 0;
  } else if (h < 180) {
    R = 0;
    G = chroma;
    B = x;
  } else if (h < 240) {
    R = 0;
    G = x;
    B = chroma;
  } else if (h < 300) {
    R = x;
    G = 0;
    B = chroma;
  } else if (h < 360) {
    R = chroma;
    G = 0;
    B = x;
  } else {
    R = 0;
    G = 0;
    B = 0;
  }

  const r = (R + m) * 255;
  const g = (G + m) * 255;
  const b = (B + m) * 255;
  return { r, g, b };
};

const getSecondDerivative = (curve: Curve) => {
  const matrix = Array(curve.length)
    .fill(undefined)
    .map(() =>
      Array(3)
        .fill(undefined)
        .map(() => 0)
    );
  const result = Array(curve.length).fill(0);

  matrix[0][1] = 1;
  for (let i = 1; i < curve.length - 1; i++) {
    matrix[i][0] = (curve[i].x - curve[i - 1].x) / 6;
    matrix[i][1] = (curve[i + 1].x - curve[i - 1].x) / 3;
    matrix[i][2] = (curve[i + 1].x - curve[i].x) / 6;
    result[i] =
      (curve[i + 1].y - curve[i].y) / (curve[i + 1].x - curve[i].x) -
      (curve[i].y - curve[i - 1].y) / (curve[i].x - curve[i - 1].x);
  }
  matrix[curve.length - 1][1] = 1;

  for (let i = 1; i < curve.length; i++) {
    const k = matrix[i][0] / matrix[i - 1][1];
    matrix[i][1] -= k * matrix[i - 1][2];
    matrix[i][0] = 0;
    result[i] -= k * result[i - 1];
  }
  for (let i = curve.length - 2; i >= 0; i--) {
    const k = matrix[i][2] / matrix[i + 1][1];
    matrix[i][1] -= k * matrix[i + 1][0];
    matrix[i][2] = 0;
    result[i] -= k * result[i + 1];
  }

  return result.map((value, index) => value / matrix[index][1]);
};

const getCurveFunction = (curve: Curve) => {
  const secondDerivative = getSecondDerivative(curve);
  return (x: number) => {
    let i = 0;
    for (i = 0; i < curve.length - 1; i++) {
      if (x >= curve[i].x) {
        break;
      }
    }
    const currentPoint = curve[i];
    const nextPoint = curve[i + 1];

    const h = nextPoint.x - currentPoint.x;
    const b = (x - currentPoint.x) / h;
    const a = 1 - b;

    const y =
      a * currentPoint.y +
      b * nextPoint.y +
      ((h * h) / 6) *
        ((a * a * a - a) * secondDerivative[i] +
          (b * b * b - b) * secondDerivative[i + 1]);
    return y;
  };
};

export const defaultFilterObjects: DefaultFilterObjects = {
  grayscale: {},
  invert: {},
  sepia: {},
  tint: { args: { hue: 0, positiveIntensity: 80 } },
  brightness: { args: { intensity: 20 } },
  temperature: { args: { intensity: 20 } },
  redCurve: {
    args: {
      curve: [
        { x: 0, y: 0 },
        { x: 68, y: 50 },
        { x: 188, y: 200 },
        { x: 255, y: 255 },
      ],
    },
  },
};

const Filters: FilterFunctions = {
  grayscale: (pixelData) => {
    const pixels = pixelData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      //const a = pixels[i + 3];

      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
    }
    return pixelData;
  },
  invert: (pixelData) => {
    const pixels = pixelData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      pixels[i] = 255 - r;
      pixels[i + 1] = 255 - g;
      pixels[i + 2] = 255 - b;
    }
    return pixelData;
  },
  sepia: (pixelData) => {
    const pixels = pixelData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      //const a = pixels[i + 3];

      pixels[i] = 0.393 * r + 0.769 * g + 0.189 * b;
      pixels[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
      pixels[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
    }
    return pixelData;
  },
  tint: (pixelData, { hue, positiveIntensity }) => {
    const pixels = pixelData.data;
    const tintMultiplier = positiveIntensity / 100;
    const originalMultiplier = 1 - tintMultiplier;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      //const a = pixels[i + 3];
      const { s, l } = RGBtoHSL({ r, g, b });

      const { r: newR, g: newG, b: newB } = HSLtoRGB({ h: hue, s, l });

      pixels[i] = newR * tintMultiplier + r * originalMultiplier;
      pixels[i + 1] = newG * tintMultiplier + g * originalMultiplier;
      pixels[i + 2] = newB * tintMultiplier + b * originalMultiplier;
    }

    return pixelData;
  },
  brightness: (pixelData, { intensity }) => {
    const pixels = pixelData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      //const a = pixels[i + 3];
      const { h, s, l: oldL } = RGBtoHSL({ r, g, b });

      let l = oldL + intensity / 100;
      if (l > 1) {
        l = 1;
      } else if (l < 0) {
        l = 0;
      }
      const { r: newR, g: newG, b: newB } = HSLtoRGB({
        h,
        s,
        l,
      });

      pixels[i] = newR;
      pixels[i + 1] = newG;
      pixels[i + 2] = newB;
    }

    return pixelData;
  },
  temperature: (pixelData, { intensity }) => {
    const pixels = pixelData.data;
    const strength = intensity * 0.5;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      pixels[i] = r + strength;
      pixels[i + 1] = g;
      pixels[i + 2] = b - strength;
    }

    return pixelData;
  },
  redCurve: (pixelData, { curve }) => {
    const curveFunction = getCurveFunction(curve);
    const pixels = pixelData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      pixels[i] = curveFunction(r);
      pixels[i + 1] = curveFunction(g);
      pixels[i + 2] = curveFunction(b);
    }

    return pixelData;
  },
};
