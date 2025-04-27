import React from "react";

const CustomerForm = ({ customerInfo, handleCustomerChange }) => (
  <div className="customer-form">
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        className="form-input"
        value={customerInfo.name}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="phone">Phone Number</label>
      <input
        id="phone"
        name="phone"
        type="text"
        className="form-input"
        value={customerInfo.phone}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="year">Year</label>
      <input
        id="year"
        name="year"
        type="text"
        className="form-input"
        value={customerInfo.year}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="make">Make</label>
      <input
        id="make"
        name="make"
        type="text"
        className="form-input"
        value={customerInfo.make}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="model">Model</label>
      <input
        id="model"
        name="model"
        type="text"
        className="form-input"
        value={customerInfo.model}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="plate">License Plate</label>
      <input
        id="plate"
        name="plate"
        type="text"
        className="form-input"
        value={customerInfo.plate}
        onChange={handleCustomerChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="mileage">Mileage</label>
      <input
        id="mileage"
        name="mileage"
        type="text"
        className="form-input"
        value={customerInfo.mileage}
        onChange={handleCustomerChange}
      />
    </div>
  </div>
);

export default CustomerForm;
