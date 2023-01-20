import express from "express";
import router from "./controller/router";
import cors from "cors";
import compression from "compression";
import ServiceOne from "../services/serviceone";
import config from "./config";

const Env = [process.env.NODE_ENV || "development"];

const mainConfig = config[Env];

const serviceone = new ServiceOne(mainConfig);

module.exports = (config) => {
  const app = express();
  app.use(express.json());
  app.use(compression());
  app.use(cors({ origin: true }));

  //   user middleware
  app.use("/", router({ serviceone }));

  app.use((err, req, res, next) => {
    res.status(500).send({ mess: config.applicationName });
  });

  return app;
};
