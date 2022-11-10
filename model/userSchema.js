const { Schema, model } = require("mongoose");
const validator = require("validator");
const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is already present in Database"],
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: { type: String, required: true },
  token: { type: String },
});
const userDetails = model("userDetail", userSchema);
module.exports = userDetails;
