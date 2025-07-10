import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { error as _error, success } from '../utils/apiResponse.js';

const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return _error(res, 'Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role: role || 'user'
    });

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return success(res, { token, user }, 'User registered successfully', 201);
  } catch (error) {
    return _error(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return _error(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return _error(res, 'Invalid credentials', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return success(res, { token, user }, 'Login successful');
  } catch (error) {
    return _error(res, error.message);
  }
};

export default { register, login };