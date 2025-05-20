import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('https://thirdstreetgarage.com/server/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: "omit"
      });

      if (response.ok) {
        setStatus('Message sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setStatus('Error: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      setStatus('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2 className="form-heading">Contact Us</h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="form-input"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="form-input"
        required
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="form-textarea"
        required
      />

      <button type="submit" className="form-button">
        Send
      </button>

      {status && <p className="form-status">{status}</p>}
    </form>
  );
};
export default ContactForm;
