import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SITE } from '../data/constants';

const Jobs = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [jobs, setJobs] = useState([]);
  const [bays, setBays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBay, setSelectedBay] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchJobs();
    fetchBays();
    setLoading(false);
  }, [selectedDate]);

  const fetchJobs = async () => {
    const res = await fetch(`http://${SITE}/api/jobs/?date=${selectedDate.toISOString().split('T')[0]}`);
    const data = await res.json();
    setJobs(data);
  };

  const fetchBays = async () => {
    const res = await fetch(`http://${SITE}/api/bays/`);
    const data = await res.json();
    setBays(data);
  };

  const createBlock = async () => {
    if (!selectedBay || !startTime || !endTime) return;

    const res = await fetch(`http://${SITE}/api/jobs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        bay: selectedBay,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      }),
    });

    if (res.ok) {
      fetchJobs();
      setIsModalOpen(false);
    } else {
      console.error('Error blocking bay');
    }
  };

  return (
    <div className="admin-schedule">
      <div className="admin-schedule__header">
        <div>
        <h1 className="admin-schedule__title">Daily Schedule</h1>
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline />
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Block Bay</button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="admin-schedule__jobs">
          {jobs.map((job, idx) => {job.booking && (
            <div className="card" key={idx}>
              <div className="card-content">
                <h2>Bay {job.bay}</h2>
                <p>{new Date(job.start_time).toLocaleTimeString()} - {new Date(job.end_time).toLocaleTimeString()}</p>
                {job.booking && (
                  <>
                    <span><strong>Name:</strong> {job.booking.name}</span><br />
                    <span><strong>Vehicle:</strong> {job.booking.vehicle}</span><br />
                    <span><strong>Concrens:</strong> {job.booking.concerns}</span>
                  </>
                )}
              </div>
            </div>
          )})}
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Block a Bay</h2>

            <div className="form-group">
              <label>Select Bay</label>
              <select
                value={selectedBay}
                onChange={(e) => setSelectedBay(e.target.value)}
              >
                <option value="">Select Bay</option>
                {bays.map((b) => (
                  <option key={b.id} value={b.id}>Bay {b.number}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Start Time:</label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="Pp"
              />
            </div>

            <div className="form-group">
              <label>End Time:</label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="Pp"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={createBlock}
                disabled={!selectedBay}
              >
                Block
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
