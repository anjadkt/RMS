const crypto = require("crypto");
const AppError = require("../utils/AppError.js");

module.exports = (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    throw new AppError("Signature missing", 400);
  }

  const body = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(JSON.stringify(req.body));

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    throw new AppError("Invalid Signature!", 400);
  }

  next();
};
