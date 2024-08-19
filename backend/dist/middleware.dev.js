"use strict";

var _require = require("./routes/config"),
    JWT_SECRET = _require.JWT_SECRET;

var jwt = require("jsonwebtoken");

var authMiddleware = function authMiddleware(req, res, next) {
  var authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      message: "inavlid authorization"
    });
  }

  var token = authHeader.split(' ')[1];

  try {
    var decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "middleware rejected"
    });
  }
};

module.exports = {
  authMiddleware: authMiddleware
};