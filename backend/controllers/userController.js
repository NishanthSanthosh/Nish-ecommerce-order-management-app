const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");

const buildUserPayload = async (body, { requirePassword = false } = {}) => {
  const {
    name,
    email,
    phone,
    address,
    role,
    status,
    createdBy,
    password,
  } = body;

  const payload = {
    name,
    email,
    phone,
    address,
    role,
    status,
    createdBy,
  };

  if (password) {
    payload.passwordHash = await bcrypt.hash(password, 12);
  } else if (requirePassword) {
    throw new Error("Password is required");
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  return payload;
};

const withoutPasswordHash = (user) => {
  const userObject = user.toObject();
  delete userObject.passwordHash;
  return userObject;
};

const getUserErrorMessage = (err) => {
  if (err.code === 11000 && err.keyPattern?.email) {
    return "A user with this email already exists";
  }

  return err.message;
};

exports.createUser = async (req, res) => {
  try {
    const userPayload = await buildUserPayload(req.body, {
      requirePassword: true,
    });
    const newUser = await User.create(userPayload);

    res.status(201).json({
      status: "success",
      data: {
        user: withoutPasswordHash(newUser),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: getUserErrorMessage(err),
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userPayload = await buildUserPayload(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, userPayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: withoutPasswordHash(updatedUser),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: getUserErrorMessage(err),
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
