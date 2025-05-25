const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db'); // this ensures DB connects
const seed = require('./config/seed');

const adminRouter = require('./routes/adminRoutes');
const clientRouter = require('./routes/clientRoutes');
const freelancerRouter = require('./routes/freelancerRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Don't forget to parse JSON
app.use(express.static('./public'));

app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/freelancer', freelancerRouter);

// Wait for MongoDB connection before starting the server
mongoose.connection.once('open', () => {
  console.log('🟢 MongoDB connection open');

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
