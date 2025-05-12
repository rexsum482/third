import React from "react";

const InfoForm = React.memo(function InfoForm({ details, files, handleDetailChange, handleFileChange, addAnotherConcern }) {
  return (
  <div className="info-form">
    <textarea
      className="info-textarea"
      placeholder="Anything else we should know?"
      value={details["Additional Info"] || ""}
      onChange={(e) => handleDetailChange("Additional Info", e.target.value)}
    />
    <input
      type="file"
      className="file-input"
      multiple
      onChange={(e) => handleFileChange("Additional Info", e)}
    />
    <button className="add-concern-button" onClick={addAnotherConcern}>
      Add Another Concern
    </button>
  </div>
)})

export default InfoForm;
