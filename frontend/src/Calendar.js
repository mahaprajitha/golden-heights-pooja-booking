import React, { useState } from "react";

function Calendar({ bookings }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const monthName = visibleMonth.toLocaleString("en-US", { month: "long" });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingEmptyDays = new Date(year, monthIndex, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const changeMonth = offset => {
    setVisibleMonth(new Date(year, monthIndex + offset, 1));
  };

  return (
    <div className="calendar-wrap">
      <div className="calendar-toolbar">
        <button className="month-button" type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">←</button>
        <h3>{monthName} {year}</h3>
        <button className="month-button" type="button" onClick={() => changeMonth(1)} aria-label="Next month">→</button>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">
        {weekdays.map(day => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid">
      {Array.from({ length: leadingEmptyDays }, (_, index) => (
        <div className="calendar-empty" key={`empty-${index}`} aria-hidden="true" />
      ))}
      {days.map(day => {
        const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const booked = bookings[date];
        return (
          <div className={`calendar-day ${booked ? "is-booked" : "is-available"}`} key={day} aria-label={`${date}: ${booked ? `booked by ${booked.name}` : "available"}`}>
            <span className="day-number">{day}</span>
            <span className="day-status">{booked ? "Booked" : "Open"}</span>
            {booked && <span className="booking-name">{booked.name}</span>}
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Calendar;
