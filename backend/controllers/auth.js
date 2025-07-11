const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, address, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !address || !role) {
        return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Check if user already exists (more user-friendly than relying on DB error)
    const [existingUsers] = await db.query('SELECT email FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        return next(new ErrorResponse('User with this email already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const [result] = await db.query(
        'INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, address, role]
    );

    const userId = result.insertId;

    // Create token
    const token = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(201).json({
        success: true,
        token,
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for user and password
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        success: true,
        token,
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is set by the protect middleware
    res.status(200).json({ success: true, data: req.user });
});