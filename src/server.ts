import http from "http";
import express from "express";
import config from "./config/config";
import logging from "./config/logging";
import { Server } from "socket.io";
import api from "./routes/api";
import main from "./routes/main";
import { connection } from "./handlers/sockets";
import { logger, notFound } from "./handlers/middleware";

const NAMESPACE = "index";
const HOST = config.server.host;
const PORT = config.server.port;

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

/**
 * Puts url encoded data into the request body
 */
app.use(express.urlencoded({extended: false}));

/**
 * Converts the request body to json
 */
app.use(express.json());

/**
 * Logs all requests and responses
 */
app.use(logger);

/**
 * Routes to the api router
 */
app.use("/api", api);

/**
 * Routes to the main router
 */
app.use("/", main);

/**
 * If route is not in routers, find file in public files
 */
app.use(express.static("public"));

/**
 * 404 Error handling
 */
app.use(notFound);

/**
 * Socket Connection
 */
io.on("connection", connection);

/**
 * Start listening on port
 */
server.listen(PORT, HOST, () => {
  logging.info(NAMESPACE, `Server running on http://${HOST}:${PORT}`);
});

export default {
  app,
  server,
  io,
};
