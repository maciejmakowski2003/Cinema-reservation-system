const { Router } = require("express");
const {
  signup,
  login,
  updatePassword,
  getCart,
  addToCart,
  getUserData,
} = require("../controllers/user");
const { authenticate } = require("../middleware/auth");
const router = Router();
const API_ROUTE = "/users";

router.post(`${API_ROUTE}/signup`, signup);
router.post(`${API_ROUTE}/login`, login);
router.get(`${API_ROUTE}/data`, authenticate, getUserData);
router.patch(`${API_ROUTE}/update-password`, authenticate, updatePassword);
router.get(`${API_ROUTE}/cart`, authenticate, getCart);
router.post(`${API_ROUTE}/cart`, authenticate, addToCart);

module.exports = router;
