import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const CaptchaAndSubmit = ({ captcha, setCaptchaToken, handleSubmit }) => (
  <div className="captcha-and-submit">
    <ReCAPTCHA
      sitekey="6Le_ahkrAAAAABbtmBLAjWVBVSnzVksuMd58buom"
      onChange={(value) => setCaptchaToken(value)}
    />
    <button className="submit-button" onClick={handleSubmit}>
      Submit Booking
    </button>
  </div>
);

export default CaptchaAndSubmit;