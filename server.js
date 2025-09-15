const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  

// Create app first
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// ✅ Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Ensure uploads folder exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ uploads folder created');
}

// Import routes AFTER app is defined
const sampleRoutes = require('./routes/sampleroutes'); 
const userRoutes = require('./routes/userRoutes');

// Routes
app.use('/samples', sampleRoutes);
app.use('/users', userRoutes); 

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/merobase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
