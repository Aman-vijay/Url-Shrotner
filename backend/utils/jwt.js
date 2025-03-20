const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
if (process.env.NODE_ENV !== "production") {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
}

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
        return null;
        }
        return decoded;
    });
    }

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
}

module.exports = { generateToken, verifyToken, verifyTokenMiddleware };
