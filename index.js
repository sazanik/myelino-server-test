const Koa = require('koa');
const { koaBody } = require('koa-body');

const usersRouter = require('./router/users');
const authRouter = require('./router/auth');
const plansRouter = require('./router/plans');
const eventsRouter = require('./router/events');
const logger = require('./middlewares/logger');

const app = new Koa();

app.use(logger);

app
  .use(koaBody({ multipart: true }))
  .use(usersRouter.routes())
  .use(usersRouter.allowedMethods())
  .use(authRouter.routes())
  .use(authRouter.allowedMethods())
  .use(plansRouter.routes())
  .use(plansRouter.allowedMethods())
  .use(eventsRouter.routes())
  .use(eventsRouter.allowedMethods());

app.listen(3000, () => {
  console.log('Server started at port 3000');
});
