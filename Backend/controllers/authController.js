const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password , role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed , role });

    const token = jwt.sign({ id: user._id , role: user.role , name: user.name }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id , role: user.role , name: user.name}, JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
};  
exports.UserInfo = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (user) {
        res.json({id:req.user.id, name: user.name, email: user.email, role: user.role}); 
        console.log(user.name)
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully", deletedUser: user });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
