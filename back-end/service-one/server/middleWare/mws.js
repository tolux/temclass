import jwt from "jsonwebtoken";

exports.isAdmin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new Error());
    return res.status(401).json({ message: process.env.JWT_SECRET });
  }

  // verify the token
  const token = authorization;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "unable to verify token" });
    } else {
      next();
    }
  });
};
