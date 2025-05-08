import React, { useState, useEffect } from "react";
import { SITE } from "../data/constants";
import PhoneNumberEditor from "../components/PhoneNumberEditor";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://${SITE}/api/users/me/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        const data = await response.json();
        setUser(data);
        setEmail(data.email);
        setPhoneNumbers(data.phone_numbers || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
  
    try {
      // Update user email
      const userUpdate = await fetch(`https://${SITE}/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ email }),
      });
  
      if (!userUpdate.ok) {
        throw new Error("Failed to update email");
      }
  
      // Update or create phone numbers
      await Promise.all(phoneNumbers.map(phone => {
        if (phone.number.trim() === "") {
          return Promise.resolve();
        }
        
        if (phone.id) {
          // Update existing phone number
          return fetch(`https://${SITE}/api/phones/${phone.id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ number: phone.number }),
          });
        } else {
          // Create new phone number
          return fetch(`https://${SITE}/api/phones/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({
              user: user.id,
              number: phone.number,
            }),
          });
        }
      }));
  
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
    setSaving(false);
  };
  

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container">
      <div className="card profile-card">
        <h1 className="profile-title">My Profile</h1>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="label">Username</label>
            <input 
              className="input"
              type="text"
              value={user.username}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input 
              className="input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <PhoneNumberEditor phoneNumbers={phoneNumbers} setPhoneNumbers={setPhoneNumbers} token={token} />

          <button type="submit" className="btn-primary mt-2" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
