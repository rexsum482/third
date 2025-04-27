import React from "react";
import { concernOptions } from "../data/concerns";

const ProblemSelector = ({ onSelectCategory }) => (
  <div className="problem-selector">
    {Object.keys(concernOptions.Problems).map((category) => (
      <button
        key={category}
        onClick={() => onSelectCategory(category)}
        className="category-button"
      >
        {category}
      </button>
    ))}
  </div>
);

export default ProblemSelector;