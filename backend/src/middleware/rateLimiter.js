
const rateLimit = require('express-rate-limit');

const rateLimiter = (minute,limit) => {
  return rateLimit({
    windowMs : 1000 * 60 * minute,
    max : limit,
    message: {
      status : 429,
      message : 'Too many requests from this IP, please try again later.'
    }
  })
}

module.exports = rateLimiter