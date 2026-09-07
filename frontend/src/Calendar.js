import React, { useState } from "react";

function Calendar({ bookings }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
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
          <div
            className={`calendar-day ${booked ? "is-booked" : "is-available"}`}
            key={day}
            aria-label={`${date}: ${booked ? `booked by ${booked.name}` : "available"}`}
            role={booked ? "button" : undefined}
            tabIndex={booked ? 0 : undefined}
            onClick={() => booked && setSelectedBooking({ date, ...booked })}
            onKeyDown={event => {
              if (booked && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                setSelectedBooking({ date, ...booked });
              }
            }}
          >
            <span className="day-number">{day}</span>
            <span className="day-status">{booked ? "Booked" : "Open"}</span>
          </div>
        );
      })}
      </div>
      {selectedBooking && (
        <div className="booking-modal-backdrop" role="presentation" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" onClick={event => event.stopPropagation()}>
            <button className="booking-modal-close" type="button" onClick={() => setSelectedBooking(null)} aria-label="Close booking details">×</button>
            <p className="eyebrow">Booked date</p>
            <h3 id="booking-modal-title">{selectedBooking.date}</h3>
            <p className="booking-modal-name">{selectedBooking.name}</p>
            {selectedBooking.block && selectedBooking.unit && (
              <p className="booking-modal-location">{selectedBooking.block}-{selectedBooking.unit}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
