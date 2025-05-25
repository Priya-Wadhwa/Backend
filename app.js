const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db'); // Now properly imported

const adminRouter = require('./routes/adminRoutes');
const clientRouter = require('./routes/clientRoutes');
const freelancerRouter = require('./routes/freelancerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/freelancer', freelancerRouter);

// Wait for DB to connect before starting server
mongoose.connection.once('open', () => {
  console.log('🟢 MongoDB connection open');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
