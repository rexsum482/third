import React from "react";
import Checkbox from "./Checkbox";

const ConcernOptions = ({ options, selected, onToggle }) => (
  <div className="concern-options">
    {options.map((item) => (
      <Checkbox
        key={item}
        text={item}
        selected={selected.includes(item)}
        onChange={() => onToggle(item)}
      />
    ))}
  </div>
);

export default ConcernOptions;
