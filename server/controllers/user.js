const User = require("../models/user");
const Showing = require("../models/showing");
const Movie = require("../models/movie");
const Hall = require("../models/hall");
const UserUtils = require("../utils/user");
const { getUserIdFromToken } = require("../utils/token");
const userUtils = new UserUtils(User, Showing, Movie, Hall);

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userUtils.signup(email, password);

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(error.status || 400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userUtils.login(email, password);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { token } = await userUtils.updatePassword(
      req.user_id,
      oldPassword,
      newPassword
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

const getUserData = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const userData = await userUtils.getUserData(userId);
  try {
    res.status(200).json(userData);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await userUtils.getCart(req.user_id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { showing_id, seats } = req.body;
    await userUtils.addToCart(req.user_id, showing_id, seats);

    res.status(200).json({ message: "Seats added to cart" });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  updatePassword,
  getCart,
  addToCart,
  getUserData,
};
