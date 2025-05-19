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
    // Convert selectedDate to Central Time date string (YYYY-MM-DD)
    const centralDate = new Date(
      selectedDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })
    );
    const formattedDate = centralDate.toISOString().split('T')[0];

    const res = await fetch(`https://${SITE}/api/jobs/?date=${formattedDate}`);
    const data = await res.json();
    setJobs(data);
  };

  const fetchBays = async () => {
    const res = await fetch(`https://${SITE}/api/bays/`);
    const data = await res.json();
    setBays(data);
  };

  const createBlock = async () => {
    if (!selectedBay || !startTime || !endTime) return;

    const res = await fetch(`https://${SITE}/api/jobs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      credentials: "omit",
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

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this block?");
    if (!confirmDelete) return;
  
    const res = await fetch(`https://${SITE}/api/jobs/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  
    if (res.ok) {
      fetchJobs();
    } else {
      console.error('Error deleting block');
    }
  };
const getMinutesSince8AM = (dateStr) => {
  const date = new Date(dateStr);
  const eightAM = new Date(date);
  eightAM.setHours(8, 0, 0, 0);
  return (date - eightAM) / (1000 * 60); // convert to minutes
};

const MINUTES_IN_DAY = 600; // 10 hours
const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8 AM to 5 PM

  return (
<>
<div className="timeline-container admin-schedule">
  <h2>Bay Usage Timeline</h2>
<div style={{ display: 'flex', gap: '20px', marginBottom: '10px', marginLeft: '70px' }}>
  <div><span style={{ display: 'inline-block', width: 15, height: 15, backgroundColor: 'rgba(255, 0, 0, 0.6)', border: '1px solid #900', marginRight: 5 }}></span>Booking</div>
  <div><span style={{ display: 'inline-block', width: 15, height: 15, backgroundColor: 'rgba(128, 128, 128, 0.5)', border: '1px solid #555', marginRight: 5 }}></span>Blocked</div>
</div>
<div className="timeline-header">
  {hours.map((hour, idx) => (
    <div className="timeline-hour" key={idx}>
      {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
    </div>
  ))}
</div>
  <div className="timeline">
    {bays.map((bay) => (
      <div className="timeline-row" key={bay.id}>
        <div className="timeline-label">Bay {bay.number}</div>
        <div className="timeline-grid">
{jobs
  .filter((job) => job.bay === bay.id)
  .map((job, idx) => {
    const startMin = getMinutesSince8AM(job.start_time);
    const endMin = getMinutesSince8AM(job.end_time);
    const left = `${(startMin / MINUTES_IN_DAY) * 100}%`;
    const width = `${((endMin - startMin) / MINUTES_IN_DAY) * 100}%`;

    const isBooking = Boolean(job.booking);

    return (
      <div
        key={idx}
        className={isBooking ? "job-block" : "blocked-block"}
        style={{ left, width }}
        title={
          isBooking
            ? `Booking: ${new Date(job.start_time).toLocaleTimeString()} - ${new Date(job.end_time).toLocaleTimeString()}`
            : `Blocked: ${new Date(job.start_time).toLocaleTimeString()} - ${new Date(job.end_time).toLocaleTimeString()}`
        }
      />
    );
  })}
        </div>
      </div>
    ))}
  </div>
</div>
    <div className="admin-schedule">
      <div className="admin-schedule__header">
        <div>
          <h1 className="admin-schedule__title">Daily Schedule</h1>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline />
        </div>
          {/* Blocked Bays List */}
          <div>
          <h2>Blocked Bays</h2>
          <div className="blocked-bays">
            {jobs.filter(job => !job.booking).map((job, idx) => (
              <div key={idx} className="blocked-bay">
                <p>Bay {job.bay} | {new Date(job.start_time).toLocaleTimeString()} - {new Date(job.end_time).toLocaleTimeString()}</p>
                <button className="btn btn-danger" onClick={() => deleteJob(job.id)}>Delete</button>
              </div>
            ))}
            {jobs.filter(job => !job.booking).length === 0 && <p>No blocked bays today.</p>}
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Block Bay</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="admin-schedule__jobs">
         {jobs.filter(job => job.booking).map((job, idx) => (
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
          ))}
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
</>
  );
};

export default Jobs;
