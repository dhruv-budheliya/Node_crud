const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../module/index");

// Add User Data In Database
const addUser = async (request, response) => {
  try {
    const value = new User(request.body);

    if (!value) {
      res.status(409).json("All Input is required!");
    }

    const oldUser = await User.findOne({
      $or: [{ email: value.email }, { phone: value.phone }],
    });

    if (oldUser) {
      response
        .status(409)
        .json({ message: "User with same Email or Phone already exists " });
      return;
    }

    const encrypt = await bcrypt.hash(value.password, 10);

    const newUser = await User.create({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email.toLowerCase(),
      password: encrypt,
      phone: value.phone,
    });

    response.status(200).json({ 
      userID: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone
     });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

// User Login 
const userLogIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).json({
        errors: [{ msg: "Invalid credentials" }],
      });
    }
    
    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
    res.status(201).json({
      _id: user._id,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userPhone: user.phone,
      token,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get All User Data Into Database
const getUsers = async (request, response) => {
  try {
    const users = await User.find();
    response.status(200).json(users);
  } catch (error) {
    response.status(409).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Edit User
const editUser = async (req, res) => {
  const { password, ...edit } = req.body;

  try {
    if(password){
       edit.password = await bcrypt.hash(password, 10);
    }
    const editUser = await User.findByIdAndUpdate( { _id: req.params.id }, { $set: edit });
    res.status(200).json(editUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//Delete User From Database
const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User Delete Successfully!" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  addUser,
  userLogIn,
  getUsers,
  getUser,
  editUser,
  deleteUser,
};
