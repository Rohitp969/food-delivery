const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/UserModels");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { signToken, publicUser } = require("../middleware/auth");
const { validationError } = require("../utils/validate");
const {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
} = require("../utils/sendEmail");

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;
const OTP_FIELDS = "+otp +otpPurpose +otpExpires +otpAttempts +otpLastSent";

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

// Seconds the user still has to wait before another OTP can be sent
const cooldownLeft = (user) => {
  if (!user.otpLastSent) return 0;
  const elapsed = (Date.now() - user.otpLastSent.getTime()) / 1000;
  return Math.max(0, Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed));
};

// Emails a fresh OTP first, then stores its hash, so a failed email never
// leaves the user with a code they didn't receive
const issueOtp = async (user, purpose) => {
  const otp = crypto.randomInt(100000, 1000000).toString();

  await sendOtpEmail({
    to: user.email,
    name: user.name,
    otp,
    purpose,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  });

  user.otp = hashOtp(otp);
  user.otpPurpose = purpose;
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  user.otpAttempts = 0;
  user.otpLastSent = new Date();
  await user.save();
};

// Returns an error message if the OTP can't be accepted, otherwise null
const checkOtp = async (user, otp, purpose) => {
  if (!user.otp || user.otpPurpose !== purpose) {
    return "No active OTP. Please request a new one.";
  }
  if (user.otpExpires < new Date()) {
    return "OTP has expired. Please request a new one.";
  }
  if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
    return "Too many wrong attempts. Please request a new OTP.";
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(user.otp, "hex"),
    Buffer.from(hashOtp(otp), "hex"),
  );
  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    const left = OTP_MAX_ATTEMPTS - user.otpAttempts;
    return left > 0
      ? `Invalid OTP. ${left} attempt${left === 1 ? "" : "s"} left.`
      : "Too many wrong attempts. Please request a new OTP.";
  }

  return null;
};

const clearOtp = (user) => {
  user.otp = undefined;
  user.otpPurpose = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
};

const loginPayload = (user) => ({
  success: true,
  authToken: signToken(user),
  role: user.role,
  name: user.name,
  email: user.email,
  user: publicUser(user),
});

router.post(
  "/createUser",
  [
    body("name", "Name must be at least 5 characters").trim().isLength({ min: 5 }),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    body("email", "Please enter a valid email").trim().isEmail(),
    body("location", "Address is required").trim().notEmpty(),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(req.body.password, salt);
    try {
      let user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);

      if (user && user.isVerified !== false) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists. Please login.",
        });
      }

      // A previous signup that was never verified gets replaced
      if (!user) {
        user = new User({ email: req.body.email, role: "user" });
      }
      user.name = req.body.name;
      user.password = securePassword;
      user.location = req.body.location;
      user.isVerified = false;
      await user.validate();

      if (cooldownLeft(user) > 0) {
        await user.save();
        return res.json({
          success: true,
          email: user.email,
          message: "We already sent an OTP to your email. Please check your inbox.",
        });
      }

      await issueOtp(user, "verify");
      res.json({
        success: true,
        email: user.email,
        message: "OTP sent to your email",
      });
    } catch (error) {
      console.error("Signup verification email failed:", error);
      res.status(500).json({
        success: false,
        message: "Could not send verification email. Please try again.",
      });
    }
  },
);

router.post(
  "/verifyEmail",
  [
    body("email", "Please enter a valid email").trim().isEmail(),
    body("otp", "OTP must be 6 digits").trim().isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    try {
      const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
      if (!user) {
        return res.status(400).json({ success: false, message: "Account not found" });
      }
      if (user.isVerified !== false) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified. Please login.",
        });
      }

      const otpError = await checkOtp(user, req.body.otp, "verify");
      if (otpError) {
        return res.status(400).json({ success: false, message: otpError });
      }

      user.isVerified = true;
      clearOtp(user);
      await user.save();

      sendWelcomeEmail({ to: user.email, name: user.name }).catch((err) =>
        console.log("Welcome email failed:", err.message),
      );

      return res.json(loginPayload(user));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
);

// Shared by /resendOtp and /forgotPassword
const sendOtpForPurpose = async (req, res, purpose) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }
    if (purpose === "verify" && user.isVerified !== false) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please login.",
      });
    }

    const wait = cooldownLeft(user);
    if (wait > 0) {
      return res.status(429).json({
        success: false,
        retryAfter: wait,
        message: `Please wait ${wait}s before requesting a new OTP`,
      });
    }

    await issueOtp(user, purpose);
    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("OTP email delivery failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send OTP email. Please try again.",
    });
  }
};

router.post(
  "/resendOtp",
  [
    body("email", "Please enter a valid email").trim().isEmail(),
    body("purpose", "Invalid OTP purpose").isIn(["verify", "reset"]),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;
    return sendOtpForPurpose(req, res, req.body.purpose);
  },
);

router.post(
  "/forgotPassword",
  [body("email", "Please enter a valid email").trim().isEmail()],
  async (req, res) => {
    if (validationError(req, res)) return;
    return sendOtpForPurpose(req, res, "reset");
  },
);

router.post(
  "/verifyResetOtp",
  [
    body("email", "Please enter a valid email").trim().isEmail(),
    body("otp", "OTP must be 6 digits").trim().isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    try {
      const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
      if (!user) {
        return res.status(400).json({ success: false, message: "Account not found" });
      }

      const otpError = await checkOtp(user, req.body.otp, "reset");
      if (otpError) {
        return res.status(400).json({ success: false, message: otpError });
      }

      return res.json({ success: true, message: "Code verified" });
    } catch (error) {
      console.error("Password reset OTP verification failed:", error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
);

router.post(
  "/resetPassword",
  [
    body("email", "Please enter a valid email").trim().isEmail(),
    body("otp", "OTP must be 6 digits").trim().isLength({ min: 6, max: 6 }).isNumeric(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    try {
      const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
      if (!user) {
        return res.status(400).json({ success: false, message: "Account not found" });
      }

      const otpError = await checkOtp(user, req.body.otp, "reset");
      if (otpError) {
        return res.status(400).json({ success: false, message: otpError });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      // Receiving the OTP proves the user owns this email
      user.isVerified = true;
      clearOtp(user);
      await user.save();

      sendPasswordChangedEmail({ to: user.email, name: user.name }).catch((err) =>
        console.log("Password changed email failed:", err.message),
      );

      return res.json({
        success: true,
        message: "Password reset successful. Please login.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
);

router.post(
  "/loginUser",
  [
    body("email").trim().isEmail(),
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
      const userData = await User.findOne({ email }).select(OTP_FIELDS);
      if (!userData) {
        return res.status(400).json({
          success: false,
          errors: "Incorrect Credentials",
          message: "Email or password is incorrect",
        });
      }
      const pwdCompare = await bcrypt.compare(
        req.body.password,
        userData.password,
      );
      if (!pwdCompare) {
        return res.status(400).json({
          success: false,
          message: "Email or password is incorrect",
          errors: "Incorrect Credentials",
        });
      }

      if (userData.isVerified === false) {
        // Send a fresh code so the verify screen always has one to use
        if (cooldownLeft(userData) === 0) {
          await issueOtp(userData, "verify").catch((err) =>
            console.log("Verification OTP failed:", err.message),
          );
        }
        return res.status(403).json({
          success: false,
          needsVerification: true,
          email: userData.email,
          message: "Please verify your email first. We've sent an OTP to your inbox.",
        });
      }

      return res.json(loginPayload(userData));

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
      });
    }
  },
);

module.exports = router;
