const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const { setUpAccountFromEntity } = require("./utils/adminEmail");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ limit: "50mb", extended: true }));
app.get("/api", (req, res) => res.send("API Running"));

app.use(cors());

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/organization", require("./routes/api/organization"));
app.use("/api/email", require("./routes/api/email"));
app.use("/api/schema-template", require("./routes/api/schema-template"));
app.use("/api/email-template", require("./routes/api/email-template"));
app.use("/api/document-template", require("./routes/api/document-template"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/document", require("./routes/api/document"));
app.use("/api/logs", require("./routes/api/logs"));
// app.use("/api/certificates", require("./routes/api/cer
// Define Storage
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
