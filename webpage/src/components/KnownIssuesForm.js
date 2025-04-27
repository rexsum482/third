import React from "react";
import ConcernOptions from "./ConcernOptions";
import { concernOptions } from "../data/concerns";

const KnownIssuesForm = ({ selectedConcerns, onToggle, onContinue, onSkip }) => (
  <>
  <div style={{position: 'relative'}}>
    <center><h2>What Concerns Do You Have?</h2></center>
    <ConcernOptions
      options={concernOptions["Known Issues"]}
      selected={selectedConcerns}
      onToggle={onToggle}
    />
  </div>
  </>
);

export default KnownIssuesForm;