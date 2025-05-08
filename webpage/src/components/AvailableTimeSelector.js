import React, { useEffect, useState } from "react";
import { SITE } from "../data/constants";
import ReadableDate from "./ReadableDate";
import backArrow from '../assets/arrow-back.svg';
import nextArrow from '../assets/arrow-next.svg';

const AvailableTimeSelector = ({ jobs, selectedTime, setSelectedTime }) => {
  const [groupedTimes, setGroupedTimes] = useState({});
  const [dates, setDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await fetch(`https://${SITE}/get-csrf-token/`, {
          method: 'GET',
          credentials: 'include' // <-- Correct!
        });
        console.log('CSRF cookie set.');
        if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
              setCookieValue(cookie.substring(10));
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error setting CSRF cookie: ', error);
      }
    };

    fetchCSRFToken();
  }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://${SITE}/available-times/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobs }),
          credentials: 'omit'
        });
        const data = await res.json();
        console.log("Response from backend:", data);

        const timesByDate = data;

        if (Object.keys(timesByDate).length > 0) {
          const dateKeys = Object.keys(timesByDate);
          setGroupedTimes(timesByDate);
          setDates(dateKeys);
          setSelectedDateIndex(0);
        } else {
          setGroupedTimes({});
          setDates([]);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching available times.");
      }
      setLoading(false);
    };

    if (jobs && jobs.length) {
      fetchTimes();
    }
  }, [jobs]);

  const handlePrevDate = () => {
    setSelectedDateIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextDate = () => {
    setSelectedDateIndex((prev) => Math.min(prev + 1, dates.length - 1));
  };

  const selectedDate = dates[selectedDateIndex];
  const timesForDate = (groupedTimes[selectedDate] || []).filter((opt) => {
    const dateOnly = opt.available_time.split("T")[0];
    return dateOnly === selectedDate;
  });

  return (
    <div className="available-time-selector">
      <div className="timecard">
        <div className="timecard-header">
          <h2>Select a Time to bring it in</h2>
        </div>
        <div className="timecard-content">
          {loading ? (
            <div className="loader"></div>
          ) : dates.length === 0 ? (
            <p>No available times found.</p>
          ) : (
            <>
              <div className="date-picker">
                <button
                  className="prev-date"
                  onClick={handlePrevDate}
                  disabled={selectedDateIndex === 0}
                >
                  <img src={backArrow} height='20px' width='auto' />
                </button>
                <input
                  type="text"
                  value={selectedDate}
                  readOnly
                  className="date-selected"
		  placeholder="selected time slot will show here"
                />
                <button
                  className="next-date"
                  onClick={handleNextDate}
                  disabled={selectedDateIndex === dates.length - 1}
                >
                  <img src={nextArrow} height='20px' width='auto' />
                </button>
              </div>
              <div>
                <ReadableDate selectedDate={selectedDate} />
              </div>

              <input
                type="text"
                value={
                  selectedTime?.available_time
                    ? `${new Date(selectedTime.available_time).toLocaleString()} - ${
                        selectedTime.end_time
                          ? new Date(selectedTime.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "?"
                      }`
                    : ""
                }
                className="selected-time"
                readOnly
              />

              <ul className="time-slot-list">
                {timesForDate.map((opt, idx) => {
                  const start = new Date(opt.available_time);
                  const end = opt.end_time ? new Date(opt.end_time) : null;

                  const timeFrame = end
                    ? `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  const isSelected = selectedTime?.available_time === opt.available_time;

                  return (
                    <li key={idx} className={`time-slot-item ${isSelected ? "selected" : ""}`}>
                      <button
                        className="time-slot-button"
                        onClick={() => setSelectedTime(opt)}
                      >
                        <strong>{timeFrame}</strong>
                        {opt.note && <small>{opt.note}</small>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableTimeSelector;
