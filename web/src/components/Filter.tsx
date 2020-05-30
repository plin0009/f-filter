import React from "react";
import { FilterObject } from "../filters";

interface FilterProps {
  filterObject: FilterObject;
  onToggleHide: () => void;
  onRemove: () => void;
}

const Filter = ({ filterObject, onToggleHide, onRemove }: FilterProps) => {
  return (
    <div className={`filter ${filterObject.hidden && "hidden-filter"}`}>
      <p className="filterName">{filterObject.name}</p>
      <button onClick={onToggleHide}>
        {filterObject.hidden ? "Show" : "Hide"}
      </button>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
};

export default Filter;
