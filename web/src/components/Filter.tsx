import React from "react";
import { ChromePicker, HuePicker } from "react-color";
import { FilterObject, ColorRGB } from "../types";

import { HiddenOrVisibleSVG, RemoveSVG } from "./svgs";

interface FilterProps {
  filterObject: FilterObject;
  onToggleHide: () => void;
  onRemove: () => void;
  onChangeColor?: (newColor: ColorRGB) => void;
  onChangeHue?: (newHue: number) => void;
  onChangeIntensity?: (newIntensity: number) => void;
  onChangePositiveIntensity?: (newPositiveIntensity: number) => void;
}

const Filter = ({
  filterObject,
  onToggleHide,
  onRemove,
  onChangeColor,
  onChangeHue,
  onChangeIntensity,
  onChangePositiveIntensity,
}: FilterProps) => {
  return (
    <div className={`filter ${filterObject.hidden ? "hidden-filter" : ""}`}>
      <div className="filterTop">
        <p className="filterName">{filterObject.name}</p>
        <button className="svg-button" onClick={onToggleHide}>
          <HiddenOrVisibleSVG hidden={!!filterObject.hidden} size="1em" />
        </button>
        <button className="svg-button" onClick={onRemove}>
          <RemoveSVG size="1em" />
        </button>
      </div>
      <div className="filterSettings">
        {filterObject?.args?.hue !== undefined ? (
          <HuePicker
            color={{ h: filterObject.args.hue, s: 1, l: 1 }}
            width="100%"
            onChange={({ hsl: { h } }) => {
              if (onChangeHue === undefined) {
                return;
              }
              onChangeHue(h);
            }}
          />
        ) : null}
        {filterObject?.args?.color !== undefined ? (
          <ChromePicker
            color={filterObject.args.color}
            onChange={({ rgb }) => {
              if (onChangeColor === undefined) {
                return;
              }
              onChangeColor(rgb);
            }}
            disableAlpha
          />
        ) : null}
        {filterObject?.args?.intensity !== undefined ? (
          <input
            type="range"
            min={-100}
            max={100}
            value={filterObject.args.intensity}
            onChange={(e) => {
              const newValue = +e.target.value;
              console.log(newValue);
              if (onChangeIntensity === undefined) {
                return;
              }
              onChangeIntensity(newValue);
            }}
          />
        ) : null}
        {filterObject?.args?.positiveIntensity !== undefined ? (
          <input
            type="range"
            min={0}
            max={100}
            value={filterObject.args.positiveIntensity}
            onChange={(e) => {
              const newValue = +e.target.value;
              console.log(newValue);
              if (onChangePositiveIntensity === undefined) {
                return;
              }
              onChangePositiveIntensity(newValue);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Filter;
