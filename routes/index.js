const express = require("express");
const { auth, userVerify } = require("../middleware/auth");
 
const {
  getUser,
  addUser,
  getUsers,
  editUser,
  deleteUser,
  userLogIn,
} = require("../controller/index");

const router = express.Router();

router.post("/add",auth, addUser);
router.post("/login", userLogIn);
router.get("/list", userVerify, getUsers);
router.get("/:id", userVerify, getUser);
router.put("/editUser/:id", userVerify , editUser);
router.delete("/deleteUser/:id", userVerify, deleteUser);

module.exports = router;
