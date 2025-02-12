import express from "express";
import { getEnv } from "./utils";
import { NotFound } from "./interface";
import Route from "./handlers/Route";
import Database from "./handlers/Database";
import log, { getMethodColor, getStatusCodeColor } from "./utils/log";
import cookieParser from "cookie-parser";
import Matchmaker from "./matchmaker/Matchmaker";
import Schedule from "./utils/storefront/ScheduleStorefront";
import path from "node:path";
import fs from "node:fs";
import winston from "winston";

const logsDirectory = path.join(process.env.LOCALAPPDATA as string, "Sirius");
if (!fs.existsSync(logsDirectory)) fs.mkdirSync(logsDirectory);

const app = express();

winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, "Sirius.log"),
    }),
  ],
});

const PORT = getEnv("PORT") || 5555;

(async () => {
  try {
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    await Route.initializeRoutes(app);
    await Database.connect();

    if (getEnv("isXmppEnabled") === "true") return;
    else if (getEnv("isXmppEnabled") === "false") {
    }

    if (getEnv("isMatchmakerEnabled") === "true") new Matchmaker().start();
    else if (getEnv("isMatchmakerEnabled") === "false") {
    }

    app.use((req, res, next) => {
      const startTime = process.hrtime();
      res.setHeader("Content-Type", "application/json");

      const endTime = process.hrtime(startTime);
      const durationInMs = (endTime[0] * 1e9 + endTime[1]) / 1e6;

      const fullUrl = `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }`;

      const methodColor = getMethodColor(req.method);
      const statusCodeColor = getStatusCodeColor(res.statusCode);

      log.info(
        `(${methodColor(req.method)}) (${statusCodeColor(
          res.statusCode
        )}) (${durationInMs}) ${fullUrl}`,
        "Server"
      );

      next();
    });

    app.use((req, res) => {
      let text: string = JSON.stringify({
        status: 404,
        errorCode: "errors.com.sirius.backend.route.not_found",
        errorMessage:
          "Sorry, the resource you were trying to find could not be found.",
        numericErrorCode: 1004,
        originatingService: "any",
        intent: "prod",
        url: req.url,
      } as NotFound);

      res.status(404).send(text);
    });

    import("./bot/deploy");
    import("./bot/bot");

    app.listen(PORT, () => {
      log.log(`Listening on http://127.0.0.1:${PORT}`, "Server", "blueBright");
    });

    await Schedule();
  } catch (error) {
    let err = error as Error;
    console.error(`Error initializing routes: ${err.message}`);
    process.exit(1);
  }
})();
