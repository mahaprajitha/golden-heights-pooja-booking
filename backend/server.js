const express = require("express");
const cors = require("cors");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint for keepalive
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/booking", bookingRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
