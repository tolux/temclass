import bunyan from "bunyan";

const loggers = {
  development: () =>
    bunyan.createLogger({ name: "development", level: "debug" }),
  production: () => bunyan.createLogger({ name: "production", level: "info" }),
  test: () => bunyan.createLogger({ name: "test", level: "fatal" }),
};

module.exports = {
  name: "mainapp",
  version: "1.00",
  applicationName: "testapp",

  development: {
    serviceRegistryUrl: "http://localhost:4000",
    serviceVersionIdentifier: "1.x.x",
    log: loggers.development,
  },
  production: {
    serviceRegistryUrl: "http://localhost:4000",

    serviceVersionIdentifier: "1.x.x",
    log: loggers.production,
  },
};
