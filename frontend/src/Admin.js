import React, { useEffect, useState } from "react";
import { adminLogin, cancelBooking, getBookings } from "./api";

function Admin() {
	const [credentials, setCredentials] = useState({ username: "", password: "" });
	const [loggedIn, setLoggedIn] = useState(false);
	const [bookings, setBookings] = useState({});
	const [status, setStatus] = useState({ type: "", message: "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loggedIn) return;

		setLoading(true);
		getBookings()
			.then(setBookings)
			.catch(error => setStatus({ type: "error", message: error.message }))
			.finally(() => setLoading(false));
	}, [loggedIn]);

	const handleLogin = async event => {
		event.preventDefault();
		setStatus({ type: "", message: "" });

		try {
			await adminLogin(credentials);
			setLoggedIn(true);
		} catch (error) {
			setStatus({ type: "error", message: "Invalid username or password." });
		}
	};

	const handleCancel = async date => {
		if (!window.confirm(`Cancel the booking for ${date}?`)) return;

		try {
			await cancelBooking(date);
			setBookings(previous => {
				const next = { ...previous };
				delete next[date];
				return next;
			});
			setStatus({ type: "success", message: `Booking for ${date} was cancelled.` });
		} catch (error) {
			setStatus({ type: "error", message: "The booking could not be cancelled." });
		}
	};

	const bookingEntries = Object.entries(bookings).sort(([first], [second]) => first.localeCompare(second));

	if (!loggedIn) {
		return (
			<main className="app-shell admin-shell">
				<header className="hero admin-hero">
					<a className="back-link" href="/">← Back to bookings</a>
					<div className="hero-mark" aria-hidden="true">ॐ</div>
					<div>
						<p className="eyebrow">Private dashboard</p>
						<h1>Admin login</h1>
						<p className="hero-copy">Manage reservations for the community pooja.</p>
					</div>
				</header>

				<form className="admin-login panel" onSubmit={handleLogin}>
					<p className="eyebrow">Welcome back</p>
					<h2>Sign in to continue</h2>
					<p className="form-intro">Use your administrator credentials to view and manage bookings.</p>
					<div className="form-fields">
						<label>
							Username
							<input
								value={credentials.username}
								onChange={event => setCredentials({ ...credentials, username: event.target.value })}
								autoComplete="username"
								required
							/>
						</label>
						<label>
							Password
							<input
								type="password"
								value={credentials.password}
								onChange={event => setCredentials({ ...credentials, password: event.target.value })}
								autoComplete="current-password"
								required
							/>
						</label>
					</div>
					{status.message && <p className={`form-status ${status.type}`} role="alert">{status.message}</p>}
					<button className="submit-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
				</form>
			</main>
		);
	}

	return (
		<main className="app-shell admin-shell">
			<header className="hero admin-hero">
				<a className="back-link" href="/">← Back to bookings</a>
				<div className="hero-mark" aria-hidden="true">ॐ</div>
				<div>
					<p className="eyebrow">Administrator dashboard</p>
					<h1>Manage bookings</h1>
					<p className="hero-copy">Review reservations and keep the calendar up to date.</p>
				</div>
				<button className="logout-button" type="button" onClick={() => setLoggedIn(false)}>Log out</button>
			</header>

			<section className="admin-content panel">
				<div className="section-heading">
					<div>
						<p className="eyebrow">Reservations</p>
						<h2>All bookings</h2>
					</div>
					<span className="booking-count">{bookingEntries.length} {bookingEntries.length === 1 ? "booking" : "bookings"}</span>
				</div>
				{status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}
				{loading && <p className="status-message">Loading bookings...</p>}
				{!loading && bookingEntries.length === 0 && <p className="empty-state">There are no bookings yet.</p>}
				{!loading && bookingEntries.length > 0 && (
					<div className="booking-table-wrap">
						<table className="booking-table">
							<thead>
								<tr><th>Date</th><th>Name</th><th>Block</th><th>Unit</th><th><span className="sr-only">Actions</span></th></tr>
							</thead>
							<tbody>
								{bookingEntries.map(([date, booking]) => (
									<tr key={date}>
										<td><strong>{date}</strong></td>
										<td>{booking.name}</td>
										<td>{booking.block}</td>
										<td>{booking.unit}</td>
										<td><button className="cancel-button" type="button" onClick={() => handleCancel(date)}>Cancel</button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</main>
	);
}

export default Admin;
