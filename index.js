const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const qrRoutes = require("./routes/qrRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chefRoutes = require("./routes/chefRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173","https://msvrestaurant.vercel.app"], // Make sure this matches your frontend URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('./images'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err)); 

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Make `io` available in routes
app.set("socketio", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("", foodRoutes);
app.use("", qrRoutes);
app.use("", dashboardRoutes);
app.use("", orderRoutes);
app.use("/cart", cartRoutes);
app.use("", chefRoutes);
app.use("", supplierRoutes);
app.use("", paymentRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
