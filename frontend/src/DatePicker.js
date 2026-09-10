import React, { useState } from "react";

function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const minDate = new Date(2026, 8, 14); // Sep 14, 2026
  const maxDate = new Date(2026, 9, 31); // Oct 31, 2026
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (value) {
      const [year, month, day] = value.split("-");
      return new Date(year, month - 1, 1);
    }
    return new Date(minDate);
  });

  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const monthName = visibleMonth.toLocaleString("en-US", { month: "long" });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingEmptyDays = new Date(year, monthIndex, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const changeMonth = offset => {
    const newMonth = new Date(year, monthIndex + offset, 1);
    if (newMonth >= minDate && newMonth <= maxDate) {
      setVisibleMonth(newMonth);
    }
  };

  const handleDateClick = day => {
    const date = new Date(year, monthIndex, day);
    if (date >= minDate && date <= maxDate) {
      const dateString = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onChange(dateString);
      setIsOpen(false);
    }
  };

  const isDateDisabled = day => {
    const date = new Date(year, monthIndex, day);
    return date < minDate || date > maxDate;
  };

  const displayValue = value
    ? new Date(value + "T00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Select a date";

  return (
    <div className="date-picker">
      <button
        type="button"
        className="date-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open date picker"
      >
        {displayValue}
        <span aria-hidden="true">📅</span>
      </button>

      {isOpen && (
        <div className="date-picker-overlay" role="presentation" onClick={() => setIsOpen(false)}>
          <div className="date-picker-calendar" role="presentation" onClick={e => e.stopPropagation()}>
            <div className="date-picker-toolbar">
              <button
                type="button"
                className="date-picker-nav"
                onClick={() => changeMonth(-1)}
                disabled={visibleMonth <= minDate}
                aria-label="Previous month"
              >
                ←
              </button>
              <h3 className="date-picker-month">
                {monthName} {year}
              </h3>
              <button
                type="button"
                className="date-picker-nav"
                onClick={() => changeMonth(1)}
                disabled={
                  new Date(year, monthIndex + 1, 1) >
                  new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
                }
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="date-picker-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="date-picker-grid">
              {Array.from({ length: leadingEmptyDays }).map((_, i) => (
                <div key={`empty-${i}`} className="date-picker-empty" />
              ))}
              {days.map(day => {
                const disabled = isDateDisabled(day);
                const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = value === date;
                return (
                  <button
                    key={day}
                    type="button"
                    className={`date-picker-day ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                    onClick={() => !disabled && handleDateClick(day)}
                    disabled={disabled}
                    aria-label={`${date}${disabled ? " (unavailable)" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <p className="date-picker-info">Bookings available: Sep 14 - Oct 31, 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
