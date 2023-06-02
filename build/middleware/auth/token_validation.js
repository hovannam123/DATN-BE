"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var dotenv = _interopRequireWildcard(require("dotenv"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
dotenv.config();
var checkToken = function checkToken(req, res, next) {
  var token = req.get("authorization");
  if (token) {
    token = token.slice(7);
    _jsonwebtoken["default"].verify(token, process.env.JWT_KEY, function (err, decode) {
      if (err) {
        return res.json({
          message: "Invalid token"
        });
      } else {
        req.data = decode.data;
        // console.log("decodeeeeeeeeeeeeeeee:" + decode.data.role_id)
        next();
      }
    });
  } else {
    return res.json({
      message: "Access denied!"
    });
  }
};
var userPermit = function userPermit(req, res, next) {
  var role_id = req.data.role_id;
  if (role_id === 1 || role_id === 2) {
    next();
  } else {
    return res.json({
      message: "Permition denied!"
    });
  }
};
var adminPermit = function adminPermit(req, res, next) {
  var role_id = req.data.role_id;
  if (role_id === 2) {
    next();
  } else {
    return res.json({
      message: "Permition denied!"
    });
  }
};
module.exports = {
  checkToken: checkToken,
  userPermit: userPermit,
  adminPermit: adminPermit
};