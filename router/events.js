const Router = require('@koa/router');

const { createEvent, updateEvent, deleteEvent, readEvents } = require('../config/storage');
const generateImage = require('../utils/generateImage');

const router = new Router({
  prefix: '/plans/:planId/events',
});

router.get('/', async (ctx) => {
  const planId = ctx.params.planId;
  const userId = ctx.query.userId;

  ctx.assert(userId, 400, 'userId is required');
  ctx.assert(planId, 400, 'planId is required');

  const events = await readEvents(userId, planId);

  ctx.status = 200;
  ctx.body = events;
});

router.get('/:id', async (ctx) => {
  const planId = ctx.params.planId;
  const id = ctx.params.id;
  const userId = ctx.query.userId;

  ctx.assert(userId, 400, 'userId is required');
  ctx.assert(planId, 400, 'planId is required');
  ctx.assert(id, 400, 'planId is required');

  const events = await readEvents(userId, planId, id);

  ctx.status = 200;
  ctx.body = events;
});

router.patch('/:id', async (ctx) => {
  const id = ctx.params.id;

  ctx.assert(id, 400, 'id is required');
  ctx.assert(ctx.request.body.name, 400, 'name is required');
  ctx.assert(ctx.request.body.userId, 400, 'userId is required');
  ctx.assert(ctx.request.body.planId, 400, 'planId is required');
  ctx.assert(ctx.request.body.dtStart, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.dtEnd, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.invitedPersonsCount, 400, 'invitedPersonsCount is required');
  ctx.assert(ctx.request.body.cost, 400, 'cost is required');
  ctx.assert(ctx.request.body.imageUrl, 400, 'imageUrl is required');

  const updatedEvent = await updateEvent(id, {
    ...ctx.request.body,
  });

  ctx.status = 200;
  ctx.body = updatedEvent;
});

router.post('/', async (ctx) => {
  ctx.assert(ctx.request.body.name, 400, 'name is required');
  ctx.assert(ctx.request.body.userId, 400, 'userId is required');
  ctx.assert(ctx.request.body.planId, 400, 'planId is required');
  ctx.assert(ctx.request.body.dtStart, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.dtEnd, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.invitedPersonsCount, 400, 'invitedPersonsCount is required');
  ctx.assert(ctx.request.body.cost, 400, 'cost is required');

  const imageUrl = await generateImage();

  try {
    const createdEvent = await createEvent({
      ...ctx.request.body,
      imageUrl,
    });

    ctx.body = createdEvent;
    ctx.status = 201;
  } catch (err) {
    ctx.status = 409;
    ctx.message = err.message;
  }
});

router.delete('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.assert(id, 400, 'id is required');
  await deleteEvent(id);

  ctx.status = 204;
});

module.exports = router;
