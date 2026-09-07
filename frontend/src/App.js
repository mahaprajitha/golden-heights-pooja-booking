import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import BookingForm from "./BookingForm";
import Admin from "./Admin";
import { getBookings } from "./api";

function App() {
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  return <PublicBooking />;
}

function PublicBooking() {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-mark" aria-hidden="true">ॐ</div>
        <div>
          <p className="eyebrow">MP Golden Heights community</p>
          <h1>MP Golden Heights</h1>
          <p className="hero-copy">Vinayagar Pooja Booking</p>
        </div>
        <a className="admin-link" href="/admin">Admin login <span aria-hidden="true">↗</span></a>
      </header>

      <section className="content-grid" aria-label="Booking dashboard">
        <section className="calendar-panel panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Availability</p>
              <h2>Community calendar</h2>
            </div>
            <div className="legend" aria-label="Calendar legend">
              <span><i className="legend-dot available" />Available</span>
              <span><i className="legend-dot booked" />Booked</span>
            </div>
          </div>
          {loading && <p className="status-message">Loading availability...</p>}
          {loadError && <p className="status-message error">Could not load bookings. Please refresh and try again.</p>}
          {!loading && !loadError && <Calendar bookings={bookings} />}
        </section>

        <BookingForm setBookings={setBookings} />
      </section>

      <footer className="page-footer">Made for a joyful and meaningful celebration.</footer>
    </main>
  );
}

export default App;
