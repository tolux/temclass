import express from "express";
// import router from "./controller/router";
import cors from "cors";
import compression from "compression";

module.exports = (config) => {
  const app = express();
  app.use(express.json());
  app.use(compression());
  app.use(cors({ origin: true }));

  //   user middleware
  //   app.use("/", router);;

  app.use((err, req, res, next) => {
    res.status(500).send({ mess: config.applicationName });
  });

  return app;
};
