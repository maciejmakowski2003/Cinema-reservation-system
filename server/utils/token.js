const jwt = require("jsonwebtoken");
const AppError = require("./error");

const createToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(new AppError("Invalid token", 401));
      }
      resolve(payload);
    });
  });
};

const getUserIdFromToken = (token) => {
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  if (!decodedToken || !decodedToken.id) {
    return null;
  }
  return decodedToken.id;
};

module.exports = { createToken, verifyToken, getUserIdFromToken };
