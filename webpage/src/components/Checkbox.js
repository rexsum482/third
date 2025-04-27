import React from "react";
import selectedCheck from "../assets/selectedCheck.svg";
import unselectedCheck from "../assets/unselectedChecks.svg";
import '../assets/checkbox.css';

const Checkbox = ({
  text,
  selected = false,
  onChange,
  name,
  value,
  disabled = false,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (onChange) onChange(e);
  };

  return (
    <label className={`custom-checkbox ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={selected}
        onChange={handleClick}
        disabled={disabled}
        {...props}
      />
      <span className="checkbox-icon">
        <img
          src={selected ? selectedCheck : unselectedCheck}
          alt={selected ? "Selected" : "Unselected"}
        />
      </span>
      {text && <span className="checkbox-text">{text}</span>}
    </label>
  );
};

export default Checkbox;