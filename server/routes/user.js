const {Router} = require('express');
const {signup, login, updatePassword, getCart, addToCart} = require('../controllers/user');
const {authenticate, authorize} = require('../middleware/auth');
const router = Router();
const API = '/users'

router.post('/users/signup', signup);
router.post('/users/login', login);
router.patch(API + '/update-password', authenticate, updatePassword);
router.get(API + '/cart', authenticate, getCart);
router.post(API + '/cart', authenticate, addToCart); 

module.exports = router;