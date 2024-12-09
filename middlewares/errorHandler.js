module.exports = async function errorHandler (ctx, next) {

  try {
    await next();
  } catch (err) {
    console.error(err);

    ctx.status = err.status;

    if (err.status >= 500) {
      ctx.body = 'Server error';
      return;
    }

    if (err.status >= 400) {
      ctx.body = `Forming request error: ${err.message}`;
    }

    // Add the necessary handlers below
  }
};
