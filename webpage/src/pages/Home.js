import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo2.png";
import { SITE } from "../data/constants";

export default function Home() {
  const [serverTime, setServerTime] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`http://${SITE}/server-time/`)
      .then((res) => res.json())
      .then((data) => {
        setServerTime(new Date(data.server_time));
      })
      .catch((err) => console.error("Failed to fetch server time", err));
  }, []);

  const businessHours = {
    Monday: ["08:00", "18:00"],
    Tuesday: ["08:00", "18:00"],
    Wednesday: ["08:00", "18:00"],
    Thursday: ["08:00", "18:00"],
    Friday: ["08:00", "18:00"],
    Saturday: null,
    Sunday: null,
  };

  const getCurrentDayStatus = (day) => {
    if (!serverTime) return null;
    const currentDay = serverTime.toLocaleString("en-US", { weekday: "long" });
    if (currentDay !== day) return null;

    const currentHour = serverTime.getHours();
    const currentMinute = serverTime.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    const [open, close] = businessHours[day] || [];
    if (!open || !close) return "closed";

    return currentTime >= open && currentTime < close ? "open" : "closed";
  };

  const convertTo12Hr = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const currentDay = serverTime?.toLocaleString("en-US", { weekday: "long" });

  return (
    <>
      <div className="home-container">
        <div className={`home-content ${isMobile ? 'mobile' : ''}`}>
          <img
            src={Logo}
            alt="3rd Street Garage Logo"
            className={`logo ${isMobile ? 'mobile' : ''}`}
          />
          <div className="text-center">
            <h1 className="heading">3rd Street Garage</h1>
            <p className="address">
              8961 3rd Street<br />Frisco, TX 75033
            </p>
            <a href="tel: +19723351153" className="phone">📞 972-335-1153</a>
            <h2 className="subheading">Business Hours:</h2>

            <div className="business-hours">
              <table>
                <tbody>
                  {Object.entries(businessHours).map(([day, time]) => {
                    const isToday = currentDay === day;
                    const status = getCurrentDayStatus(day);

                    return (
                      <tr
                        key={day}
                        className={`business-row ${isToday ? 'today' : ''}`}
                      >
                        <td className={`day-name ${isToday ? 'today' : ''}`}>
                          {day}
                        </td>
                        <td className="day-hours">
                          {time ? (
                            <>
                              <span>{`${convertTo12Hr(time[0])} - ${convertTo12Hr(time[1])}`}</span>
                              {isToday && (
                                <span
                                  className={`status-indicator ${status === 'open' ? 'status-open' : 'status-closed'}`}
                                  title={status === 'open' ? 'Open Now' : 'Closed Now'}
                                />
                              )}
                            </>
                          ) : (
                            'Closed'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <center>
      <div style={{ width: '100vw', marginBottom: '20px', marginTop: '200px' }}>
        <h2 className="heading">Where To Find Us</h2>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3340.3860770528768!2d-96.82881782385557!3d33.15148977350956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3c056e738aff%3A0x796a9eaf4e0ececa!2s3rd%20Street%20Garage!5e0!3m2!1sen!2sus!4v1745785109310!5m2!1sen!2sus" width="400" height="300" style={{ justifyContent: 'center', alignItems: 'center', border: 0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      </center>
      {/* Floating Button */}
      <a href="/book" className="floating-button">
        Schedule Service
      </a>
    </>
  );
}
