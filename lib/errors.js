const Sentry = require("@sentry/node");
require("@sentry/tracing");

let sentry;

if (process.env.NODE_ENV == "production") {
  const SENTRY_DSN = process.env.SENTRY_DSN;
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
    sentry = Sentry;
  }

  process.on("unhandledRejection", (reason, _promise) => {
    console.error("unhandledRejection", reason);
    if (sentry) {
      Sentry.captureException(new Error(reason.toString()));
    }
  });

  process.on("uncaughtException", (err) => {
    console.error("uncaughtException", err.message);
    if (sentry) {
      Sentry.captureException(err);
    }
  });
}

module.exports.sentry = sentry;