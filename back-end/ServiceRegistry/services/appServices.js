import express from "express";
import ServiceRegistry from "./ServiceRegistry";
import semver from "semver";

const service = express();

module.exports = (config) => {
  const log = config.log();

  const serviceRegistry = new ServiceRegistry(log);

  // Add a request logging middleware in development mode
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  // to register a service
  service.put(
    "/register/:servicename/:serviceversion/:serviceport",
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params;
      const serviceip = req.connection.remoteAddress.includes("::")
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const servicekey = serviceRegistry.registry(
        servicename,
        serviceversion,
        serviceip,
        serviceport
      );
      return res.json({ result: servicekey });

      // eslint-disable-next-line comma-dangle
    }
  );

  // to delete a service//
  service.delete(
    "/register/:servicename/:serviceversion/:serviceport",
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params;
      const serviceip = req.connection.remoteAddress.includes("::")
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const servicekey = serviceRegistry.unregistry(
        servicename,
        serviceversion,
        serviceip,
        serviceport
      );
      return res.json({ result: servicekey });
      // eslint-disable-next-line comma-dangle
    }
  );

  // to get a service//
  service.get("/find/:servicename/:serviceversion", (req, res) => {
    const { servicename, serviceversion } = req.params;
    const svc = serviceRegistry.get(servicename, serviceversion);
    if (!svc) return res.status(404).json({ result: "service not found" });
    return res.json(svc);
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });

  return service;
};
