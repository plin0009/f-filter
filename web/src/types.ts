export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

//export type ColorHue = number;

export type FilterObjectInitialized<
  T = {
    [K in keyof FilterAlgorithms]: {
      name: K;
      args?: FilterAlgorithms[K];
      hidden?: boolean;
    };
  }
> = T[keyof T];

export type FilterObject<
  T = {
    [K in keyof FilterAlgorithms]: {
      name: K;
      args: FilterAlgorithms[K];
      hidden: boolean;
    };
  }
> = T[keyof T];

export type FilterFunctions<
  T = {
    [K in keyof FilterAlgorithms]: (
      pixelData: ImageData,
      args: FilterAlgorithms[K]
    ) => ImageData;
  }
> = T;

type Override<T> = Pick<DFA, Exclude<keyof DFA, keyof T>> & T;
interface DFA {
  hue?: undefined;
  color?: undefined;
  positiveIntensity?: undefined;
  intensity?: undefined;
}
interface FilterAlgorithms {
  grayscale: Override<{}>;
  sepia: Override<{}>;
  tint: Override<{ hue: number; positiveIntensity: number }>;
  brightness: Override<{ intensity: number }>;
}
