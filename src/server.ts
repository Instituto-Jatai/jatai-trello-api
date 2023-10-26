import express, { Application } from "express";
import bodyParser from "body-parser";
import { Server } from "http";
import config from "./config";
import Routes from "./routes";
import cors from "cors";
import { startSchedule } from "./schedule";

const { port } = config;

const JataiServer = {
  start: (): { app: Application; server: Server } => {
    const app: Application = express();
    JataiServer.config(app);
    Routes.setupRoutes(app);

    const server = app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
      startSchedule();
    });

    server.setTimeout(500000);

    return { server, app };
  },

  config: (app: Application): void => {
    app.use(bodyParser.json({ limit: "50mb" }));

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          return callback(null, true);
        },
      }),
    );
  },

  close: (server: Server): void => {
    server.close(() => console.info("Jatai Server was closed."));
  },
};
export default JataiServer;
