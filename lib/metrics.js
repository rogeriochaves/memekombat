const prometheus = require("prom-client");

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const register = prometheus.register;
collectDefaultMetrics({ register });

module.exports = {
  register,
};
