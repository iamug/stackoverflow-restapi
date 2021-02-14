const express = require("express");
const connectDB = require("./config/db");
const config = require("config");
const cors = require("cors");
const app = express();

//connect Database
connectDB();
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/questions", require("./routes/api/questions"));
app.use("/api/answers", require("./routes/api/answers"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
