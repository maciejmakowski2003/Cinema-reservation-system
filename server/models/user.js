const mongoose = require("mongoose");
const { Schema } = mongoose;
const seatScheme = require("./seat");
const bcrypt = require("bcryptjs");

const priceValidator = {
  validator: function (value) {
    return value >= 0;
  },
  message: (props) =>
    `${props.value} is not a valid price. Please provide a price greater than or equal to 0.`,
};

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide user email address"],
    unique: [true, "User email address is already in use"],
    lowercase: [true, "User email address should be lowercase"],
    trim: [
      true,
      "User email address cannot have spaces at the beginning and at the end",
    ],
    minlength: [3, "User email address should contain at least 3 characters"],
    maxlength: [
      120,
      "User email address should contain at most 120 characters",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide user password"],
    trim: [
      true,
      "User password cannot have spaces at the beginning and at the end",
    ],
    minlength: [8, "User password must contain at least 8 characters"],
    maxlength: [120, "User password must contain at most 120 characters"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "moderator"],
      message: "{VALUE} is not supported",
    },
    default: "user",
  },
  cart: {
    showing_id: {
      type: Schema.Types.ObjectId,
      ref: "Showing",
      default: null,
    },
    seats: {
      type: [seatScheme],
      default: [],
    },
    total_price: {
      type: Number,
      required: true,
      validate: priceValidator,
      default: 0,
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
