const Koa = require('koa');
const { koaBody } = require('koa-body');

const plansRouter = require('./router/plans');
const eventsRouter = require('./router/events');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = new Koa();

app.use(logger);
app.use(errorHandler);

app
  .use(koaBody({ multipart: true }))
  .use(plansRouter.routes())
  .use(plansRouter.allowedMethods())
  .use(eventsRouter.routes())
  .use(eventsRouter.allowedMethods());

app.listen(3000, () => {
  console.log('Server started at port 3000');
});
