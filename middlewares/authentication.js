const { handleValidateToken } = require("../services/authentication");

const checkAuthCookie = (cookieName) => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = handleValidateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      console.error("Invalid token:", error.message); // Log the error
      req.user = null;
    }
    return next();
  };
};
module.exports = {
  checkAuthCookie,
};
