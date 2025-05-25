const express = require('express');
const db = require('./config/db');
const seed = require('./config/seed');
const cors = require('cors');

const adminRouter = require('./routes/adminRoutes');
const clientRouter = require('./routes/clientRoutes');
const freelancerRouter = require('./routes/freelancerRoutes');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use('/freelancer', freelancerRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}....`);
});
