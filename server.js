const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const goodsRoutes = require('./routes/goodsRoutes');
const dlRoutes= require('./routes/dlroutes')
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URL || "mongodb+srv://gvanshika528:12345@cluster0.n8byyoh.mongodb.net/goodsDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/dl', dlRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});
// server.js
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('driverLocation', (data) => {
    // broadcast driver location to all clients (or specific customer)
    socket.broadcast.emit('updateDriverLocation', data);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
