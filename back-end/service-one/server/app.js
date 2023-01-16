import express from "express";
import helmet from "helmet";
import router from "./controller/router";
import cors from "cors";
import compression from "compression";

module.exports = (config) => {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: true }));

  // user middleware
  app.use("/", router);

  // Define 'global' template variables here
  app.use(async (req, res, next) => {
    // To show the application name on the page
    res.locals.applicationName = config.applicationName;

    // Set up flash messaging
    if (!req.session.messages) {
      req.session.messages = [];
    }
    res.locals.messages = req.session.messages;
    return next();
  });

  app.use((err, req, res, next) => {
    res.status(500).send({ mess: config.applicationName });
  });

  return app;
};
