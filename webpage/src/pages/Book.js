import React, { useState, useEffect } from "react";
import KnownIssuesForm from "../components/KnownIssuesForm";
import ProblemSelector from "../components/ProblemSelector";
import ProblemDetail from "../components/ProblemDetail";
import InfoForm from "../components/InfoForm";
import CustomerForm from "../components/CustomerForm";
import AvailableTimeSelector from "../components/AvailableTimeSelector";
import CaptchaAndSubmit from "../components/CaptchaAndSubmit";
import { SITE } from '../data/constants';
import { useNavigate } from 'react-router-dom';

const Book = () => {
  const [step, setStep] = useState(0);
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [category, setCategory] = useState(null);
  const [details, setDetails] = useState({});
  const [files, setFiles] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    plate: "",
    mileage: ""
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleConcern = (item) => {
    setSelectedConcerns((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleDetailChange = (key, value) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key, event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prev) => ({ ...prev, [key]: selectedFiles }));
  };

  const handleCustomerChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const addAnotherConcern = () => {
    setStep(1);
  };

  const onSkip = () => {
    setStep(3);
  };

  const handleCaptcha = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async () => {
    const fileUrls = [];

    try {
      for (const fileList of Object.values(files)) {
        for (const file of fileList) {
          const presignRes = await fetch(`https://${SITE}/upload-url/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credientials: "omit",
            body: JSON.stringify({
              file_name: file.name,
              file_type: file.type
            }),
          });

          if (!presignRes.ok) throw new Error("Failed to get presigned URL");
          const { upload_url, file_url } = await presignRes.json();

          const uploadRes = await fetch(upload_url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!uploadRes.ok) throw new Error("Failed to upload to S3");
          fileUrls.push(file_url);
        }
      }

      const bookingRes = await fetch(`https://${SITE}/api/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: customerInfo.name,
          number: customerInfo.phone,
          vehicle: `${customerInfo.year} ${customerInfo.make} ${customerInfo.model}`,
          concerns: selectedConcerns.map(c => `${c}: ${details[c] || ''}`).join("\n"),
          time_selected: selectedTime?.available_time || null,
        }),
      });

      if (!bookingRes.ok) {
        const data = await bookingRes.json();
        console.error("Booking failed:", data);
        alert("Failed to submit booking.");
        return;
      }

      const booking = await bookingRes.json();

      for (const file_url of fileUrls) {
        await fetch(`https://${SITE}/api/pictures/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cedentials: "omit",
          body: JSON.stringify({ booking: booking.id, file_url }),
        });
      }

      const bayNumber = selectedTime.bays[0];
      const bayRes = await fetch(`https://${SITE}/api/jobs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          bay: bayNumber,
          booking_id: booking.id,
          start_time: selectedTime.available_time,
          end_time: selectedTime.end_time
        }),
      });

      if (!bayRes.ok) {
        const bayError = await bayRes.json();
        console.error("Job booking failed:", bayError);
        alert("Failed to mark bay as in use.");
      }

      alert("Booking submitted!");
      navigate('/');
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred during submission.");
    }
  };

  return (
<>
  <div className="booking-container">
    <div className="card" style={{ margin: '2rem auto', backgroundColor: '#C0C0C0' }}>
    {step === 0 && (
      <KnownIssuesForm
        selectedConcerns={selectedConcerns}
        onToggle={toggleConcern}
        onContinue={() => setStep(1)}
        onSkip={onSkip}
      />
    )}
    {step === 1 && (
      <ProblemSelector
        onSelectCategory={(cat) => {
          setCategory(cat);
          setStep(2);
        }}
      />
    )}
    {step === 2 && category && (
      <ProblemDetail
        category={category}
        selectedConcerns={selectedConcerns}
        details={details}
        files={files}
        onToggle={toggleConcern}
        onDetailChange={handleDetailChange}
        onFileChange={handleFileChange}
        onContinue={() => setStep(5)}
      />
    )}
    {step === 3 && (
      <InfoForm
        details={details}
        files={files}
        handleDetailChange={handleDetailChange}
        handleFileChange={handleFileChange}
        addAnotherConcern={addAnotherConcern}
      />
    )}
    {step === 4 && (
      <CustomerForm
        customerInfo={customerInfo}
        handleCustomerChange={handleCustomerChange}
      />
    )}
    {step === 5 && (
      <AvailableTimeSelector
        jobs={selectedConcerns}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    )}
    {step === 6 && (
      <CaptchaAndSubmit
        captcha={captchaToken}
        setCaptchaToken={handleCaptcha}
        handleSubmit={handleSubmit}
      />
    )}

  {/* Bottom Buttons */}
  {step === 0 && (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '3rem' }}>
      <div className="fixed-button left">
        <button
          onClick={() => setStep(step + 1)}
          className="circle-button blue"
        >
          Don't know what's wrong?
        </button>
      </div>
      <div className="fixed-button right">
        <button
          onClick={onSkip}
          className="circle-button green"
        >
          Continue
        </button>
      </div>
    </div>
  )}
  {step >= 2 && step < 6 && (
    <div className="fixed-button right" style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setStep(step + 1)}
        className="circle-button green"
      >
        Continue
      </button>
    </div>
  )}
  </div>
  </div>
</>

  );
};

export default Book;
