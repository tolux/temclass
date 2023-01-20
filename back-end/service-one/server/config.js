import bunyan from "bunyan";

const loggers = {
  development: () =>
    bunyan.createLogger({ name: "development", level: "debug" }),
  production: () => bunyan.createLogger({ name: "production", level: "info" }),
  test: () => bunyan.createLogger({ name: "test", level: "fatal" }),
};

module.exports = {
  name: "service-one",
  version: "1.0.0",
  applicationName: "testapp",

  development: {
    log: loggers.development,
  },
  production: {
    log: loggers.production,
  },
};
