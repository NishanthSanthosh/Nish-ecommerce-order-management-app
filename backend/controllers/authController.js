const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const getJwtSecret = () => process.env.JWT_SECRET || "local-admin-auth-secret";

const createToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const withoutPasswordHash = (user) => {
  const userObject = user.toObject();
  delete userObject.passwordHash;
  return userObject;
};

const getAuthErrorMessage = (err) => {
  if (err.code === 11000 && err.keyPattern?.email) {
    return "A user with this email already exists";
  }

  return err.message;
};

const sendAuthResponse = (res, statusCode, user) => {
  const token = createToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: withoutPasswordHash(user),
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "fail",
        message: "Password is required",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      phone,
      address,
      passwordHash,
      role: "Admin",
      status: "Active",
      createdBy: "self",
    });

    sendAuthResponse(res, 201, newUser);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: getAuthErrorMessage(err),
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+passwordHash",
    );

    const isPasswordCorrect =
      user?.passwordHash && (await bcrypt.compare(password, user.passwordHash));

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        status: "fail",
        message: "This account is inactive. Please contact an admin.",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        status: "fail",
        message: "Only admin accounts can access this dashboard.",
      });
    }

    sendAuthResponse(res, 200, user);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: getAuthErrorMessage(err),
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });
    }

    if (user.status !== "Active" || user.role !== "Admin") {
      return res.status(403).json({
        status: "fail",
        message: "This account cannot access the admin dashboard",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: withoutPasswordHash(user),
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Your session is invalid or expired. Please log in again.",
    });
  }
};
