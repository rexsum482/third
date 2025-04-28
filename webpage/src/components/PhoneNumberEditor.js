import React from "react";
import { SITE } from "../data/constants";

const PhoneNumberEditor = ({ phoneNumbers, setPhoneNumbers, token }) => {
  const handleNumberChange = (index, newNumber) => {
    const updatedNumbers = [...phoneNumbers];
    updatedNumbers[index].number = newNumber;
    setPhoneNumbers(updatedNumbers);
  };

  const handleAddNumber = () => {
    setPhoneNumbers([...phoneNumbers, { id: null, number: "" }]);
  };

  const handleRemoveNumber = async (index) => {
    const phoneToRemove = phoneNumbers[index];

    if (phoneToRemove.id) {
      // If the phone number exists on the server, delete it
      try {
        await fetch(`http://${SITE}/api/phones/${phoneToRemove.id}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to delete phone number:", error);
      }
    }

    // Whether delete succeeded or not, remove it from UI
    const updatedNumbers = [...phoneNumbers];
    updatedNumbers.splice(index, 1);
    setPhoneNumbers(updatedNumbers);
  };

  return (
    <><div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <h2 className="profile-section-title">Phone Numbers</h2>
      <h2 className="profile-section-title" onClick={handleAddNumber} style={{ cursor: 'pointer' }}>➕</h2>
      </div>
      {phoneNumbers.map((phone, index) => (
        <div key={index} className="phone-input-row">
          <input
            className="input"
            type="text"
            value={phone.number}
            onChange={(e) => handleNumberChange(index, e.target.value)}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleRemoveNumber(index)}
          >
            🗑️
          </button>
        </div>
      ))}
      </>
  );
};

export default PhoneNumberEditor;