const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { findUserByUsernameOrEmail, createUser } = require('../db/storage');
const { SECRET_KEY } = require('../constants/auth');

const router = new Router({
  prefix: '/auth',
});

router.post('/login', async (ctx) => {
  console.log('HERE');

  const { identifier, password } = ctx.request.body ?? {};

  const user = await findUserByUsernameOrEmail(identifier);

  if (!user) {
    ctx.status = 404;
    ctx.error = 'User not found';

    return;
  }



  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log(isPasswordValid);

  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.error = 'Password is incorrect';

    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '2h' },
  );

  ctx.body = { token };
});

router.post('/register', async (ctx) => {
  const { username, email, password } = ctx.request.body ?? {};

  ctx.assert(username, 400, 'username is required');
  ctx.assert(email, 400, 'email is required');
  ctx.assert(password, 400, 'password is required');

  const passwordHash = await bcrypt.hash(password, 10);

  const createdUser = await createUser({
    username,
    email,
    password: passwordHash,
  });

  const token = jwt.sign(
    { id: createdUser.id, username: createdUser.username },
    SECRET_KEY,
    { expiresIn: '2h' },
  );

  ctx.body = { token, user: createdUser };
});

router.post('/verify', async (ctx) => {
  const { token } = ctx.request.body ?? {}
  ctx.assert(token, 401, 'Token is required');

  try {
    const decodedUser = jwt.verify(token, SECRET_KEY);
    const foundUser = await findUserByUsernameOrEmail(decodedUser.username);

    ctx.body = foundUser ;
  } catch (error) {
    ctx.status = 401;
    ctx.erro = 'Invalid or expired token';
  }
});

module.exports = router;
