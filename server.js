const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const goodsRoutes = require('./routes/goodsRoutes');
const dlRoutes = require('./routes/dlroutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://delivery-vercel-mnkl.vercel.app',
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is live on Render');
});

// MongoDB connection
const mongoURI = process.env.MONGO_URL;

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// API routes
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/dl', dlRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Socket.IO setup
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('driverLocation', (data) => {
    socket.broadcast.emit('updateDriverLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
