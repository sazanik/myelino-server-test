const Router = require('@koa/router');

const authMiddleware = require('../middlewares/auth');
const { createPlan, deletePlan, readPlans } = require('../db/storage');

const router = new Router({
  prefix: '/plans',
});

router.use(authMiddleware);

router.get('/', async (ctx) => {
  const userId = ctx.state.user.id;

  ctx.assert(userId, 400, 'userId is required');

  const plans = await readPlans(userId);

  ctx.status = 200;
  ctx.body = plans;
});

router.get('/:id', async (ctx) => {
  const userId = ctx.state.user.id;
  const id = ctx.params.id;

  ctx.assert(id, 400, 'id is required');
  ctx.assert(userId, 400, 'userId is required');
  const plans = await readPlans(userId, id);

  ctx.status = 200;
  ctx.body = plans;
});

router.post('/', async (ctx) => {
  ctx.assert(ctx.request.body.name, 400, 'name is required');
  ctx.assert(ctx.request.body.userId, 400, 'userId is required');

  try {
    const createdPlan = await createPlan({ ...ctx.request.body });

    ctx.body = createdPlan;
    ctx.status = 201;
  } catch (err) {
    ctx.status = 409;
    ctx.message = err.message;
  }

});

router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.assert(id, 400, 'id is required');
  await deletePlan(id);

  ctx.status = 204;
});

module.exports = router;
