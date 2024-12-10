const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants/auth');

async function authMiddleware (ctx, next) {
  if (!ctx.header.authorization) {
    ctx.status = 401;
    ctx.error = 'No token provided';
    return;
  }

  const token = ctx.header.authorization.replace('Bearer ', '');

  try {
    const decodedUser = jwt.verify(token, SECRET_KEY);
    ctx.state.user = decodedUser;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ctx.status = 401;
      ctx.error = 'Token expired';
      return;
    }

    ctx.status = 403;
    ctx.error = 'Invalid token';

    return;
  }

  await next();
}

module.exports = authMiddleware;
