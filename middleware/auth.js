const jwt = require("jsonwebtoken");
const jwt_secret=process.env.jwt_secret
const pool = require('../DB/connectDb');

module.exports = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, jwt_secret);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];
    if (!user) throw new Error('Invalid Credentials');
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: "Please authenticate" });
  }
};
