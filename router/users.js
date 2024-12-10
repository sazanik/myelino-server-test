const Router = require('@koa/router');

const { createUser, readUser, deleteUser, findUserByUsernameOrEmail } = require('../db/storage');

const router = new Router({
  prefix: '/users',
});

// get a user by username or email
router.get('/', async (ctx) => {
  const identifier = ctx.body.identifier

  const user = await findUserByUsernameOrEmail(identifier);

  ctx.status = 200;
  ctx.body = user;
})

// get a user by id
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;

  ctx.assert(id, 400, 'id is required');
  const plans = await readUser(id);

  ctx.status = 200;
  ctx.body = plans;
});



router.post('/', async (ctx) => {
  ctx.assert(ctx.request.body.username, 400, 'username is required');
  ctx.assert(ctx.request.body.email, 400, 'email is required');
  ctx.assert(ctx.request.body.password, 400, 'password is required');

  try {
    const createdUser = await createUser({ ...ctx.request.body });

    ctx.body = createdUser;
    ctx.status = 201;
  } catch (err) {
    ctx.status = 409;
    ctx.message = err.message;
  }

});

router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.assert(id, 400, 'id is required');
  await deleteUser(id);

  ctx.status = 204;
});

module.exports = router;
