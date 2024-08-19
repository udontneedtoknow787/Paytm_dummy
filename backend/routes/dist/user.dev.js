"use strict";

var express = require("express");

var router = express.Router();

var zod = require('zod');

var jwt = require('jsonwebtoken');

var _require = require('../db'),
    User = _require.User,
    Account = _require.Account;

var _require2 = require('./config'),
    JWT_SECRET = _require2.JWT_SECRET;

var _require3 = require('../middleware'),
    authMiddleware = _require3.authMiddleware;

var signupSchema = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string()
});
var signinSchema = zod.object({
  username: zod.string(),
  password: zod.string()
});
router.post('/signup', function _callee(req, res) {
  var body, _signupSchema$safePar, success, user, dbUser, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          body = req.body;
          _signupSchema$safePar = signupSchema.safeParse(body), success = _signupSchema$safePar.success; // use curly brace cz its return an object, so use result.succes without curly braces

          if (success) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.json({
            message: "Invalid inputs. PLease inter valid data."
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            username: body.username
          }));

        case 6:
          user = _context.sent;

          if (!user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            message: "Username already taken. Please try again with diffrent username."
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(User.create({
            username: body.username,
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password
          }));

        case 11:
          dbUser = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(Account.create({
            userId: dbUser._id,
            balance: (1 + Math.random()) * 1000
          }));

        case 14:
          token = jwt.sign({
            userId: dbUser._id
          }, JWT_SECRET);
          return _context.abrupt("return", res.json({
            message: "User created Succesfully.",
            token: token
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/signin', function _callee2(req, res) {
  var body, _signinSchema$safePar, success, user, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = req.body;
          _signinSchema$safePar = signinSchema.safeParse(body), success = _signinSchema$safePar.success;

          if (success) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(411).json({
            message: "Error while loging in"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            username: body.username,
            password: body.password
          }));

        case 6:
          user = _context2.sent;

          if (!user) {
            _context2.next = 12;
            break;
          }

          token = jwt.sign({
            userId: user._id
          }, JWT_SECRET);
          return _context2.abrupt("return", res.status(200).json({
            token: token
          }));

        case 12:
          return _context2.abrupt("return", res.status(411).json({
            message: "Error while logging in"
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional()
});
router.put("/", authMiddleware, function _callee3(req, res) {
  var _updateBody$safeParse, success;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _updateBody$safeParse = updateBody.safeParse(req.body), success = _updateBody$safeParse.success;

          if (!success) {
            res.status(411).json({
              message: "Error while updating information"
            });
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(User.updateOne(req.body, {
            _id: req.userId
          }));

        case 4:
          res.json({
            message: "Updated successfully"
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;