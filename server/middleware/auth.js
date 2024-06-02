const AppError = require("../utils/error");
const { verifyToken } = require("../utils/token");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = bearer.split(" ")[1];

  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id);

    if (!user) {
      return next(new AppError("Unauthorized", 403));
    }

    req.user_id = payload.id;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
