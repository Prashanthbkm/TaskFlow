import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken 
} from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register
router.post('/register', validateRegister, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id
    });

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    };

    return successResponse(res, {
      user: userResponse,
      accessToken,
      refreshToken
    }, 'Registration successful', 201);

  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, error);
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id
    });

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    };

    return successResponse(res, {
      user: userResponse,
      accessToken,
      refreshToken
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, error);
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in DB
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Revoke old token and save new one
    storedToken.isRevoked = true;
    await storedToken.save();

    await RefreshToken.create({
      token: newRefreshToken,
      userId: decoded.userId
    });

    return successResponse(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }, 'Tokens refreshed');

  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(res, error, 401);
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke refresh token
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken, userId: req.user._id },
        { isRevoked: true }
      );
    }

    return successResponse(res, null, 'Logged out successfully');

  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, error);
  }
});

// Get Profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    return successResponse(res, {
      user: req.user
    }, 'Profile fetched successfully');

  } catch (error) {
    console.error('Profile error:', error);
    return errorResponse(res, error);
  }
});

export default router;