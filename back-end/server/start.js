// import config from "./config";
import http from "http";
import cluster from "cluster";
import os from "os";
import axios from "axios";

const config = require("./config");

const App = require("./app");
const numCpus = os.cpus().length;

const app = App(config);
const Env = [process.env.NODE_ENV || "development"];

const port = process.env.PORT || "8080";

const log = config[Env].log();

app.set("port", port);

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

const server = http.createServer(app);

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
  server.listen(0);
}

const regsiterService = () =>
  axios.put(
    `http:localhost:4000/register/${config.name}/${config.version}/${
      server.address().port
    }`
  );
const unregsiterService = () =>
  axios.delete(
    `http:localhost:4000/register/${config.name}/${config.version}/${
      server.address().port
    }`
  );

function onListening() {
  regsiterService();
  const interval = setInterval(regsiterService, 20000);

  const cleanup = async () => {
    clearInterval(interval);
    await unregsiterService();
  };

  // look for different error handle that make occur doing production on node eniroment
  // or the server environment
  process.on("uncaughtException", async () => {
    await cleanup();
    process.exit(0);
  });
  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  const addr = server.address();

  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  log.info(`${config.applicationName} listening on ${bind}`);
}

server.on("error", onError);
server.on("listening", onListening);
