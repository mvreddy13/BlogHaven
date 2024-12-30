const JWT = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET_KEY;

const handleCreateTokenForUser = (user) => {
  if (!user || !user._id || !user.email) {
    throw new Error("Invalid user object");
  }
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  return JWT.sign(payload, secret);
};

const handleValidateToken = (token) => {
  try {
    return JWT.verify(token, secret);
  } catch (error) {
    return null; // Return null if validation fails
  }
};

module.exports = {
  handleCreateTokenForUser,
  handleValidateToken,
};
