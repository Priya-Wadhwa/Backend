const mongoose = require('mongoose');
const DB = 'mongodb://127.0.0.1:27017/devhunt';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connected'))
  .catch((err) => console.log('❌ DB connection error:', err));

module.exports = mongoose;
