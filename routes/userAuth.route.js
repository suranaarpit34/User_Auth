const { Router } = require("express");
const userDetails = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userAuthRouter = Router();

// User Registration
userAuthRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await userDetails.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: newPassword,
      token: "",
    });
    res.json({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.json({ status: "ERROR", error: "Duplicate Email" });
  }
});

// Signin
userAuthRouter.post("/login", async (req, res) => {
  const user = await userDetails.findOne({
    email: req.body.email,
    // password: req.body.password,
  });
  if (!user) {
    return { status: "Error", error: "Invalid User" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        email: userDetails.email,
      },
      process.env.SECRET_KEY
    );
    await userDetails.findOneAndUpdate(
      { email: req.body.email },
      { token: token }
    );
    return res.json({ status: "OK", user: token });
  } else {
    return res.json({ status: "ERROR", user: false });
  }
});

module.exports = userAuthRouter;
