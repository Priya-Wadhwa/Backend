const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'this-is-ultra-secret-@#$%^%$#@QSDFGT';

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  let validation = '';
  if (!email) validation += 'Email is required. ';
  if (!password) validation += 'Password is required. ';
  if (validation) {
    return res.status(400).json({ success: false, message: 'Validation Error: ' + validation });
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account does not exist' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password!' });
    }

    if (!user.status) {
      return res.status(403).json({ success: false, message: 'Account inactive!' });
    }

    const token = jwt.sign({ name: user.name, email: user.email }, SECRET, { expiresIn: '5h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      data: { user }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { _id, currentPassword, newPassword } = req.body;

  let validation = '';
  if (!_id) validation += 'ID is required. ';
  if (!currentPassword) validation += 'Current password is required. ';
  if (!newPassword) validation += 'New password is required. ';
  if (validation) {
    return res.status(400).json({ success: false, message: 'Validation Error: ' + validation });
  }

  try {
    const user = await User.findById(_id).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    const passwordMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid current password!' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Change Status
exports.changeStatus = async (req, res) => {
  const { _id, status } = req.body;

  let validation = '';
  if (!_id) validation += 'ID is required. ';
  if (typeof status === 'undefined') validation += 'Status is required. ';
  if (validation) {
    return res.status(400).json({ success: false, message: 'Validation Error: ' + validation });
  }

  try {
    const user = await User.findById(_id).exec();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    user.status = status;
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'User status updated!',
      data: { user: updatedUser }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
