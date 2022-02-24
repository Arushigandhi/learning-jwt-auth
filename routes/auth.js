const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

//signup route
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const { password, email } = req.body;
    //validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(password, email);

    //validate if user already exists
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists rip" }] });
    }

    const hashedPass = await bcrypt.hash(password, 8);

    users.push({
      email: email,
      password: hashedPass,
    });

    const token = await JWT.sign({ email }, "dummyapparushigandhi", {
      expiresIn: 30000,
    });

    res.json({
      token,
    });
  }
);

//login route
router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });
  if (!user) {
    return res
      .status(400)
      .json({ errors: [{ msg: "User doesn't exist rip, signup please" }] });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: "Invalid password" }] });
  }

  const token = await JWT.sign({ email }, "dummyapparushigandhi", {
    expiresIn: 30000,
  });

  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
