import React, { useState } from "react";
import { bookDate } from "./api";

function BookingForm({ setBookings }) {
  const [form, setForm] = useState({ date: "", name: "", block: "", unit: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateField = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await bookDate(form);
      if (res.success !== false) {
        setStatus({ type: "success", message: "Your pooja date has been reserved." });
        setBookings(prev => ({ ...prev, [form.date]: form }));
        setForm({ date: "", name: "", block: "", unit: "" });
      } else {
        setStatus({ type: "error", message: "That date is already booked. Please choose another." });
      }
    } catch (error) {
      const message = error.message === "Date already booked"
        ? "That date is already booked. Please choose another date."
        : error.message || "Booking could not be completed. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="booking-panel panel" onSubmit={handleSubmit}>
      <div className="section-heading form-heading">
        <div>
          <p className="eyebrow">Make a reservation</p>
          <h2>Book your pooja</h2>
        </div>
        <span className="form-icon" aria-hidden="true">✦</span>
      </div>
      <p className="form-intro">Share your details and we will mark the selected day for your family.</p>

      <div className="form-fields">
        <label>
          Pooja date
          <input name="date" type="date" value={form.date} onChange={updateField} required />
        </label>
        <label>
          Your name
          <input name="name" placeholder="Enter your full name" value={form.name} onChange={updateField} required />
        </label>
        <div className="field-row">
          <label>
            Block
            <input name="block" placeholder="e.g. 1" value={form.block} onChange={updateField} required />
          </label>
          <label>
            Unit
            <input name="unit" placeholder="e.g. 104" value={form.unit} onChange={updateField} required />
          </label>
        </div>
      </div>

      {status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}
      <button className="submit-button" type="submit" disabled={submitting}>
        {submitting ? "Reserving..." : "Reserve this date"}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}

export default BookingForm;
