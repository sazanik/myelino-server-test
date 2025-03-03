const Router = require('@koa/router');

const authMiddleware = require('../middlewares/auth');
const { createEvent, updateEvent, deleteEvent, readEvents } = require('../db/storage');
const generateImage = require('../utils/generateImage');

const router = new Router({
  prefix: '/plans/:planId/events',
});

router.use(authMiddleware);

router.get('/', async (ctx) => {
  const planId = ctx.params.planId;
  const userId = ctx.state.user.id;

  ctx.assert(userId, 400, 'userId is required');
  ctx.assert(planId, 400, 'planId is required');

  const events = await readEvents(userId, planId);

  ctx.status = 200;
  ctx.body = events;
});

router.get('/:id', async (ctx) => {
  console.log('HERE');

  const planId = ctx.params.planId;
  const id = ctx.params.id;
  const userId = ctx.state.user.id;

  ctx.assert(userId, 400, 'userId is required');
  ctx.assert(planId, 400, 'planId is required');
  ctx.assert(id, 400, 'planId is required');

  console.log('HERE 2');

  const events = await readEvents(userId, planId, id);

  console.log(events);

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
  ctx.assert(ctx.state.user.id, 400, 'userId is required');
  ctx.assert(ctx.request.body.name, 400, 'name is required');
  ctx.assert(ctx.request.body.planId, 400, 'planId is required');
  ctx.assert(ctx.request.body.dtStart, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.dtEnd, 400, 'dtStart is required');
  ctx.assert(ctx.request.body.invitedPersonsCount, 400, 'invitedPersonsCount is required');
  ctx.assert(ctx.request.body.cost, 400, 'cost is required');

  const imageUrl = await generateImage();

  try {
    const createdEvent = await createEvent({
      ...ctx.request.body,
      userId: ctx.state.user.id,
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
