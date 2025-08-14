const express =   require("express");
const mongoose =   require("mongoose");
const cors =   require("cors");
const bodyParser =   require("body-parser");
const dotenv =   require("dotenv");
const inquiryRoutes =   require("./routes/inquiryRoutes.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/inquiries", inquiryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
