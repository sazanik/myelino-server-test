const Router = require('@koa/router');

const { createPlan, deletePlan } = require('../config/storage');

const router = new Router({
  prefix: '/plans',
});

router.get('/', async (ctx) => {
// TODO: add handler
});

router.get('/:id', async (ctx) => {
  // TODO: add handler
});

router.post('/', async (ctx) => {
  ctx.assert(ctx.request.body.name, 400, 'name is required');
  ctx.assert(ctx.request.body.userId, 400, 'userId is required');

  const newPlan = {
    ...ctx.request.body,
  };

  await createPlan(newPlan);

  ctx.status = 201;
});

router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.assert(id, 400, 'id is required');
  await deletePlan(id);

  ctx.status = 204;
})

module.exports = router;
