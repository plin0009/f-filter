export type FilterObject<
  T = {
    [K in keyof FilterAlgorithms]: {
      name: K;
      args?: FilterAlgorithms[K];
      visible?: boolean;
    };
  }
> = T[keyof T];

type FilterFunctions<
  T = {
    [K in keyof FilterAlgorithms]: (
      pixelData: ImageData,
      args?: FilterAlgorithms[K]
    ) => ImageData;
  }
> = T;

interface FilterAlgorithms {
  grayscale: {};
  sepia: {};
  //tint: { color: string };
}

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
  filters.forEach((filter) => {
    pixels = Filters[filter.name](pixels, filter.args);
  });

  setPixelsToCanvas(pixels, canvas);
};

export const createFilter = ({
  name,
  args = {},
  visible = true,
}: FilterObject) => ({ name, args, visible });

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
  sepia: (pixeldata) => {
    const pixels = pixeldata.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      //const a = pixels[i + 3];

      pixels[i] = 0.393 * r + 0.769 * g + 0.189 * b;
      pixels[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
      pixels[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
    }
    return pixeldata;
  },
};
