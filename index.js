const Koa = require('koa');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const { resolve } = require('node:path');

const usersRouter = require('./router/users');
const authRouter = require('./router/auth');
const plansRouter = require('./router/plans');
const eventsRouter = require('./router/events');
const loggerMiddleware = require('./middlewares/logger');

const app = new Koa();

const staticDir = resolve(__dirname, './data/images');

app.use(serve(staticDir));
app.use(loggerMiddleware);

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
