/**
 * Logs given arguments to the standard output
 *
 * @returns {undefined}
 */

function log() {
  return console.log(new Date(), ...arguments)
}

module.exports = async function logger(ctx, next) {
  const start = Date.now();

  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    log({ method: ctx.method, url: ctx.url, body: ctx.body ?? null, duration })
  }
}
