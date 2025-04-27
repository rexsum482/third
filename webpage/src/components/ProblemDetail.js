import React from "react";
import { concernOptions } from "../data/concerns";
import CheckEngine from "../assets/checkengine.png";
import Battery from "../assets/battery.png";
import Brakes from "../assets/brakes.png";
import Coolant from "../assets/coolant.png";
import EngineTemp from "../assets/enginetemp.png";
import OilPressure from "../assets/oilpressure.png";
import Traction from "../assets/traction.png";

// Icons only for subitems under "Warning Light"
const warningLightIcons = {
  "Check Engine": CheckEngine,
  "Oil Pressure": OilPressure,
  "Battery": Battery,
  "Engine Temperature": EngineTemp,
  "Brakes": Brakes,
  "Traction Control": Traction,
  "Coolant": Coolant,
};

const ProblemDetail = ({
  category,
  selectedConcerns,
  details,
  files,
  onToggle,
  onDetailChange,
  onFileChange,
  onContinue,
}) => (
  <div className="problem-detail">
    {concernOptions.Problems[category].map((subitem) => {
      const key = `${category} - ${subitem}`;
      const isSelected = selectedConcerns.includes(key);
      const icon = category === "Warning Light" ? warningLightIcons[subitem] : null;

      return (
        <div key={key} className="problem-item">
          <button
            className={`problem-button ${isSelected ? "selected" : ""}`}
            onClick={() => onToggle(key)}
          >
            <span>{subitem}</span>
            {icon && (
              <img
                src={icon}
                alt={`${subitem} icon`}
                className="problem-icon"
              />
            )}
          </button>

          {isSelected && (
            <div className="problem-details">
              <textarea
                placeholder="Describe issue..."
                value={details[key] || ""}
                onChange={(e) => onDetailChange(key, e.target.value)}
                className="detail-textarea"
              />
              <input
                type="file"
                multiple
                onChange={(e) => onFileChange(key, e)}
                className="file-input"
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default ProblemDetail;