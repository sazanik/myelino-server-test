const Router = require('@koa/router');

const { createPlan, deletePlan, createEvent } = require('../config/storage');
const generateImage = require('../utils/generateImage');

const router = new Router({
  prefix: '/plans/:id/events',
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
  ctx.assert(ctx.request.body.dtStart, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.dtEnd, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.invitedPersonsCount, 400, 'invitedPersonsCount is required');
  ctx.assert(ctx.request.body.cost, 400, 'cost is required');

  const imageUrl = await generateImage();

  const newEvent = {
    ...ctx.request.body,
    imageUrl,
  };

  await createEvent(newEvent);

  ctx.status = 201;
});

router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.assert(id, 400, 'id is required');
  await deletePlan(id);

  ctx.status = 204;
});

module.exports = router;
