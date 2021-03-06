export type Curve = { x: number; y: number }[];

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

export interface ColorHSV {
  h: number;
  s: number;
  v: number;
}

//export type ColorHue = number;
export interface FilterFromCode {
  code: string;
  filterObjects: FilterObject[];
}
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

export type DefaultFilterObjects<
  T = {
    [K in keyof FilterAlgorithms]: {
      args?: FilterAlgorithms[K];
    };
  }
> = T;

type Override<T extends (keyof FA)[]> = Pick<
  DFA,
  Exclude<keyof DFA, T[number]>
> &
  { [K in T[number]]: FA[K] };
export interface DFA {
  hue?: undefined;
  color?: undefined;
  positiveIntensity?: undefined;
  intensity?: undefined;
  curve?: undefined;
}
export interface FA {
  hue: number;
  color: ColorRGB;
  positiveIntensity: number;
  intensity: number;
  curve: Curve;
}
export type FAArg<
  T = {
    [K in keyof FA]: {
      key: K;
      value: FA[K];
    };
  }
> = T[keyof T];
interface FilterAlgorithms {
  grayscale: Override<[]>;
  invert: Override<[]>;
  sepia: Override<[]>;
  tint: Override<["hue", "positiveIntensity"]>;
  brightness: Override<["intensity"]>;
  temperature: Override<["intensity"]>;
  redCurve: Override<["curve"]>;
}
