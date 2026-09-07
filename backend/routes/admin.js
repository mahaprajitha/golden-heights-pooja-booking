const express = require("express");
const router = express.Router();
const { db, ref, remove } = require("../firebase");

const ADMIN_USER = "admin";
const ADMIN_PASS = "vinayagar123";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

router.delete("/cancel/:date", async (req, res) => {
  const { date } = req.params;
  await remove(ref(db, `bookings/${date}`));
  res.json({ message: "Booking cancelled" });
});

module.exports = router;
