const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB URI (replace with your actual URI)
const MONGO_URI = 'mongodb://localhost:27017/your-db-name'; // or use env variable

// Define the User Schema and Model
const userSchema = new mongoose.Schema({
  autoId: Number,
  name: String,
  email: String,
  password: String,
  userType: Number
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // 2. Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' }).exec();

    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync('123', 10);

      const admin = new User({
        autoId: 1,
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        userType: 1
      });

      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    // 3. Close the connection
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
  }
}

createAdminUser();
