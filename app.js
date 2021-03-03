const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ limit: "50mb", extended: true }));
app.get("/api", (req, res) => res.send("API Running"));

app.use(cors());

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/category", require("./routes/api/category"));
app.use("/api/product", require("./routes/api/product"));
// Define Storage
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
