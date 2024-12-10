const log =  (...params) => {
  return console.log(new Date(), ...params)
};

module.exports = async function logger(ctx, next) {
  const start = Date.now();

  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    log({ method: ctx.method, url: ctx.url, body: ctx.request?.body, headers: ctx.headers, duration })
  }
}
