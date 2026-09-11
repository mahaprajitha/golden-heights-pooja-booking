const express = require("express");
const router = express.Router();
const { db, ref, set, get } = require("../firebase");

router.post("/", async (req, res) => {
  const { date, name, block, unit } = req.body;
  
  // Validate date is within 48-day window: Sep 14 - Oct 31, 2026
  const minDate = "2026-09-14";
  const maxDate = "2026-10-31";
  if (date < minDate || date > maxDate) {
    return res.status(400).json({ message: "Bookings are available from September 14 to October 31, 2026." });
  }
  
  // Check if date is already booked
  const bookingRef = ref(db, `bookings/${date}`);
  const snapshot = await get(bookingRef);
  if (snapshot.exists()) {
    return res.status(400).json({ message: "Date already booked" });
  }

  // Check if this unit (block-unit) is already booked
  const allBookingsRef = ref(db, "bookings");
  const allBookingsSnapshot = await get(allBookingsRef);
  
  if (allBookingsSnapshot.exists()) {
    const allBookings = allBookingsSnapshot.val();
    for (const existingBooking of Object.values(allBookings)) {
      if (existingBooking.block === block && existingBooking.unit === unit) {
        return res.status(400).json({ message: `Unit ${block}-${unit} is already booked for a different date.` });
      }
    }
  }

  await set(bookingRef, { name, block, unit });
  res.json({ message: "Booking successful" });
});

router.get("/", async (req, res) => {
  const snapshot = await get(ref(db, "bookings"));
  res.json(snapshot.val() || {});
});

module.exports = router;
