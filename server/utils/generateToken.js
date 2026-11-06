const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token for authenticated session
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

module.exports = generateToken;
