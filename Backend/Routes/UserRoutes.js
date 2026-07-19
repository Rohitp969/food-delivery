const express = require("express");
const router = express.Router();
const User = require("../models/UserModels");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const jwtSecret = "mySecretKey123";
const bcrypt = require("bcryptjs");

router.post(
  "/createUser",
  [
    body("name").isLength({ min: 5 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
    body("email", "Incorrect Email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        password: securePassword,
        email: req.body.email,
        location: req.body.location,
        role: "user",
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  },
);

router.post(
  "/loginUser",
  [
    body("email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const email = req.body.email;

    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          errors: "Incorrect Credentials",
        });
      }
      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password,
      );
      if (!pwdCompare) {
        return res.status(400).json({
          errors: "Incorrect Credentials",
        });
      }
      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret);

      return res.json({
        success: true,
        authToken,
        role: userData.role,
        name: userData.name,
        email: userData.email,
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
      });
    }
  },
);

module.exports = router;
