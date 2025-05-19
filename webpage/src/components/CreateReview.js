import React, { useState } from "react";
import { SITE } from "../data/constants";

const CreateReview = () => {
  const [formData, setFormData] = useState({ name: "", rating: null, review: "" });
  const [hoveredRating, setHoveredRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async () => {
    if (!formData.rating) {
      alert("Please select a rating before submitting.");
      return;
    }
    if (!formData.name) {
        alert("You can not leave your name blank");
        return;
    }
    if (!formData.review) {
        alert("You must leave a review to submit a rating");
        return;
    }

    try {
      const response = await fetch(`https://${SITE}/api/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      alert(`Failed to submit review: ${err}`);
      console.error(err);
    }
  };

  const renderStars = () => {
    const stars = [];
    const activeRating = hoveredRating !== null ? hoveredRating : formData.rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            color: i <= activeRating ? "#f5b301" : "#ccc",
            transition: "color 0.2s",
          }}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => handleStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={{
      backgroundColor: "#1a202c",
      color: "#fff",
      padding: "2rem",
      borderRadius: "1rem",
      maxWidth: "600px",
      margin: "2rem auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Leave a Review</h2>

      {submitted ? (
        <h3 style={{ textAlign: "center" }}>Thank you for your review!</h3>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}>
              Your name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#2d3748",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            {renderStars()}
            <div style={{ marginTop: "0.5rem", color: "#ccc" }}>Click to rate</div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}>
              Your review
            </label>
            <textarea
              name="review"
              rows="4"
              value={formData.review}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#2d3748",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#006000",
              border: "none",
              borderRadius: "0.5rem",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#004000")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#006000")}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default CreateReview;
