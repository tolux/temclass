import http from "http";
import appService from "./appServices";

const config = require("../config")[process.env.NODE_ENV || "development"];

const log = config.log();

const service = appService(config);

const port = process.env.PORT || "4000";

const servicesServer = http.createServer(service);

servicesServer.listen(port);

servicesServer.on("listening", () => {
  log.info(
    `Hi there! I'm listening on port ${
      servicesServer.address().port
    } in ${service.get("env")} mode.`
  );
});
