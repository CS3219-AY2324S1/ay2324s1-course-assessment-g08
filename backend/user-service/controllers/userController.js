const {
  addUserInDb,
  getUserByUsername,
  deleteUserByUsername,
  updateUserPassword,
} = require("../db/repositories/userRepo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    try {
      addUserInDb(username, hash);

      res.status(201).json({
        msg: "User created successfully",
      });
    } catch (e) {
      next(e);
    }
  });
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const dbUser = await getUserByUsername(username);

    if (!dbUser) {
      res.status(401).json({ msg: "Username or password is invalid" });
    }

    bcrypt
      .compare(password, dbUser.password)
      .then((isCorrect) => {
        if (!isCorrect) {
          return res
            .status(401)
            .json({ msg: "Username or password is invalid" });
        }

        const token = jwt.sign(
          {
            username: dbUser.username,
            isManager: dbUser.isManager,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token,
          username: dbUser.username,
          isManager: dbUser.isManager,
        });
      })
      .catch((e) => next(e));
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (await deleteUserByUsername(req.username)) {
      res.status(200).json({ msg: "User successfully deleted" });
    } else {
      res.status(404).json({ msg: "Delete failed, user not found" });
    }
  } catch (e) {
    next(e);
  }
};

const updatePassword = (req, res, next) => {
  const { newPassword } = req.body;
  const username = req.username;
  bcrypt.hash(newPassword, 10, async (err, hash) => {
    if (err) {
      return next(err);
    }

    try {
      if (await updateUserPassword(username, hash)) {
        return res.status(201).json({
          msg: "Update password successful",
        });
      }

      return res
        .status(404)
        .json({ msg: "Update password failed, user not found" });
    } catch (e) {
      next(e);
    }
  });
};

const success = (req, res, next) => {
  return res.send("success");
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  updatePassword,
  success,
};
