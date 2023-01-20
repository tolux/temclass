import config from "./config";
import http from "http";
import cluster from "cluster";
import os from "os";
import App from "./app";

const numCpus = os.cpus().length;

const app = App();
const Env = [process.env.NODE_ENV || "development"];

const log = config[Env].log();
const port = process.env.PORT || "5000";

app.set("port", port);

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port  ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      log.fatal(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      log.fatal(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// using cluster
// check if the process that start first
if (cluster.isMaster) {
  log.info(`Master ${process.pid} is running`);
  for (let i = 0; i < numCpus; i += 1) {
    cluster.fork();
  }

  // to check for errors
  cluster.on("exit", (worker) => {
    log.fatal(`worker ${worker.process.pid} just died`);
    cluster.fork();
  });
} else {
  server.listen(port);
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  log.info(`${config.applicationName} listening on ${bind}`);
}

server.on("error", onError);
server.on("listening", onListening);
