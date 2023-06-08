const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Input Validation
const auth = (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    phone: Joi.string().pattern(/^[0-9]+/).length(10).required(),});

  const { error }  = userSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  next();
};

// Verify Token 
const userVerify = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { auth, userVerify };
